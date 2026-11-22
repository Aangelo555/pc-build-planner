// ===== IMPORTS =====
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'

// ===== SETTINGS =====
const INTRO_TIME = 1.8          // how long the intro spin takes, in seconds
const START_TURN = -Math.PI     // starts half a turn away, then spins into place

// turn off the intro if the user has "reduce motion" on
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ===== COMPONENT =====
function GPUModel() {

  // ----- Load the model -----
  const { scene } = useGLTF('/models/gpu.glb')

  // ----- Intro spin -----
  const spinRef = useRef()
  const elapsed = useRef(0)

  useFrame((state, delta) => {
    if (reduceMotion || elapsed.current >= INTRO_TIME) return

    elapsed.current = Math.min(elapsed.current + delta, INTRO_TIME)
    const progress = elapsed.current / INTRO_TIME

    // ease out: starts fast, slows down as it settles
    const eased = 1 - Math.pow(1 - progress, 3)

    spinRef.current.rotation.y = START_TURN * (1 - eased)
  })

  // ----- Layout -----
  return (
    <Center>
      {/* Spins on the spot during the intro */}
      <group ref={spinRef} rotation={[0, reduceMotion ? 0 : START_TURN, 0]}>
        {/* Lays the GPU almost flat with a slight tilt, like a product photo */}
        <group rotation={[0.2, -0.3, 1.32]} scale={0.01}>
          {/* Turns the GPU so the fan faces us */}
          <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      </group>
    </Center>
  )
}

useGLTF.preload('/models/gpu.glb')

export default GPUModel