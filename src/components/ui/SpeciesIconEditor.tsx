import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DragEvent as ReactDragEvent } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  Box,
  Button,
  HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { ALL_SPECIES } from '@/data/heroes/species'
import type { HeroSpecies } from '@/types'
import { ALL_CLASSES, UNIQUE_CLASSES } from '@/data/classes'
import { HeroIcon } from '@/components/ui/HeroIcon'

const EDITOR_CLASSES = [...ALL_CLASSES, ...UNIQUE_CLASSES]
/** null = the species-wide default offset, used by any class without its own override */
const DEFAULT_CLASS_VALUE = ''

type Format = 'svg' | 'png'
type Variant = 'v1' | 'v2_frame' | 'v3_addon' | 'v4_badge'
type Side = 'background' | 'foreground'

interface Offset {
  x: number
  y: number
  scale: number
}

type SourceSelection =
  | { kind: 'preset'; format: Format; variant: Variant }
  | { kind: 'custom'; format: Format }

interface SourceManifest {
  presets: Record<Format, Record<Variant, string[]>>
  custom: Record<Side, Record<Format, string[]>>
}

const VARIANTS: Variant[] = ['v1', 'v2_frame', 'v3_addon', 'v4_badge']
const FORMATS: Format[] = ['svg', 'png']
const DEFAULT_OFFSET: Offset = { x: 0, y: 0, scale: 1 }
const PREVIEW_SIZE = 240
const SNAP_POSITIONS = [-33.3, 0, 33.3]
const SNAP_THRESHOLD = 3
const SNAP_SCALE = 1
const SNAP_SCALE_THRESHOLD = 0.05

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function snapAxisValue(raw: number): { value: number; snap: number | null } {
  for (const p of SNAP_POSITIONS) {
    if (Math.abs(raw - p) <= SNAP_THRESHOLD) return { value: p, snap: p }
  }
  return { value: raw, snap: null }
}

function snapScaleValue(raw: number): number {
  return Math.abs(raw - SNAP_SCALE) <= SNAP_SCALE_THRESHOLD ? SNAP_SCALE : raw
}

function previewUrl(selection: SourceSelection, speciesId: string, side: Side): string {
  const id = encodeURIComponent(speciesId)
  if (selection.kind === 'preset') {
    return `/__species-tool/preview?kind=preset&format=${selection.format}&variant=${selection.variant}&id=${id}`
  }
  return `/__species-tool/preview?kind=custom&format=${selection.format}&side=${side}&id=${id}`
}

function offsetTransform(offset: Offset): string {
  return `translate(${offset.x}%, ${offset.y}%) scale(${offset.scale})`
}

interface SidePanelState {
  selection: SourceSelection | null
  /** Offset used by any class without its own entry in offsetsByClass, and by the "Default" target itself. */
  defaultOffset: Offset
  offsetsByClass: Record<string, Offset>
  localPreviewUrl?: string
  uploading?: boolean
}

const EMPTY_SIDE_STATE: SidePanelState = { selection: null, defaultOffset: DEFAULT_OFFSET, offsetsByClass: {} }

/** The offset to show/edit for a given target ('' = Default) - falls back to the species default when the class has no override yet. */
function resolveOffset(state: SidePanelState, classId: string): Offset {
  return (classId && state.offsetsByClass[classId]) || state.defaultOffset
}

function SourcePicker({
  speciesId,
  manifest,
  side,
  state,
  onSelect,
  onUpload,
}: {
  speciesId: string
  manifest: SourceManifest | null
  side: Side
  state: SidePanelState
  onSelect: (selection: SourceSelection | null) => void
  onUpload: (file: File) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const customFormat: Format | undefined =
    state.selection?.kind === 'custom'
      ? state.selection.format
      : manifest?.custom[side].svg.includes(speciesId)
        ? 'svg'
        : manifest?.custom[side].png.includes(speciesId)
          ? 'png'
          : undefined
  const customThumb = state.localPreviewUrl ?? (customFormat ? previewUrl({ kind: 'custom', format: customFormat }, speciesId, side) : undefined)
  const isCustomSelected = state.selection?.kind === 'custom'

  return (
    <VStack align="stretch" spacing={2}>
      <Text fontSize="sm" fontWeight="bold" color="gray.300" textTransform="capitalize">
        {side}
      </Text>
      <SimpleGrid columns={5} spacing={2}>
        <Box
          key="none"
          borderWidth={2}
          borderColor={state.selection === null ? 'yellow.400' : 'gray.600'}
          borderRadius="md"
          p={1}
          cursor="pointer"
          onClick={() => onSelect(null)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="56px"
        >
          <Text fontSize="xs" color="gray.400">None</Text>
        </Box>
        {FORMATS.flatMap(format =>
          VARIANTS.map(variant => {
            const available = manifest?.presets[format]?.[variant]?.includes(speciesId) ?? false
            const isSelected = state.selection?.kind === 'preset' && state.selection.format === format && state.selection.variant === variant
            return (
              <Box
                key={`${format}-${variant}`}
                borderWidth={2}
                borderColor={isSelected ? 'yellow.400' : 'gray.600'}
                borderRadius="md"
                p={1}
                opacity={available ? 1 : 0.3}
                cursor={available ? 'pointer' : 'not-allowed'}
                onClick={() => available && onSelect({ kind: 'preset', format, variant })}
                h="56px"
              >
                {available ? (
                  <Image
                    src={previewUrl({ kind: 'preset', format, variant }, speciesId, side)}
                    boxSize="100%"
                    objectFit="contain"
                    alt={`${variant} ${format}`}
                  />
                ) : (
                  <Text fontSize="2xs" color="gray.500" textAlign="center">n/a</Text>
                )}
                <Text fontSize="2xs" color="gray.400" textAlign="center" mt={-1}>
                  {variant} ({format})
                </Text>
              </Box>
            )
          })
        )}
        <Box
          key="custom"
          position="relative"
          borderWidth={2}
          borderStyle={isDragOver ? 'dashed' : 'solid'}
          borderColor={isDragOver ? 'cyan.300' : isCustomSelected ? 'yellow.400' : 'gray.600'}
          borderRadius="md"
          p={1}
          h="56px"
          cursor="pointer"
          onClick={() => {
            if (customThumb && customFormat) onSelect({ kind: 'custom', format: customFormat })
            else fileInputRef.current?.click()
          }}
          onDragOver={(e: ReactDragEvent) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e: ReactDragEvent) => {
            e.preventDefault()
            setIsDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) onUpload(file)
          }}
        >
          {state.uploading ? (
            <Text fontSize="2xs" color="gray.400" textAlign="center">Uploading…</Text>
          ) : isDragOver ? (
            <Text fontSize="2xs" color="cyan.300" textAlign="center">Drop it</Text>
          ) : customThumb ? (
            <Image src={customThumb} boxSize="100%" objectFit="contain" alt="custom upload" />
          ) : (
            <Text fontSize="2xs" color="cyan.300" textAlign="center">+ Upload</Text>
          )}
          {customThumb && !state.uploading && (
            <Box
              position="absolute"
              top={0}
              right={0}
              px={1}
              fontSize="2xs"
              bg="blackAlpha.700"
              borderRadius="sm"
              color="cyan.300"
              onClick={e => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              ✎
            </Box>
          )}
          <Text fontSize="2xs" color="gray.400" textAlign="center" mt={-1}>custom</Text>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,image/svg+xml,image/png"
            hidden
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) onUpload(file)
              e.target.value = ''
            }}
          />
        </Box>
      </SimpleGrid>
    </VStack>
  )
}

export default function SpeciesIconEditor() {
  const toast = useToast()
  const [speciesId, setSpeciesId] = useState<HeroSpecies>(ALL_SPECIES[0].id)
  const [classId, setClassId] = useState<string>(DEFAULT_CLASS_VALUE)
  const [manifest, setManifest] = useState<SourceManifest | null>(null)
  const [activeSide, setActiveSide] = useState<Side>('background')
  const [background, setBackground] = useState<SidePanelState>(EMPTY_SIDE_STATE)
  const [foreground, setForeground] = useState<SidePanelState>(EMPTY_SIDE_STATE)
  const [saving, setSaving] = useState(false)

  const dragState = useRef<{ startX: number; startY: number; offset: Offset } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [isPreviewDragOver, setIsPreviewDragOver] = useState(false)
  const [snapAxis, setSnapAxis] = useState<{ x: number | null; y: number | null }>({ x: null, y: null })

  useEffect(() => {
    fetch('/__species-tool/sources')
      .then(r => r.json())
      .then(setManifest)
      .catch(() => toast({ title: 'Failed to load species art sources', status: 'error' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeState = activeSide === 'background' ? background : foreground
  const setActiveState = activeSide === 'background' ? setBackground : setForeground
  const activeOffset = resolveOffset(activeState, classId)

  const updateActiveOffset = useCallback(
    (partial: Partial<Offset>) => {
      setActiveState(prev => {
        if (!classId) {
          return { ...prev, defaultOffset: { ...prev.defaultOffset, ...partial } }
        }
        // First edit for this class: branch off a copy of the default offset instead of starting from zero.
        const base = prev.offsetsByClass[classId] ?? prev.defaultOffset
        return { ...prev, offsetsByClass: { ...prev.offsetsByClass, [classId]: { ...base, ...partial } } }
      })
    },
    [setActiveState, classId]
  )

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      dragState.current = { startX: e.clientX, startY: e.clientY, offset: activeOffset }
    },
    [activeOffset]
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragState.current) return
      const dxPercent = ((e.clientX - dragState.current.startX) / PREVIEW_SIZE) * 100
      const dyPercent = ((e.clientY - dragState.current.startY) / PREVIEW_SIZE) * 100
      const rawX = clamp(dragState.current.offset.x + dxPercent, -50, 50)
      const rawY = clamp(dragState.current.offset.y + dyPercent, -50, 50)
      const snappedX = snapAxisValue(rawX)
      const snappedY = snapAxisValue(rawY)
      updateActiveOffset({ x: snappedX.value, y: snappedY.value })
      setSnapAxis({ x: snappedX.snap, y: snappedY.snap })
    },
    [updateActiveOffset]
  )

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    dragState.current = null
    setSnapAxis({ x: null, y: null })
  }, [])

  // For the Default target this zeroes the species-wide offset; for a class target it just
  // drops that class's override so it falls back to (i.e. matches) the default again.
  const resetActive = useCallback(() => {
    setActiveState(prev => {
      if (!classId) return { ...prev, defaultOffset: DEFAULT_OFFSET }
      const { [classId]: _removed, ...rest } = prev.offsetsByClass
      return { ...prev, offsetsByClass: rest }
    })
  }, [setActiveState, classId])

  const handleSpeciesChange = useCallback((id: HeroSpecies) => {
    setSpeciesId(id)
    setBackground(EMPTY_SIDE_STATE)
    setForeground(EMPTY_SIDE_STATE)
  }, [])

  // Switching class keeps the chosen art and all offsets as-is (it's the same species art for
  // every class) - the displayed offset just falls back to defaultOffset until this class gets
  // its own override via an edit.
  const handleClassChange = useCallback((id: string) => {
    setClassId(id)
  }, [])

  const handleUpload = useCallback(
    async (side: Side, file: File) => {
      const lower = file.name.toLowerCase()
      const format: Format | null = lower.endsWith('.svg') ? 'svg' : lower.endsWith('.png') ? 'png' : null
      if (!format) {
        toast({ title: 'Unsupported file type', description: 'Only .svg and .png files are supported', status: 'error' })
        return
      }
      const setState = side === 'background' ? setBackground : setForeground
      const localPreviewUrl = URL.createObjectURL(file)
      setState(prev => ({ ...prev, uploading: true, localPreviewUrl }))
      try {
        const res = await fetch(
          `/__species-tool/upload?speciesId=${encodeURIComponent(speciesId)}&side=${side}&format=${format}`,
          {
            method: 'POST',
            headers: { 'Content-Type': format === 'svg' ? 'image/svg+xml' : 'image/png' },
            body: file,
          }
        )
        const json = await res.json()
        if (!res.ok || !json.ok) throw new Error(json.error ?? 'Upload failed')
        setState(prev => ({ ...prev, selection: { kind: 'custom', format }, uploading: false }))
        setManifest(prev => {
          if (!prev) return prev
          const ids = new Set(prev.custom[side][format])
          ids.add(speciesId)
          return { ...prev, custom: { ...prev.custom, [side]: { ...prev.custom[side], [format]: [...ids] } } }
        })
      } catch (err) {
        setState(prev => ({ ...prev, uploading: false }))
        toast({ title: 'Upload failed', description: err instanceof Error ? err.message : String(err), status: 'error' })
      }
    },
    [speciesId, toast]
  )

  const canSave = useMemo(() => background.selection !== null || foreground.selection !== null, [background, foreground])

  // When editing the default offset, preview against the first class as a representative sample.
  const previewClass = useMemo(
    () => EDITOR_CLASSES.find(c => c.id === classId) ?? EDITOR_CLASSES[0],
    [classId]
  )

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const sides: Record<Side, (SourceSelection & { offset: Offset }) | null> = {
        background: background.selection ? { ...background.selection, offset: resolveOffset(background, classId) } : null,
        foreground: foreground.selection ? { ...foreground.selection, offset: resolveOffset(foreground, classId) } : null,
      }
      const res = await fetch('/__species-tool/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speciesId, sides, classId: classId || null }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error ?? 'Save failed')
      const target = classId ? EDITOR_CLASSES.find(c => c.id === classId)?.name ?? classId : 'default'
      toast({ title: `Saved ${speciesId} icons (${target})`, status: 'success', duration: 2500 })
    } catch (err) {
      toast({ title: 'Save failed', description: err instanceof Error ? err.message : String(err), status: 'error' })
    } finally {
      setSaving(false)
    }
  }, [background, foreground, speciesId, classId, toast])

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="sm" fontWeight="bold" color="gray.400">
        Species Icon Editor (dev-only)
      </Text>

      <HStack spacing={3}>
        <Select value={speciesId} onChange={e => handleSpeciesChange(e.target.value as HeroSpecies)} size="sm" maxW="220px">
          {ALL_SPECIES.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
        <Select value={classId} onChange={e => handleClassChange(e.target.value)} size="sm" maxW="220px">
          <option value={DEFAULT_CLASS_VALUE}>Default (all classes)</option>
          {EDITOR_CLASSES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </HStack>

      <HStack align="flex-start" spacing={6}>
        <VStack align="stretch" spacing={4} flex={1}>
          <SourcePicker
            speciesId={speciesId}
            manifest={manifest}
            side="background"
            state={background}
            onSelect={selection => setBackground(prev => ({ ...prev, selection }))}
            onUpload={file => handleUpload('background', file)}
          />
          <SourcePicker
            speciesId={speciesId}
            manifest={manifest}
            side="foreground"
            state={foreground}
            onSelect={selection => setForeground(prev => ({ ...prev, selection }))}
            onUpload={file => handleUpload('foreground', file)}
          />
        </VStack>

        <VStack spacing={3}>
          <HStack>
            <Button size="xs" colorScheme={activeSide === 'background' ? 'yellow' : 'gray'} onClick={() => setActiveSide('background')}>
              Adjust Background
            </Button>
            <Button size="xs" colorScheme={activeSide === 'foreground' ? 'yellow' : 'gray'} onClick={() => setActiveSide('foreground')}>
              Adjust Foreground
            </Button>
          </HStack>

          <Box
            ref={previewRef}
            position="relative"
            boxSize={`${PREVIEW_SIZE}px`}
            bg="repeating-conic-gradient(#444 0% 25%, #333 0% 50%) 0 0/20px 20px"
            borderRadius="md"
            overflow="hidden"
            cursor="grab"
            outline={isPreviewDragOver ? '2px dashed' : undefined}
            outlineColor="cyan.300"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onDragOver={e => {
              e.preventDefault()
              setIsPreviewDragOver(true)
            }}
            onDragLeave={() => setIsPreviewDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setIsPreviewDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleUpload(activeSide, file)
            }}
          >
            {isPreviewDragOver && (
              <Box position="absolute" inset={0} zIndex={4} bg="blackAlpha.700" display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="sm" color="cyan.300" textAlign="center" px={2}>
                  Drop to set {activeSide}
                </Text>
              </Box>
            )}
            {background.selection && (
              <Image
                src={background.localPreviewUrl ?? previewUrl(background.selection, speciesId, 'background')}
                position="absolute"
                inset={0}
                boxSize="100%"
                objectFit="contain"
                zIndex={0}
                style={{ transform: offsetTransform(resolveOffset(background, classId)) }}
                pointerEvents="none"
              />
            )}
            <Box position="absolute" boxSize="80%" top="10%" left="10%" zIndex={1} pointerEvents="none">
              <HeroIcon classIcon={previewClass.icon} boxSize="100%" color="orange.400" />
            </Box>
            {foreground.selection && (
              <Image
                src={foreground.localPreviewUrl ?? previewUrl(foreground.selection, speciesId, 'foreground')}
                position="absolute"
                inset={0}
                boxSize="100%"
                objectFit="contain"
                zIndex={2}
                style={{ transform: offsetTransform(resolveOffset(foreground, classId)) }}
                pointerEvents="none"
              />
            )}

            {/* Guidelines */}
            <Box position="absolute" inset={0} zIndex={3} pointerEvents="none">
              <Box position="absolute" top="50%" left={0} right={0} h={snapAxis.y === 0 ? '2px' : '1px'} bg={snapAxis.y === 0 ? 'pink.300' : 'whiteAlpha.500'} />
              <Box position="absolute" left="50%" top={0} bottom={0} w={snapAxis.x === 0 ? '2px' : '1px'} bg={snapAxis.x === 0 ? 'pink.300' : 'whiteAlpha.500'} />
              <Box position="absolute" top="33.3%" left={0} right={0} h={snapAxis.y === -33.3 ? '2px' : '1px'} bg={snapAxis.y === -33.3 ? 'pink.300' : 'whiteAlpha.200'} />
              <Box position="absolute" top="66.6%" left={0} right={0} h={snapAxis.y === 33.3 ? '2px' : '1px'} bg={snapAxis.y === 33.3 ? 'pink.300' : 'whiteAlpha.200'} />
              <Box position="absolute" left="33.3%" top={0} bottom={0} w={snapAxis.x === -33.3 ? '2px' : '1px'} bg={snapAxis.x === -33.3 ? 'pink.300' : 'whiteAlpha.200'} />
              <Box position="absolute" left="66.6%" top={0} bottom={0} w={snapAxis.x === 33.3 ? '2px' : '1px'} bg={snapAxis.x === 33.3 ? 'pink.300' : 'whiteAlpha.200'} />
              <Box
                position="absolute"
                inset="10%"
                borderRadius="full"
                border="1px dashed"
                borderColor="cyan.300"
              />
            </Box>
          </Box>

          <HStack w="100%" spacing={2}>
            <Text fontSize="xs" color="gray.400" w="40px">Zoom</Text>
            <Slider
              min={0.5}
              max={2}
              step={0.01}
              value={activeOffset.scale}
              onChange={v => updateActiveOffset({ scale: snapScaleValue(v) })}
            >
              <SliderTrack><SliderFilledTrack /></SliderTrack>
              <SliderThumb />
            </Slider>
          </HStack>
          <HStack w="100%" spacing={2} fontSize="xs" color="gray.400">
            <Text w="14px">X</Text>
            <NumberInput
              size="xs"
              w="80px"
              value={Number(activeOffset.x.toFixed(1))}
              min={-50}
              max={50}
              step={0.5}
              onChange={(_, v) => !Number.isNaN(v) && updateActiveOffset({ x: clamp(v, -50, 50) })}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text w="14px">Y</Text>
            <NumberInput
              size="xs"
              w="80px"
              value={Number(activeOffset.y.toFixed(1))}
              min={-50}
              max={50}
              step={0.5}
              onChange={(_, v) => !Number.isNaN(v) && updateActiveOffset({ y: clamp(v, -50, 50) })}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text w="36px">Scale</Text>
            <NumberInput
              size="xs"
              w="80px"
              value={Number(activeOffset.scale.toFixed(2))}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(_, v) => !Number.isNaN(v) && updateActiveOffset({ scale: clamp(v, 0.5, 2) })}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button size="xs" onClick={resetActive}>Reset</Button>
          </HStack>
        </VStack>
      </HStack>

      <Button
        colorScheme="yellow"
        isDisabled={!canSave}
        isLoading={saving}
        onClick={handleSave}
        alignSelf="flex-start"
      >
        Save {speciesId} icons ({classId ? previewClass.name : 'default'})
      </Button>
    </VStack>
  )
}
