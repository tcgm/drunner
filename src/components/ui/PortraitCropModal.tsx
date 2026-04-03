/**
 * PortraitCropModal – Discord-style image editor modal.
 * Drag to pan, scroll/pinch to zoom, then Apply to save a square crop.
 */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  HStack,
  VStack,
  Text,
  Button,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Icon,
} from '@chakra-ui/react'
import { GiResize, GiArrowCursor } from 'react-icons/gi'
import { useRef, useEffect, useState, useCallback } from 'react'

interface PortraitCropModalProps {
  isOpen: boolean
  onClose: () => void
  /** Raw image src (data URL or object URL) of the uploaded file */
  imageSrc: string
  /** Called with final square JPEG or PNG data URL */
  onApply: (dataUrl: string) => void
  /** Output size in pixels (default 400) */
  outputSize?: number
  /** Output image format (default 'jpeg'). Use 'png' to preserve transparency. */
  outputFormat?: 'jpeg' | 'png'
}

const CANVAS_SIZE = 320 // display canvas size in CSS px
const MAX_ZOOM = 5

export function PortraitCropModal({
  isOpen,
  onClose,
  imageSrc,
  onApply,
  outputSize = 400,
  outputFormat = 'jpeg',
}: PortraitCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // image natural dimensions
  const [imgSize, setImgSize] = useState({ w: 1, h: 1 })
  // minimum zoom so the image always covers the full canvas (no black gaps)
  const [minZoom, setMinZoom] = useState(0.2)

  // transform state: offset = top-left of the image in canvas coords
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // drag state (stored in ref to avoid stale closures during mousemove)
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; startOffsetX: number; startOffsetY: number }>({
    active: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0,
  })

  // pinch state
  const lastPinchDistRef = useRef<number | null>(null)

  // ── Load image ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !imageSrc) return
    const img = new window.Image()
    img.onload = () => {
      imgRef.current = img
      const { naturalWidth: w, naturalHeight: h } = img
      setImgSize({ w, h })

      // Fit image to canvas initially: scale so the image covers the full canvas
      const fitZoom = Math.max(CANVAS_SIZE / w, CANVAS_SIZE / h)
      const initZoom = fitZoom
      setMinZoom(fitZoom)
      const drawnW = w * initZoom
      const drawnH = h * initZoom
      setZoom(initZoom)
      setOffset({ x: (CANVAS_SIZE - drawnW) / 2, y: (CANVAS_SIZE - drawnH) / 2 })
    }
    img.src = imageSrc
  }, [isOpen, imageSrc])

  // ── Redraw canvas ────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw image
    const dw = imgSize.w * zoom
    const dh = imgSize.h * zoom
    ctx.drawImage(img, offset.x, offset.y, dw, dh)

    // Square crop border
    ctx.save()
    ctx.strokeStyle = 'rgba(251,146,60,0.9)'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2)
    ctx.restore()
  }, [zoom, offset, imgSize])

  useEffect(() => { draw() }, [draw])

  // ── Clamp helper: keep image covering the crop circle ───────────────────────
  const clampOffset = useCallback((ox: number, oy: number, z: number) => {
    const dw = imgSize.w * z
    const dh = imgSize.h * z
    // Image must cover the full canvas (circle is inscribed)
    const minX = CANVAS_SIZE - dw
    const minY = CANVAS_SIZE - dh
    return {
      x: Math.min(0, Math.max(minX, ox)),
      y: Math.min(0, Math.max(minY, oy)),
    }
  }, [imgSize])

  // ── Mouse handlers ───────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startOffsetX: offset.x, startOffsetY: offset.y }
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    const d = dragRef.current
    if (!d.active) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    setOffset(prev => clampOffset(d.startOffsetX + dx, d.startOffsetY + dy, zoom))
  }, [zoom, clampOffset])

  const onMouseUp = () => { dragRef.current.active = false }

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.08 : 0.92
    setZoom(prev => {
      const next = Math.min(MAX_ZOOM, Math.max(minZoom, prev * factor))
      // zoom toward canvas center
      const cx = CANVAS_SIZE / 2
      const cy = CANVAS_SIZE / 2
      setOffset(prevOff => {
        const nx = cx - (cx - prevOff.x) * (next / prev)
        const ny = cy - (cy - prevOff.y) * (next / prev)
        return clampOffset(nx, ny, next)
      })
      return next
    })
  }, [clampOffset, minZoom])

  // ── Touch handlers ───────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0]
      dragRef.current = { active: true, startX: t.clientX, startY: t.clientY, startOffsetX: offset.x, startOffsetY: offset.y }
      lastPinchDistRef.current = null
    } else if (e.touches.length === 2) {
      dragRef.current.active = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastPinchDistRef.current = Math.hypot(dx, dy)
    }
  }

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1 && dragRef.current.active) {
      const t = e.touches[0]
      const d = dragRef.current
      setOffset(prev => clampOffset(d.startOffsetX + t.clientX - d.startX, d.startOffsetY + t.clientY - d.startY, zoom))
    } else if (e.touches.length === 2 && lastPinchDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const newDist = Math.hypot(dx, dy)
      const factor = newDist / lastPinchDistRef.current
      lastPinchDistRef.current = newDist
      setZoom(prev => {
        const next = Math.min(MAX_ZOOM, Math.max(minZoom, prev * factor))
        const cx = CANVAS_SIZE / 2
        const cy = CANVAS_SIZE / 2
        setOffset(prevOff => {
          const nx = cx - (cx - prevOff.x) * (next / prev)
          const ny = cy - (cy - prevOff.y) * (next / prev)
          return clampOffset(nx, ny, next)
        })
        return next
      })
    }
  }, [zoom, clampOffset, minZoom])

  const onTouchEnd = () => { dragRef.current.active = false; lastPinchDistRef.current = null }

  // ── Global mouse move/up ─────────────────────────────────────────────────────
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove])

  // ── Zoom slider handler ──────────────────────────────────────────────────────
  const handleSliderChange = (val: number) => {
    const next = val
    const cx = CANVAS_SIZE / 2
    const cy = CANVAS_SIZE / 2
    setOffset(prevOff => {
      const nx = cx - (cx - prevOff.x) * (next / zoom)
      const ny = cy - (cy - prevOff.y) * (next / zoom)
      return clampOffset(nx, ny, next)
    })
    setZoom(next)
  }

  // ── Apply: render final square crop at outputSize ────────────────────────────
  const handleApply = () => {
    const img = imgRef.current
    if (!img) return

    const out = document.createElement('canvas')
    out.width = outputSize
    out.height = outputSize

    const ctx = out.getContext('2d')!

    // For PNG: leave background transparent. For JPEG: fill white to avoid black.
    if (outputFormat === 'jpeg') {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, outputSize, outputSize)
    }

    // Draw the cropped region (full square)
    const srcX = (0 - offset.x) / zoom
    const srcY = (0 - offset.y) / zoom
    const srcW = CANVAS_SIZE / zoom
    const srcH = CANVAS_SIZE / zoom
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outputSize, outputSize)

    const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg'
    const quality = outputFormat === 'jpeg' ? 0.9 : undefined
    const dataUrl = out.toDataURL(mimeType, quality)
    onApply(dataUrl)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(8px)" />
      <ModalContent bg="gray.900" borderWidth="2px" borderColor="orange.700" borderRadius="2xl" overflow="hidden">
        <ModalHeader borderBottom="1px solid" borderColor="gray.700" pb={3}>
          <Text fontSize="md" fontWeight="bold" color="orange.300">Edit Portrait</Text>
          <Text fontSize="xs" color="gray.500" fontWeight="normal" mt={0.5}>
            Drag to reposition · Scroll or pinch to zoom
          </Text>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody p={0}>
          <VStack spacing={0}>
            {/* Canvas */}
            <Box
              bg="gray.950"
              width={`${CANVAS_SIZE}px`}
              height={`${CANVAS_SIZE}px`}
              cursor="grab"
              _active={{ cursor: 'grabbing' }}
              userSelect="none"
              overflow="hidden"
              mx="auto"
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{ display: 'block', width: CANVAS_SIZE, height: CANVAS_SIZE, touchAction: 'none' }}
                onMouseDown={onMouseDown}
                onWheel={onWheel}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
            </Box>

            {/* Zoom slider */}
            <Box px={6} py={4} w="full" bg="gray.850">
              <HStack spacing={3}>
                <Icon as={GiArrowCursor} color="gray.500" boxSize={4} flexShrink={0} />
                <Slider
                  min={minZoom}
                  max={MAX_ZOOM}
                  step={0.01}
                  value={zoom}
                  onChange={handleSliderChange}
                  flex={1}
                  focusThumbOnChange={false}
                >
                  <SliderTrack bg="gray.700">
                    <SliderFilledTrack bg="orange.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={5} bg="orange.400" border="2px solid" borderColor="orange.600" />
                </Slider>
                <Icon as={GiResize} color="gray.500" boxSize={5} flexShrink={0} />
              </HStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.700" gap={2}>
          <Button variant="ghost" colorScheme="gray" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="orange" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
