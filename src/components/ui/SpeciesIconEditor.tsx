import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
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
import { GiSwordman } from 'react-icons/gi'
import { ALL_SPECIES } from '@/data/heroes/species'
import type { HeroSpecies } from '@/types'

type Format = 'svg' | 'png'
type Variant = 'v1' | 'v2_frame' | 'v3_addon' | 'v4_badge'
type Side = 'background' | 'foreground'

interface Offset {
  x: number
  y: number
  scale: number
}

interface SourceSelection {
  format: Format
  variant: Variant
}

type SourceManifest = Record<Format, Record<Variant, string[]>>

const VARIANTS: Variant[] = ['v1', 'v2_frame', 'v3_addon', 'v4_badge']
const FORMATS: Format[] = ['svg', 'png']
const DEFAULT_OFFSET: Offset = { x: 0, y: 0, scale: 1 }
const PREVIEW_SIZE = 240

function previewUrl(format: Format, variant: Variant, id: string): string {
  return `/__species-tool/preview?format=${format}&variant=${variant}&id=${encodeURIComponent(id)}`
}

function offsetTransform(offset: Offset): string {
  return `translate(${offset.x}%, ${offset.y}%) scale(${offset.scale})`
}

interface SidePanelState {
  selection: SourceSelection | null
  offset: Offset
}

function SourcePicker({
  speciesId,
  manifest,
  side,
  state,
  onSelect,
}: {
  speciesId: string
  manifest: SourceManifest | null
  side: Side
  state: SidePanelState
  onSelect: (selection: SourceSelection | null) => void
}) {
  return (
    <VStack align="stretch" spacing={2}>
      <Text fontSize="sm" fontWeight="bold" color="gray.300" textTransform="capitalize">
        {side}
      </Text>
      <SimpleGrid columns={4} spacing={2}>
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
            const available = manifest?.[format]?.[variant]?.includes(speciesId) ?? false
            const isSelected = state.selection?.format === format && state.selection?.variant === variant
            return (
              <Box
                key={`${format}-${variant}`}
                borderWidth={2}
                borderColor={isSelected ? 'yellow.400' : 'gray.600'}
                borderRadius="md"
                p={1}
                opacity={available ? 1 : 0.3}
                cursor={available ? 'pointer' : 'not-allowed'}
                onClick={() => available && onSelect({ format, variant })}
                h="56px"
              >
                {available ? (
                  <Image
                    src={previewUrl(format, variant, speciesId)}
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
      </SimpleGrid>
    </VStack>
  )
}

export default function SpeciesIconEditor() {
  const toast = useToast()
  const [speciesId, setSpeciesId] = useState<HeroSpecies>(ALL_SPECIES[0].id)
  const [manifest, setManifest] = useState<SourceManifest | null>(null)
  const [activeSide, setActiveSide] = useState<Side>('background')
  const [background, setBackground] = useState<SidePanelState>({ selection: null, offset: DEFAULT_OFFSET })
  const [foreground, setForeground] = useState<SidePanelState>({ selection: null, offset: DEFAULT_OFFSET })
  const [saving, setSaving] = useState(false)

  const dragState = useRef<{ startX: number; startY: number; offset: Offset } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/__species-tool/sources')
      .then(r => r.json())
      .then(setManifest)
      .catch(() => toast({ title: 'Failed to load species art sources', status: 'error' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeState = activeSide === 'background' ? background : foreground
  const setActiveState = activeSide === 'background' ? setBackground : setForeground

  const updateActiveOffset = useCallback(
    (partial: Partial<Offset>) => {
      setActiveState(prev => ({ ...prev, offset: { ...prev.offset, ...partial } }))
    },
    [setActiveState]
  )

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      dragState.current = { startX: e.clientX, startY: e.clientY, offset: activeState.offset }
    },
    [activeState.offset]
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragState.current) return
      const dxPercent = ((e.clientX - dragState.current.startX) / PREVIEW_SIZE) * 100
      const dyPercent = ((e.clientY - dragState.current.startY) / PREVIEW_SIZE) * 100
      updateActiveOffset({
        x: Math.max(-50, Math.min(50, dragState.current.offset.x + dxPercent)),
        y: Math.max(-50, Math.min(50, dragState.current.offset.y + dyPercent)),
      })
    },
    [updateActiveOffset]
  )

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    dragState.current = null
  }, [])

  const resetActive = useCallback(() => {
    setActiveState(prev => ({ ...prev, offset: DEFAULT_OFFSET }))
  }, [setActiveState])

  const handleSpeciesChange = useCallback((id: HeroSpecies) => {
    setSpeciesId(id)
    setBackground({ selection: null, offset: DEFAULT_OFFSET })
    setForeground({ selection: null, offset: DEFAULT_OFFSET })
  }, [])

  const canSave = useMemo(() => background.selection !== null || foreground.selection !== null, [background, foreground])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const sides: Record<Side, { format: Format; variant: Variant; offset: Offset } | null> = {
        background: background.selection ? { ...background.selection, offset: background.offset } : null,
        foreground: foreground.selection ? { ...foreground.selection, offset: foreground.offset } : null,
      }
      const res = await fetch('/__species-tool/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speciesId, sides }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error ?? 'Save failed')
      toast({ title: `Saved icons for ${speciesId}`, status: 'success', duration: 2500 })
    } catch (err) {
      toast({ title: 'Save failed', description: err instanceof Error ? err.message : String(err), status: 'error' })
    } finally {
      setSaving(false)
    }
  }, [background, foreground, speciesId, toast])

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="sm" fontWeight="bold" color="gray.400">
        Species Icon Editor (dev-only)
      </Text>

      <Select value={speciesId} onChange={e => handleSpeciesChange(e.target.value as HeroSpecies)} size="sm" maxW="220px">
        {ALL_SPECIES.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </Select>

      <HStack align="flex-start" spacing={6}>
        <VStack align="stretch" spacing={4} flex={1}>
          <SourcePicker
            speciesId={speciesId}
            manifest={manifest}
            side="background"
            state={background}
            onSelect={selection => setBackground(prev => ({ ...prev, selection }))}
          />
          <SourcePicker
            speciesId={speciesId}
            manifest={manifest}
            side="foreground"
            state={foreground}
            onSelect={selection => setForeground(prev => ({ ...prev, selection }))}
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
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {background.selection && (
              <Image
                src={previewUrl(background.selection.format, background.selection.variant, speciesId)}
                position="absolute"
                inset={0}
                boxSize="100%"
                objectFit="contain"
                zIndex={0}
                style={{ transform: offsetTransform(background.offset) }}
                pointerEvents="none"
              />
            )}
            <Icon as={GiSwordman} position="absolute" boxSize="80%" top="10%" left="10%" color="orange.400" zIndex={1} pointerEvents="none" />
            {foreground.selection && (
              <Image
                src={previewUrl(foreground.selection.format, foreground.selection.variant, speciesId)}
                position="absolute"
                inset={0}
                boxSize="100%"
                objectFit="contain"
                zIndex={2}
                style={{ transform: offsetTransform(foreground.offset) }}
                pointerEvents="none"
              />
            )}

            {/* Guidelines */}
            <Box position="absolute" inset={0} zIndex={3} pointerEvents="none">
              <Box position="absolute" top="50%" left={0} right={0} h="1px" bg="whiteAlpha.500" />
              <Box position="absolute" left="50%" top={0} bottom={0} w="1px" bg="whiteAlpha.500" />
              <Box position="absolute" top="33.3%" left={0} right={0} h="1px" bg="whiteAlpha.200" />
              <Box position="absolute" top="66.6%" left={0} right={0} h="1px" bg="whiteAlpha.200" />
              <Box position="absolute" left="33.3%" top={0} bottom={0} w="1px" bg="whiteAlpha.200" />
              <Box position="absolute" left="66.6%" top={0} bottom={0} w="1px" bg="whiteAlpha.200" />
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
              value={activeState.offset.scale}
              onChange={v => updateActiveOffset({ scale: v })}
            >
              <SliderTrack><SliderFilledTrack /></SliderTrack>
              <SliderThumb />
            </Slider>
          </HStack>
          <HStack w="100%" spacing={3} fontSize="xs" color="gray.400">
            <Text>x: {activeState.offset.x.toFixed(1)}%</Text>
            <Text>y: {activeState.offset.y.toFixed(1)}%</Text>
            <Text>scale: {activeState.offset.scale.toFixed(2)}</Text>
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
        Save {speciesId} icons
      </Button>
    </VStack>
  )
}
