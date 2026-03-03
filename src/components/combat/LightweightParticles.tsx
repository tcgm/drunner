/**
 * Lightweight Particles Component
 * 
 * CSS-based particle effects optimized for low-end devices
 * Replaces the heavy @tsparticles library
 */

import { useEffect, useState, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import './LightweightParticles.css'

export type ParticleEffect = 'damage' | 'victory' | 'heal' | 'phase' | 'critical' | 'dodge'

interface LightweightParticlesProps {
    effect: ParticleEffect | null
    position?: { x: number; y: number }
    onComplete?: () => void
}

interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    color: string
    size: number
    life: number
    maxLife: number
    rotation?: number
    rotationSpeed?: number
}

const getParticleCount = (effect: ParticleEffect): number => {
    // Reduced counts for better performance
    switch (effect) {
        case 'victory': return 30  // Was 150
        case 'critical': return 15 // Was 50
        case 'phase': return 20    // Was 80
        case 'damage': return 10   // Was 30
        case 'heal': return 8      // Was 20
        case 'dodge': return 6     // Was 15
        default: return 10
    }
}

const getParticleColors = (effect: ParticleEffect): string[] => {
    switch (effect) {
        case 'damage': return ['#ff4444', '#ff6666']
        case 'critical': return ['#ffaa00', '#ffcc00', '#ffffff']
        case 'heal': return ['#44ff88', '#66ffaa']
        case 'dodge': return ['#88ccff', '#aaddff']
        case 'phase': return ['#aa44ff', '#cc66ff']
        case 'victory': return ['#ffaa00', '#ffcc00', '#ffee00', '#ffffff']
        default: return ['#ffffff']
    }
}

const createParticle = (id: number, effect: ParticleEffect, centerX: number, centerY: number): Particle => {
    const colors = getParticleColors(effect)
    const color = colors[Math.floor(Math.random() * colors.length)]

    // Randomize direction based on effect type
    let angle = Math.random() * Math.PI * 2
    let speed = 2 + Math.random() * 3

    if (effect === 'heal') {
        // Heal particles go up
        angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5
        speed = 1 + Math.random() * 2
    } else if (effect === 'victory') {
        // Victory particles explode outward
        speed = 3 + Math.random() * 5
    }

    return {
        id,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * (effect === 'victory' ? 6 : 4),
        life: 1,
        maxLife: effect === 'victory' ? 2000 : effect === 'phase' ? 1500 : 800,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
    }
}

export default function LightweightParticles({ effect, position, onComplete }: LightweightParticlesProps) {
    const [particles, setParticles] = useState<Particle[]>([])
    const animationFrameRef = useRef<number>(0)
    const startTimeRef = useRef<number>(0)

    useEffect(() => {
        if (!effect) {
            setParticles([])
            return
        }

        // Create initial particles
        const count = getParticleCount(effect)
        const centerX = position?.x ?? 50
        const centerY = position?.y ?? 50

        const newParticles = Array.from({ length: count }, (_, i) =>
            createParticle(i, effect, centerX, centerY)
        )

        setParticles(newParticles)
        startTimeRef.current = Date.now()

        // Animation loop using requestAnimationFrame
        const animate = () => {
            const elapsed = Date.now() - startTimeRef.current

            setParticles(prev => {
                const updated = prev.map(p => ({
                    ...p,
                    x: p.x + p.vx * 0.5,
                    y: p.y + p.vy * 0.5,
                    vy: p.vy + (effect === 'victory' ? 0.2 : 0.1), // Gravity
                    life: 1 - (elapsed / p.maxLife),
                    rotation: (p.rotation ?? 0) + (p.rotationSpeed ?? 0)
                })).filter(p => p.life > 0)

                if (updated.length === 0) {
                    onComplete?.()
                    return []
                }

                return updated
            })

            if (elapsed < (effect === 'victory' ? 2500 : effect === 'phase' ? 1500 : 800)) {
                animationFrameRef.current = requestAnimationFrame(animate)
            } else {
                onComplete?.()
            }
        }

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [effect, position, onComplete])

    if (!effect || particles.length === 0) {
        return null
    }

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            pointerEvents="none"
            zIndex={1000}
            overflow="hidden"
        >
            {particles.map(p => (
                <Box
                    key={p.id}
                    className="lightweight-particle"
                    position="absolute"
                    left={`${p.x}%`}
                    top={`${p.y}%`}
                    width={`${p.size}px`}
                    height={`${p.size}px`}
                    bg={p.color}
                    borderRadius="50%"
                    opacity={p.life}
                    transform={`translate(-50%, -50%) rotate(${p.rotation ?? 0}deg)`}
                    boxShadow={`0 0 ${p.size * 2}px ${p.color}`}
                />
            ))}
        </Box>
    )
}
