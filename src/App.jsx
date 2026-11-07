// ===== IMPORTS =====
import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import BuilderScreen from './components/BuilderScreen'
import SavedBuilds from './components/SavedBuilds'
import AuthScreen from './components/AuthScreen'
import './App.css'

// ===== HELPER =====
// reads saved login info from the browser (if any)
function getSaved(key) {
  try {
    return localStorage.getItem(key)
  } catch (err) {
    return null
  }
}

// ===== COMPONENT =====
function App() {

  // ----- State -----
  const [screen, setScreen] = useState("welcome")

  // the build to open in the builder (null = start empty)
  const [startBuild, setStartBuild] = useState(null)

  // login info, kept after refresh
  const [token, setToken] = useState(getSaved("token"))
  const [username, setUsername] = useState(getSaved("username"))

  // where to go after logging in ("builder" or "saved")
  const [afterLogin, setAfterLogin] = useState("builder")

  // ----- Builder -----
  function startNewBuild() {
    setStartBuild(null)
    setScreen("builder")
  }

  function openSavedBuild(build) {
    setStartBuild(build)
    setScreen("builder")
  }

  // ----- My builds (needs login) -----
  function goToSaved() {
    if (token) {
      setScreen("saved")
    } else {
      setAfterLogin("saved")
      setScreen("auth")
    }
  }

  // ----- Save button pressed while logged out -----
  // keeps the current build so it's still there after logging in
  function needLogin(currentBuild) {
    setStartBuild(currentBuild)
    setAfterLogin("builder")
    setScreen("auth")
  }

  // ----- Login / logout -----
  function handleLoggedIn(newToken, newUsername) {
    try {
      localStorage.setItem("token", newToken)
      localStorage.setItem("username", newUsername)
    } catch (err) {
      // if the browser blocks storage, they just stay logged in until refresh
    }
    setToken(newToken)
    setUsername(newUsername)
    setScreen(afterLogin)
  }

  function handleLogout() {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
    } catch (err) {
      // nothing to clear
    }
    setToken(null)
    setUsername(null)
    if (screen === "saved") setScreen("builder")
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
          token={token}
          username={username}
          onBack={() => setScreen("welcome")}
          onOpenSaved={goToSaved}
          onNeedLogin={needLogin}
          onLogout={handleLogout}
        />
      )}

      {screen === "saved" && (
        <SavedBuilds
          token={token}
          onBack={() => setScreen("builder")}
          onLoad={openSavedBuild}
          onLogout={handleLogout}
        />
      )}

      {screen === "auth" && (
        <AuthScreen
          onBack={() => setScreen("builder")}
          onLoggedIn={handleLoggedIn}
        />
      )}
    </div>
  )
}

export default App