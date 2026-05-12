import { GAME_CONFIG } from '../src/config/gameConfig'
const tb = GAME_CONFIG.combat.turnBased

// Best DPT from last balance run (best class per floor)
const bestDpt: Record<number, number> = { 1: 134, 10: 258, 20: 397, 40: 758, 60: 1260, 80: 1965, 100: 1907 }
const floors = [1, 10, 20, 40, 60, 80, 100]

function danger(f: number) {
  const w = tb.dangerWeights
  let d = f * w.floor
  const cfg = tb.earlyBossScaling
  if (cfg.enabled && f <= cfg.maxFloor) {
    const red = Math.max(0, cfg.baseReduction - (f - 1) * cfg.taperPerFloor)
    d = d * (1 - red)
  }
  return d
}

const hpFactors = [0.20, 0.30, 0.40, 0.50]

console.log('hp factor |  ' + floors.map(f => ('F' + f).padStart(6)).join('  '))
console.log('TTK turns:')
for (const hf of hpFactors) {
  const ttks = floors.map(f => {
    const d = danger(f)
    const hp = Math.round(500 * (1 + (d - 1) * hf))
    const dpt = bestDpt[f]
    return (hp / dpt).toFixed(0)
  })
  console.log(('  ' + hf).padEnd(10) + '|  ' + ttks.map(t => t.padStart(6)).join('  '))
}

console.log('\nBoss HP values:')
for (const hf of hpFactors) {
  const hps = floors.map(f => {
    const d = danger(f)
    return Math.round(500 * (1 + (d - 1) * hf))
  })
  console.log(('  ' + hf).padEnd(10) + '|  ' + hps.map(h => h.toFixed(0).padStart(6)).join('  '))
}
