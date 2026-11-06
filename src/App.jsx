// ===== IMPORTS =====
import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import BuilderScreen from './components/BuilderScreen'
import './App.css'

// ===== COMPONENT =====
function App() {

  // ----- State -----
  const [screen, setScreen] = useState("welcome")

  // ----- Layout -----
  return (
    <div className="app">
      {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("builder")} />}
      {screen === "builder" && <BuilderScreen onBack={() => setScreen("welcome")} />}
    </div>
  )
}

export default App