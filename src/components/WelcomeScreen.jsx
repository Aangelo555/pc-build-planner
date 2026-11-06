// ===== IMPORTS =====
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Environment } from '@react-three/drei'
import GPUModel from './GPUModel'

// ===== COMPONENT =====
function WelcomeScreen({ onStart }) {

  // ----- Layout -----
  return (
    <section className="welcome">

      {/* Top bar */}
      <nav className="welcome-nav">
        <span className="logo">PC Build Planner</span>
        <a href="https://github.com/Aangelo555" target="_blank">GitHub</a>
      </nav>

      {/* Left: text */}
      <div className="welcome-text">
        <h1>Plan your build.<br /><span>Know it fits.</span></h1>
        <p>Pick your parts and see straight away if they work together, plus your total price and how much power it all needs.</p>
        <button className="btn-primary" onClick={onStart}>Start building</button>

        <ul className="welcome-checks">
          <li>CPU socket</li>
          <li>RAM type</li>
          <li>PSU wattage</li>
        </ul>
      </div>

      {/* Right: 3D GPU */}
      <div className="welcome-model">
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
              <GPUModel />
            </Float>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>

        {/* Spec readout */}
        <div className="gpu-specs">
          <span>RTX 4090 FE</span>
          <span>24GB GDDR6X</span>
          <span>450W</span>
        </div>
      </div>

    </section>
  )
}

export default WelcomeScreen