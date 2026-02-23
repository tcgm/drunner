#!/usr/bin/env node
/**
 * crop-svg-icons.mjs
 *
 * Scans every SVG in src/assets/icons/items/, computes the tight bounding box
 * of all path / shape content, then sets a new square viewBox that centres
 * that content with a small margin.
 *
 * Usage:
 *   node scripts/crop-svg-icons.mjs [--dry-run] [--padding=<pct>] [--margin=<abs>]
 *
 * Options:
 *   --dry-run          Print proposed changes without writing files.
 *   --padding=N        Percentage of content size to add as padding (default 3).
 *   --margin=N         Override: absolute padding units instead of percentage.
 *   --file=name.svg    Process a single file only.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN    = args.includes('--dry-run');
const PAD_PCT    = parseFloat(args.find(a => a.startsWith('--padding='))?.split('=')[1] ?? '3');
const ABS_MARGIN = args.find(a => a.startsWith('--margin='))  ? parseFloat(args.find(a => a.startsWith('--margin='))?.split('=')[1]) : null;
const ONLY_FILE  = args.find(a => a.startsWith('--file='))?.split('=')[1] ?? null;

const ICONS_DIR = join(__dirname, '../src/assets/icons/items');

// ─── SVG path bbox (self-contained, no deps) ─────────────────────────────────
// Handles M/L/H/V/C/S/Q/T/A/Z in both absolute and relative forms.

function tokenizePath(d) {
  // Split command string into [command, ...numbers] tokens
  const tokens = [];
  const re = /([MLHVCSQTAZmlhvcsqtaz])|(-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/g;
  let m;
  while ((m = re.exec(d)) !== null) {
    if (m[1]) tokens.push(m[1]);
    else       tokens.push(parseFloat(m[2]));
  }
  return tokens;
}

/** Tight bounding box for a cubic Bezier P0..P3 on one axis */
function cubicBounds(p0, p1, p2, p3) {
  let lo = Math.min(p0, p3), hi = Math.max(p0, p3);
  // Derivative roots
  const a = -3*p0 + 9*p1 - 9*p2 + 3*p3;
  const b =  6*p0 - 12*p1 + 6*p2;
  const c = -3*p0 + 3*p1;
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) > 1e-12) {
      const t = -c / b;
      if (t > 0 && t < 1) {
        const v = cubicAt(p0,p1,p2,p3,t);
        lo = Math.min(lo, v); hi = Math.max(hi, v);
      }
    }
  } else {
    const disc = b*b - 4*a*c;
    if (disc >= 0) {
      for (const sign of [-1, 1]) {
        const t = (-b + sign * Math.sqrt(disc)) / (2*a);
        if (t > 0 && t < 1) {
          const v = cubicAt(p0,p1,p2,p3,t);
          lo = Math.min(lo, v); hi = Math.max(hi, v);
        }
      }
    }
  }
  return [lo, hi];
}
function cubicAt(p0,p1,p2,p3,t) {
  const u = 1-t;
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
}

/** Tight bounding box for a quadratic Bezier P0..P2 on one axis */
function quadBounds(p0, p1, p2) {
  let lo = Math.min(p0, p2), hi = Math.max(p0, p2);
  const denom = p0 - 2*p1 + p2;
  if (Math.abs(denom) > 1e-12) {
    const t = (p0 - p1) / denom;
    if (t > 0 && t < 1) {
      const v = (1-t)*(1-t)*p0 + 2*(1-t)*t*p1 + t*t*p2;
      lo = Math.min(lo, v); hi = Math.max(hi, v);
    }
  }
  return [lo, hi];
}

/** Bounding box for an SVG arc segment */
function arcBBox(x1, y1, rx, ry, phi, fA, fS, x2, y2) {
  // Convert endpoint parameterisation → centre parameterisation
  if (rx === 0 || ry === 0) {
    return {
      minX: Math.min(x1,x2), minY: Math.min(y1,y2),
      maxX: Math.max(x1,x2), maxY: Math.max(y1,y2)
    };
  }
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phiR = phi * Math.PI / 180;
  const cosPhi = Math.cos(phiR), sinPhi = Math.sin(phiR);
  const dx = (x1-x2)/2, dy = (y1-y2)/2;
  const x1p =  cosPhi*dx + sinPhi*dy;
  const y1p = -sinPhi*dx + cosPhi*dy;
  // Ensure radii are large enough
  const lambda = (x1p*x1p)/(rx*rx) + (y1p*y1p)/(ry*ry);
  if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda); }
  const num = (rx*rx*ry*ry - rx*rx*y1p*y1p - ry*ry*x1p*x1p);
  const den = (rx*rx*y1p*y1p + ry*ry*x1p*x1p);
  const sq = Math.max(0, num/den);
  const k = (fA === fS ? -1 : 1) * Math.sqrt(sq);
  const cxp =  k * rx * y1p / ry;
  const cyp = -k * ry * x1p / rx;
  const cx = cosPhi*cxp - sinPhi*cyp + (x1+x2)/2;
  const cy = sinPhi*cxp + cosPhi*cyp + (y1+y2)/2;
  // Extreme points
  const txs = [-Math.atan2(-ry*sinPhi, rx*cosPhi), Math.PI - Math.atan2(-ry*sinPhi, rx*cosPhi)];
  const tys = [ Math.atan2( ry*cosPhi, rx*sinPhi), Math.PI + Math.atan2( ry*cosPhi, rx*sinPhi)];
  const pts = [[x1,y1],[x2,y2]];
  for (const t of txs) {
    pts.push([cx + rx*Math.cos(t)*cosPhi - ry*Math.sin(t)*sinPhi,
              cy + rx*Math.cos(t)*sinPhi + ry*Math.sin(t)*cosPhi]);
  }
  for (const t of tys) {
    pts.push([cx + rx*Math.cos(t)*cosPhi - ry*Math.sin(t)*sinPhi,
              cy + rx*Math.cos(t)*sinPhi + ry*Math.sin(t)*cosPhi]);
  }
  return {
    minX: Math.min(...pts.map(p=>p[0])), minY: Math.min(...pts.map(p=>p[1])),
    maxX: Math.max(...pts.map(p=>p[0])), maxY: Math.max(...pts.map(p=>p[1]))
  };
}

/**
 * Compute tight [minX, minY, maxX, maxY] bounding box for an SVG path `d`.
 */
function pathBBox(d) {
  const tokens = tokenizePath(d);
  let i = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let cx = 0, cy = 0;       // current point
  let startX = 0, startY = 0; // subpath start
  let lastCmd = '';
  let lastCPx = 0, lastCPy = 0; // last control point (for S/T)

  function consume(n) {
    const vals = tokens.slice(i, i+n);
    i += n;
    return vals;
  }
  function expandXY(x, y) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }

  while (i < tokens.length) {
    const cmd = tokens[i];
    if (typeof cmd !== 'string') { i++; continue; }
    i++;
    const abs = cmd === cmd.toUpperCase();
    const lc  = cmd.toLowerCase();

    // Helper: make absolute
    const ax = (v) => abs ? v : cx + v;
    const ay = (v) => abs ? v : cy + v;

    switch (lc) {
      case 'm': {
        const [x, y] = consume(2);
        cx = ax(x); cy = ay(y);
        startX = cx; startY = cy;
        expandXY(cx, cy);
        // Subsequent pairs are implicit lineto
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [lx, ly] = consume(2);
          cx = ax(lx); cy = ay(ly);
          expandXY(cx, cy);
        }
        lastCmd = 'l';
        break;
      }
      case 'l': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x, y] = consume(2);
          cx = ax(x); cy = ay(y);
          expandXY(cx, cy);
        }
        break;
      }
      case 'h': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x] = consume(1);
          cx = abs ? x : cx + x;
          expandXY(cx, cy);
        }
        break;
      }
      case 'v': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [y] = consume(1);
          cy = abs ? y : cy + y;
          expandXY(cx, cy);
        }
        break;
      }
      case 'c': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x1,y1, x2,y2, x,y] = consume(6);
          const ax1 = ax(x1), ay1 = ay(y1);
          const ax2 = ax(x2), ay2 = ay(y2);
          const ax0 = ax(x),  ay0 = ay(y);
          const [lox, hix] = cubicBounds(cx, ax1, ax2, ax0);
          const [loy, hiy] = cubicBounds(cy, ay1, ay2, ay0);
          minX = Math.min(minX, lox); maxX = Math.max(maxX, hix);
          minY = Math.min(minY, loy); maxY = Math.max(maxY, hiy);
          lastCPx = ax2; lastCPy = ay2;
          cx = ax0; cy = ay0;
        }
        lastCmd = 'c';
        break;
      }
      case 's': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x2,y2, x,y] = consume(4);
          // Smooth: first CP is reflection of last CP
          const x1 = (lastCmd === 'c' || lastCmd === 's') ? 2*cx - lastCPx : cx;
          const y1 = (lastCmd === 'c' || lastCmd === 's') ? 2*cy - lastCPy : cy;
          const ax2 = ax(x2), ay2 = ay(y2);
          const ax0 = ax(x),  ay0 = ay(y);
          const [lox, hix] = cubicBounds(cx, x1, ax2, ax0);
          const [loy, hiy] = cubicBounds(cy, y1, ay2, ay0);
          minX = Math.min(minX, lox); maxX = Math.max(maxX, hix);
          minY = Math.min(minY, loy); maxY = Math.max(maxY, hiy);
          lastCPx = ax2; lastCPy = ay2;
          cx = ax0; cy = ay0;
          lastCmd = 's';
        }
        break;
      }
      case 'q': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x1,y1, x,y] = consume(4);
          const ax1 = ax(x1), ay1 = ay(y1);
          const ax0 = ax(x),  ay0 = ay(y);
          const [lox, hix] = quadBounds(cx, ax1, ax0);
          const [loy, hiy] = quadBounds(cy, ay1, ay0);
          minX = Math.min(minX, lox); maxX = Math.max(maxX, hix);
          minY = Math.min(minY, loy); maxY = Math.max(maxY, hiy);
          lastCPx = ax1; lastCPy = ay1;
          cx = ax0; cy = ay0;
        }
        lastCmd = 'q';
        break;
      }
      case 't': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x,y] = consume(2);
          const x1 = (lastCmd === 'q' || lastCmd === 't') ? 2*cx - lastCPx : cx;
          const y1 = (lastCmd === 'q' || lastCmd === 't') ? 2*cy - lastCPy : cy;
          const ax0 = ax(x), ay0 = ay(y);
          const [lox, hix] = quadBounds(cx, x1, ax0);
          const [loy, hiy] = quadBounds(cy, y1, ay0);
          minX = Math.min(minX, lox); maxX = Math.max(maxX, hix);
          minY = Math.min(minY, loy); maxY = Math.max(maxY, hiy);
          lastCPx = x1; lastCPy = y1;
          cx = ax0; cy = ay0;
          lastCmd = 't';
        }
        break;
      }
      case 'a': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [rx, ry, phi, fA, fS, x, y] = consume(7);
          const ax0 = ax(x), ay0 = ay(y);
          const bb = arcBBox(cx, cy, rx, ry, phi, fA, fS, ax0, ay0);
          minX = Math.min(minX, bb.minX); maxX = Math.max(maxX, bb.maxX);
          minY = Math.min(minY, bb.minY); maxY = Math.max(maxY, bb.maxY);
          cx = ax0; cy = ay0;
        }
        break;
      }
      case 'z': {
        cx = startX; cy = startY;
        break;
      }
    }
    if (lc !== 'c' && lc !== 's') { lastCPx = cx; lastCPy = cy; }
    if (lc !== 'q' && lc !== 't') { lastCPx = cx; lastCPy = cy; }
    if (lc !== 'c' && lc !== 's' && lc !== 'q' && lc !== 't') lastCmd = lc;
  }

  return { minX, minY, maxX, maxY };
}

// ─── Shape bbox helpers ───────────────────────────────────────────────────────

function rectBBox(attrs) {
  const x = parseFloat(attrs.x ?? '0');
  const y = parseFloat(attrs.y ?? '0');
  const w = parseFloat(attrs.width ?? '0');
  const h = parseFloat(attrs.height ?? '0');
  return { minX: x, minY: y, maxX: x+w, maxY: y+h };
}
function circleBBox(attrs) {
  const cx = parseFloat(attrs.cx ?? '0');
  const cy = parseFloat(attrs.cy ?? '0');
  const r  = parseFloat(attrs.r  ?? '0');
  return { minX: cx-r, minY: cy-r, maxX: cx+r, maxY: cy+r };
}
function ellipseBBox(attrs) {
  const cx = parseFloat(attrs.cx ?? '0');
  const cy = parseFloat(attrs.cy ?? '0');
  const rx = parseFloat(attrs.rx ?? '0');
  const ry = parseFloat(attrs.ry ?? '0');
  return { minX: cx-rx, minY: cy-ry, maxX: cx+rx, maxY: cy+ry };
}
function polyBBox(pointsStr) {
  const pts = pointsStr.trim().split(/[\s,]+/).map(Number);
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for (let i=0;i<pts.length;i+=2) {
    if (isFinite(pts[i]))   { minX=Math.min(minX,pts[i]);   maxX=Math.max(maxX,pts[i]);   }
    if (isFinite(pts[i+1])) { minY=Math.min(minY,pts[i+1]); maxY=Math.max(maxY,pts[i+1]); }
  }
  return {minX,minY,maxX,maxY};
}

// ─── SVG attribute extraction ─────────────────────────────────────────────────

function attr(tag, name) {
  const m = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i').exec(tag);
  return m ? m[1] : null;
}
function allAttrs(tag) {
  const obj = {};
  const re = /\b(\w[\w-]*)="([^"]*)"/g;
  let m;
  while ((m = re.exec(tag)) !== null) obj[m[1]] = m[2];
  return obj;
}

// ─── Parse 2D transform (translate/scale/matrix/rotate) ──────────────────────
// Returns {a,b,c,d,e,f} (column-major 2D matrix, like CSS matrix())

function parseTransform(t) {
  if (!t) return null;
  // matrix
  let m = /matrix\(\s*([-\d.e+]+)[\s,]+([-\d.e+]+)[\s,]+([-\d.e+]+)[\s,]+([-\d.e+]+)[\s,]+([-\d.e+]+)[\s,]+([-\d.e+]+)\s*\)/i.exec(t);
  if (m) return { a:+m[1],b:+m[2],c:+m[3],d:+m[4],e:+m[5],f:+m[6] };
  m = /translate\(\s*([-\d.e+]+)(?:[\s,]+([-\d.e+]+))?\s*\)/i.exec(t);
  if (m) return { a:1,b:0,c:0,d:1,e:+m[1],f:+(m[2]??0) };
  m = /scale\(\s*([-\d.e+]+)(?:[\s,]+([-\d.e+]+))?\s*\)/i.exec(t);
  if (m) { const sx=+m[1],sy=+(m[2]??m[1]); return {a:sx,b:0,c:0,d:sy,e:0,f:0}; }
  m = /rotate\(\s*([-\d.e+]+)(?:[\s,]+([-\d.e+]+)[\s,]+([-\d.e+]+))?\s*\)/i.exec(t);
  if (m) {
    const ang = +m[1]*Math.PI/180;
    const px  = +(m[2]??0), py = +(m[3]??0);
    const cos = Math.cos(ang), sin = Math.sin(ang);
    return { a:cos, b:sin, c:-sin, d:cos, e:px-px*cos+py*sin, f:py-px*sin-py*cos };
  }
  return null;
}

function applyTransform(bb, tf) {
  if (!tf) return bb;
  const { a,b,c,d,e,f } = tf;
  const corners = [
    [bb.minX, bb.minY], [bb.maxX, bb.minY],
    [bb.minX, bb.maxY], [bb.maxX, bb.maxY]
  ];
  const xs = corners.map(([x,y]) => a*x + c*y + e);
  const ys = corners.map(([x,y]) => b*x + d*y + f);
  return { minX:Math.min(...xs), maxX:Math.max(...xs), minY:Math.min(...ys), maxY:Math.max(...ys) };
}

function multiplyTransforms(parent, child) {
  if (!parent) return child;
  if (!child) return parent;
  const {a:a1,b:b1,c:c1,d:d1,e:e1,f:f1} = parent;
  const {a:a2,b:b2,c:c2,d:d2,e:e2,f:f2} = child;
  return {
    a: a1*a2 + c1*b2,  b: b1*a2 + d1*b2,
    c: a1*c2 + c1*d2,  d: b1*c2 + d1*d2,
    e: a1*e2 + c1*f2 + e1, f: b1*e2 + d1*f2 + f1,
  };
}

// ─── Walk SVG DOM-like structure from raw text ────────────────────────────────

/**
 * Walk through SVG content with a stack of transforms.
 * Returns {minX,minY,maxX,maxY} of all shapes found.
 */
function computeSVGBBox(svgText) {
  let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;

  function expand(bb, tf) {
    if (!bb || !isFinite(bb.minX)) return;
    const tbb = applyTransform(bb, tf);
    minX = Math.min(minX, tbb.minX); maxX = Math.max(maxX, tbb.maxX);
    minY = Math.min(minY, tbb.minY); maxY = Math.max(maxY, tbb.maxY);
  }

  // Track transform stack through a simple linear scan of open tags
  // We parse <g transform="..."> and </g> to maintain a stack
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9_-]*)(\s[^>]*)?\s*\/?>/g;
  const transformStack = [null]; // null = identity
  let m;

  while ((m = tagRe.exec(svgText)) !== null) {
    const closing = m[1] === '/';
    const tag      = m[2].toLowerCase();
    const attrsStr = m[3] ?? '';

    if (closing) {
      if (tag === 'g' && transformStack.length > 1) transformStack.pop();
      continue;
    }

    const isSelfClosing = m[0].endsWith('/>');
    const currentTf = transformStack[transformStack.length - 1];

    if (tag === 'g') {
      const tfStr = attr(attrsStr, 'transform');
      const localTf = parseTransform(tfStr);
      const combined = localTf ? multiplyTransforms(currentTf, localTf) : currentTf;
      if (!isSelfClosing) transformStack.push(combined);
      continue;
    }

    const a = allAttrs(attrsStr);

    switch (tag) {
      case 'path': {
        const d = a['d'];
        if (!d) break;
        try {
          const bb = pathBBox(d);
          if (isFinite(bb.minX)) expand(bb, currentTf);
        } catch { /* skip bad paths */ }
        break;
      }
      case 'rect':    expand(rectBBox(a), currentTf); break;
      case 'circle':  expand(circleBBox(a), currentTf); break;
      case 'ellipse': expand(ellipseBBox(a), currentTf); break;
      case 'polygon':
      case 'polyline': {
        const pts = a['points'];
        if (pts) expand(polyBBox(pts), currentTf);
        break;
      }
      case 'line': {
        const bb = {
          minX: Math.min(+(a.x1??0), +(a.x2??0)),
          minY: Math.min(+(a.y1??0), +(a.y2??0)),
          maxX: Math.max(+(a.x1??0), +(a.x2??0)),
          maxY: Math.max(+(a.y1??0), +(a.y2??0)),
        };
        expand(bb, currentTf);
        break;
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

// ─── viewBox helpers ──────────────────────────────────────────────────────────

function parseViewBox(text) {
  const m = /viewBox="([^"]*)"/i.exec(text);
  if (!m) return null;
  const p = m[1].trim().split(/[\s,]+/).map(Number);
  if (p.length < 4 || p.some(isNaN)) return null;
  return { x: p[0], y: p[1], w: p[2], h: p[3] };
}

function setViewBox(text, vb) {
  const s = `${r(vb.x)} ${r(vb.y)} ${r(vb.w)} ${r(vb.h)}`;
  if (/viewBox="[^"]*"/i.test(text))
    return text.replace(/viewBox="[^"]*"/i, `viewBox="${s}"`);
  // Inject into opening <svg> tag
  return text.replace(/(<svg\b[^>]*?)(\s*\/?>)/, `$1 viewBox="${s}"$2`);
}

const r = n => Math.round(n * 100) / 100;

// ─── Process a single file ────────────────────────────────────────────────────

function processFile(filePath) {
  const filename = filePath.replace(/^.*[/\\]/, '');
  const content  = readFileSync(filePath, 'utf-8');

  const oldVB = parseViewBox(content);

  const bbox = computeSVGBBox(content);

  if (!isFinite(bbox.minX)) {
    console.log(`  ${filename}: ⚠  No computable content found, skipping.`);
    return;
  }

  const contentW = bbox.maxX - bbox.minX;
  const contentH = bbox.maxY - bbox.minY;

  if (contentW < 1 || contentH < 1) {
    console.log(`  ${filename}: ⚠  Degenerate bbox (${r(contentW)}×${r(contentH)}), skipping.`);
    return;
  }

  // Determine padding
  const pad = ABS_MARGIN != null
    ? ABS_MARGIN
    : Math.max(contentW, contentH) * (PAD_PCT / 100);

  const paddedX = bbox.minX - pad;
  const paddedY = bbox.minY - pad;
  const paddedW = contentW + pad * 2;
  const paddedH = contentH + pad * 2;

  // Center in a square
  const size = Math.max(paddedW, paddedH);
  const cx   = paddedX + paddedW / 2;
  const cy   = paddedY + paddedH / 2;

  const newVB = {
    x: r(cx - size / 2),
    y: r(cy - size / 2),
    w: r(size),
    h: r(size),
  };

  const oldStr = oldVB ? `${oldVB.x} ${oldVB.y} ${oldVB.w} ${oldVB.h}` : '(none)';
  const newStr = `${newVB.x} ${newVB.y} ${newVB.w} ${newVB.h}`;

  const changed = oldStr !== newStr;

  console.log(`  ${filename}:`);
  console.log(`    Content bbox : [${r(bbox.minX)}, ${r(bbox.minY)}] → [${r(bbox.maxX)}, ${r(bbox.maxY)}]  (${r(contentW)}×${r(contentH)})`);
  console.log(`    Old viewBox  : ${oldStr}`);
  console.log(`    New viewBox  : ${newStr}${changed ? ' ✓' : '  (unchanged)'}`);

  if (!changed) return;

  if (!DRY_RUN) {
    let updated = setViewBox(content, newVB);
    // Also strip misleading width/height attrs that conflict with viewBox
    updated = updated.replace(/\s+width="\d+(?:\.\d+)?pt"/gi, '');
    updated = updated.replace(/\s+height="\d+(?:\.\d+)?pt"/gi, '');
    writeFileSync(filePath, updated, 'utf-8');
    console.log(`    -> Written.`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('SVG Icon Cropper');
  console.log(`Dir     : ${ICONS_DIR}`);
  console.log(`Padding : ${ABS_MARGIN != null ? ABS_MARGIN + ' units' : PAD_PCT + '%'}`);
  console.log(`Mode    : ${DRY_RUN ? 'dry-run (no writes)' : 'write'}`);
  console.log('');

  let files = readdirSync(ICONS_DIR).filter(f => f.endsWith('.svg'));
  if (ONLY_FILE) {
    files = files.filter(f => f === ONLY_FILE);
    if (!files.length) {
      console.error(`File not found: ${ONLY_FILE}`);
      process.exit(1);
    }
  }

  let modified = 0;
  for (const file of files) {
    processFile(join(ICONS_DIR, file));
    console.log('');
    modified++;
  }

  console.log(`Done — processed ${modified}/${files.length} SVG file(s).`);
  if (DRY_RUN) console.log('(dry-run: no files were modified)');
}

main();
