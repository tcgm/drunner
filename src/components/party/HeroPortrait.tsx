/**
 * HeroPortrait - renders a hero's custom uploaded portrait or their class icon.
 *
 * When isEditable=true:
 *  - A small camera button sits at the bottom-right corner of the portrait
 *  - Clicking it shows a file picker; the chosen image is passed to the global
 *    PortraitCropModal for pan/zoom/crop before being saved on the hero
 */
import { Icon, Image, Box, IconButton } from '@chakra-ui/react'
import { GiCctvCamera } from 'react-icons/gi'
import * as GameIcons from 'react-icons/gi'
import type { Hero } from '@/types'
import { useRef, useState } from 'react'
import { useGameStore } from '@/core/gameStore'
import { PortraitCropModal } from '@/components/ui/PortraitCropModal'
import { RiCameraFill } from 'react-icons/ri'

interface HeroPortraitProps {
  hero: Hero
  /** Chakra boxSize token or CSS value, e.g. 10, "min(30vh, 200px)" */
  boxSize?: string | number
  /** Icon color (used when no custom portrait) */
  color?: string
  /** CSS filter applied to both portrait and icon */
  filter?: string
  /** If true, show the camera edit button */
  isEditable?: boolean
  /** Border-radius for the image */
  borderRadius?: string
}

export function HeroPortrait({
  hero,
  boxSize = 10,
  color = 'orange.400',
  filter,
  isEditable = false,
  borderRadius = 'lg',
}: HeroPortraitProps) {
  const { updateHero } = useGameStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const [pendingOutputFormat, setPendingOutputFormat] = useState<'jpeg' | 'png'>('jpeg')
  const [cropOpen, setCropOpen] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const saveDirectly = (f: File) => {
      const r = new FileReader()
      r.onload = (ev) => { updateHero(hero.id, { customPortrait: ev.target?.result as string }) }
      r.readAsDataURL(f)
    }

    if (file.type === 'image/gif') {
      // GIFs: skip crop modal – canvas would flatten animation
      saveDirectly(file)
      return
    }

    if (file.type === 'image/webp') {
      // Detect animated WebP by looking for the 'ANIM' chunk in the RIFF container
      const slicer = new FileReader()
      slicer.onload = (ev) => {
        const buf = ev.target?.result as ArrayBuffer
        const bytes = new Uint8Array(buf)
        // Animated WebP has 'ANIM' (0x41 4E 49 4D) somewhere in the first 100 bytes
        let isAnimated = false
        for (let i = 0; i < bytes.length - 3; i++) {
          if (bytes[i] === 0x41 && bytes[i+1] === 0x4E && bytes[i+2] === 0x49 && bytes[i+3] === 0x4D) {
            isAnimated = true
            break
          }
        }
        if (isAnimated) {
          saveDirectly(file)
        } else {
          // Static WebP – open crop modal with PNG output to preserve transparency
          const reader = new FileReader()
          reader.onload = (ev2) => {
            setPendingImageSrc(ev2.target?.result as string)
            setPendingOutputFormat('png')
            setCropOpen(true)
          }
          reader.readAsDataURL(file)
        }
      }
      slicer.readAsArrayBuffer(file.slice(0, 100))
      return
    }

    // PNG: crop modal with PNG output to preserve transparency
    // everything else (JPEG, etc.): crop modal with JPEG output
    const format: 'jpeg' | 'png' = file.type === 'image/png' ? 'png' : 'jpeg'
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPendingImageSrc(ev.target?.result as string)
      setPendingOutputFormat(format)
      setCropOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropApply = (dataUrl: string) => {
    updateHero(hero.id, { customPortrait: dataUrl })
    setCropOpen(false)
    setPendingImageSrc(null)
  }

  const handleCropClose = () => {
    setCropOpen(false)
    setPendingImageSrc(null)
  }

  const portrait = hero.customPortrait ? (
    <Image
      src={hero.customPortrait}
      boxSize={boxSize}
      objectFit="cover"
      borderRadius={borderRadius}
      filter={filter}
      display="block"
      flexShrink={0}
    />
  ) : (
    <Icon
      as={IconComponent}
      boxSize={boxSize}
      color={color}
      filter={filter}
      display="block"
      flexShrink={0}
    />
  )

  if (!isEditable) return portrait

  return (
    <>
      <Box position="relative" display="inline-flex" flexShrink={0}>
        {portrait}

        {/* Camera button – bottom-right corner */}
        <IconButton
          aria-label="Edit portrait"
          icon={<Icon as={RiCameraFill} boxSize={3} />}
          size="xs"
          colorScheme="orange"
          variant="solid"
          position="absolute"
          bottom="-6px"
          right="-6px"
          minW="22px"
          h="22px"
          borderRadius="full"
          boxShadow="0 2px 6px rgba(0,0,0,0.6)"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
          zIndex={2}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>

      {pendingImageSrc && (
        <PortraitCropModal
          isOpen={cropOpen}
          onClose={handleCropClose}
          imageSrc={pendingImageSrc}
          onApply={handleCropApply}
          outputFormat={pendingOutputFormat}
        />
      )}
    </>
  )
}
