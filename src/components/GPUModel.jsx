// ===== IMPORTS =====
import { useGLTF, Center } from '@react-three/drei'

// ===== COMPONENT =====
function GPUModel() {

  // ----- Load the model -----
  const { scene } = useGLTF('/models/gpu.glb')

  // ----- Layout -----
  return (
    <Center>
      {/* Outer group: tilts the GPU so it leans on its side */}
      <group rotation={[0, -0.35, 1.1]} scale={0.01}>
        {/* Inner: turns the GPU so the fan faces us */}
        <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} />
      </group>
    </Center>
  )
}

useGLTF.preload('/models/gpu.glb')

export default GPUModel