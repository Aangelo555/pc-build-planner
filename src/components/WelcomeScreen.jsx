// ===== IMPORTS =====
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Environment, ContactShadows, useProgress } from '@react-three/drei'
import GPUModel from './GPUModel'

// ===== COMPONENT =====
function WelcomeScreen({ onStart }) {

  // ----- 3D loading progress -----
  // progress goes from 0 to 100 while the GPU model and lighting download
  const { progress } = useProgress()
  const loaded = progress === 100

  // ----- Layout -----
  return (
    <section className="welcome">

      {/* Top bar */}
      <nav className="welcome-nav">
        <span className="logo">PC Build Planner</span>

        <div className="nav-right">
          <a className="built-by" href="https://angelohowe.vercel.app" target="_blank">
            Built by <strong>Angelo</strong>
          </a>
          {/* GitHub logo */}
          <a className="github-btn" href="https://github.com/Aangelo555/pc-build-planner" target="_blank" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Text */}
      <div className="welcome-text">
        <h1>Every part fits.</h1>
        <p>Plan your PC build and see straight away if the parts work together.</p>
        <button className="btn-primary" onClick={onStart}>Start building</button>
      </div>

      {/* 3D GPU, lit like a product photo */}
      <div className="welcome-model">

        {/* shows until the 3D model has finished loading */}
        <p className={loaded ? "model-loading hidden" : "model-loading"}>
          Loading 3D model {Math.round(progress)}%
        </p>

        <Canvas camera={{ position: [0, 0.6, 5], fov: 38 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 5]} intensity={2} />
          <Suspense fallback={null}>
            {/* bobs up and down slowly so it looks like it's hovering */}
            <Float speed={2} rotationIntensity={0.25} floatIntensity={1} floatingRange={[-0.12, 0.12]}>
              <GPUModel />
            </Float>
            <Environment preset="studio" />
          </Suspense>
          {/* soft shadow on the "floor" under the GPU */}
          <ContactShadows position={[0, -1.25, 0]} opacity={0.35} scale={8} blur={2.8} far={4} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Quick facts along the bottom */}
      <ul className="welcome-facts">
        <li><strong>24 parts</strong>CPUs, GPUs, RAM and more</li>
        <li><strong>Live checks</strong>Socket, RAM type and power</li>
        <li><strong>Saved builds</strong>Keep them in your account</li>
      </ul>

    </section>
  )
}

export default WelcomeScreen