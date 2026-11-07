// ===== IMPORTS =====
import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import BuilderScreen from './components/BuilderScreen'
import SavedBuilds from './components/SavedBuilds'
import './App.css'

// ===== COMPONENT =====
function App() {

  // ----- State -----
  const [screen, setScreen] = useState("welcome")

  // the build to open in the builder (null = start empty)
  const [startBuild, setStartBuild] = useState(null)

  // ----- Functions -----
  function startNewBuild() {
    setStartBuild(null)
    setScreen("builder")
  }

  function openSavedBuild(build) {
    setStartBuild(build)
    setScreen("builder")
  }

  // ----- Layout -----
  return (
    <div className="app">
      {screen === "welcome" && (
        <WelcomeScreen onStart={startNewBuild} />
      )}

      {screen === "builder" && (
        <BuilderScreen
          startBuild={startBuild}
          onBack={() => setScreen("welcome")}
          onOpenSaved={() => setScreen("saved")}
        />
      )}

      {screen === "saved" && (
        <SavedBuilds
          onBack={() => setScreen("builder")}
          onLoad={openSavedBuild}
        />
      )}
    </div>
  )
}

export default App