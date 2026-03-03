/**
 * Combat Particles Component
 * 
 * Dynamic particle effects for combat events
 */

import { useCallback, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

export type ParticleEffect = 'damage' | 'victory' | 'heal' | 'phase' | 'critical' | 'dodge'

interface CombatParticlesProps {
    effect: ParticleEffect | null
    position?: { x: number; y: number }
    onComplete?: () => void
}

const getParticleConfig = (effect: ParticleEffect, position: { x: number; y: number } = { x: 50, y: 50 }): ISourceOptions => {
    const configs: Record<ParticleEffect, ISourceOptions> = {
        damage: {
            particles: {
                number: { value: 30, density: { enable: false } },
            color: { value: ['#ff4444', '#ff6666', '#ff8888'] },
            shape: { type: 'circle' },
            opacity: {
                value: { min: 0.3, max: 1 },
                animation: { enable: true, speed: 2, sync: false }
            },
            size: {
                value: { min: 2, max: 6 },
                animation: { enable: true, speed: 3, sync: false }
            },
            move: {
                enable: true,
                speed: { min: 2, max: 8 },
                direction: 'none',
                random: true,
                straight: false,
                outModes: { default: 'destroy' }
            }
        },
        emitters: {
            position: { x: position.x, y: position.y },
            rate: { delay: 0, quantity: 30 },
            life: { duration: 0.1, count: 1 },
            size: { width: 5, height: 5 }
        },
        background: { color: 'transparent' }
    },
    
    critical: {
        particles: {
            number: { value: 50, density: { enable: false } },
            color: { value: ['#ffaa00', '#ffcc00', '#ffee00', '#ffffff'] },
            shape: { type: ['circle', 'star'] },
            opacity: {
                value: { min: 0.5, max: 1 },
                animation: { enable: true, speed: 3, sync: false }
            },
            size: {
                value: { min: 3, max: 10 },
                animation: { enable: true, speed: 5, sync: false }
            },
            move: {
                enable: true,
                speed: { min: 5, max: 15 },
                direction: 'none',
                random: true,
                straight: false,
                outModes: { default: 'destroy' }
            }
        },
        emitters: {
            position: { x: position.x, y: position.y },
            rate: { delay: 0, quantity: 50 },
            life: { duration: 0.1, count: 1 },
            size: { width: 8, height: 8 }
        },
        background: { color: 'transparent' }
    },

    heal: {
        particles: {
            number: { value: 20, density: { enable: false } },
            color: { value: ['#44ff88', '#66ffaa', '#88ffcc'] },
            shape: { type: ['circle', 'star'] },
            opacity: {
                value: { min: 0.3, max: 0.8 },
                animation: { enable: true, speed: 1, sync: false }
            },
            size: {
                value: { min: 2, max: 5 },
                animation: { enable: true, speed: 2, sync: false }
            },
            move: {
                enable: true,
                speed: { min: 1, max: 3 },
                direction: 'top',
                random: false,
                straight: false,
                outModes: { default: 'destroy' }
            }
        },
        emitters: {
            position: { x: position.x, y: position.y },
            rate: { delay: 0.05, quantity: 5 },
            life: { duration: 0.5, count: 1 },
            size: { width: 10, height: 10 }
        },
        background: { color: 'transparent' }
    },

    dodge: {
        particles: {
            number: { value: 15, density: { enable: false } },
            color: { value: ['#88ccff', '#aaddff', '#cceeff'] },
            shape: { type: 'circle' },
            opacity: {
                value: { min: 0.5, max: 1 },
                animation: { enable: true, speed: 5, sync: false }
            },
            size: { value: { min: 1, max: 4 } },
            move: {
                enable: true,
                speed: { min: 3, max: 10 },
                direction: 'none',
                random: true,
                straight: false,
                outModes: { default: 'destroy' }
            }
        },
        emitters: {
            position: { x: position.x, y: position.y },
            rate: { delay: 0, quantity: 15 },
            life: { duration: 0.1, count: 1 },
            size: { width: 8, height: 8 }
        },
        background: { color: 'transparent' }
    },

    phase: {
        particles: {
            number: { value: 80, density: { enable: false } },
            color: { value: ['#aa44ff', '#cc66ff', '#ee88ff', '#8844ff'] },
            shape: { type: ['circle', 'triangle', 'square'] },
            opacity: {
                value: { min: 0.3, max: 1 },
                animation: { enable: true, speed: 2, sync: false }
            },
            size: {
                value: { min: 3, max: 8 },
                animation: { enable: true, speed: 4, sync: false }
            },
            move: {
                enable: true,
                speed: { min: 3, max: 12 },
                direction: 'outside',
                random: false,
                straight: false,
                outModes: { default: 'destroy' }
            }
        },
        emitters: {
            position: { x: position.x, y: position.y },
            rate: { delay: 0.01, quantity: 10 },
            life: { duration: 1, count: 1 },
            size: { width: 20, height: 20 }
        },
        background: { color: 'transparent' }
    },

    victory: {
        particles: {
            number: { value: 150, density: { enable: false } },
            color: { value: ['#ffaa00', '#ffcc00', '#ffdd00', '#ffee00', '#ffffff'] },
            shape: { type: ['circle', 'star'] },
            opacity: {
                value: { min: 0.6, max: 1 },
                animation: { enable: true, speed: 4, sync: false }
            },
            size: {
                value: { min: 2, max: 8 },
                animation: { enable: true, speed: 6, sync: false }
            },
            move: {
                enable: true,
                speed: { min: 3, max: 15 },
                direction: 'outside',
                random: true,
                straight: false,
                outModes: { default: 'destroy' },
                gravity: { enable: true, acceleration: 5 }
            },
            rotate: {
                value: { min: 0, max: 360 },
                direction: 'random',
                animation: { enable: true, speed: 20, sync: false }
            }
        },
        emitters: [
            {
                position: { x: position.x, y: position.y },
                rate: { delay: 0.02, quantity: 15 },
                life: { duration: 2, count: 1 },
                size: { width: 30, height: 30 }
            }
        ],
        background: { color: 'transparent' }
    }
}

    return configs[effect]
}

export default function CombatParticles({ effect, position, onComplete }: CombatParticlesProps) {
    const [init, setInit] = useState(false)

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })
    }, [])

    useEffect(() => {
        if (effect && onComplete) {
            // Auto-complete after animation
            const duration = effect === 'victory' ? 2500 : effect === 'phase' ? 1500 : 800
            const timer = setTimeout(onComplete, duration)
            return () => clearTimeout(timer)
        }
    }, [effect, onComplete])

    if (!init || !effect) {
        return null
    }

    const config = getParticleConfig(effect, position)

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            pointerEvents="none"
            zIndex={1000}
        >
            <Particles
                id={`combat-particles-${effect}`}
                options={config}
            />
        </Box>
    )
}
