// ===== IMPORTS =====
import { useState } from 'react'
import API_URL from '../api'

// ===== COMPONENT =====
function AuthScreen({ onBack, onLoggedIn }) {

  // ----- State -----
  const [mode, setMode] = useState("login") // "login" or "register"
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ----- Switch between login and register -----
  function switchMode() {
    setMode(mode === "login" ? "register" : "login")
    setError("")
  }

  // ----- Send the form to the backend -----
  async function handleSubmit(e) {
    e.preventDefault() // stops the page from refreshing
    setError("")
    setLoading(true)

    try {
      const res = await fetch(API_URL + "/api/auth/" + mode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Something went wrong")
      } else {
        onLoggedIn(data.token, data.username)
      }
    } catch (err) {
      setError("Can't reach the server right now")
    }

    setLoading(false)
  }

  // ----- Layout -----
  return (
    <section className="builder">

      {/* Top bar */}
      <nav className="builder-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <span className="logo">PC Build Planner</span>
      </nav>

      <div className="auth-box">
        <h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2>
        <p className="auth-sub">
          {mode === "login" ? "Log in to see your saved builds." : "Sign up to save your builds and come back to them anytime."}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="summary-label">Username</label>
          <input
            className="save-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="summary-label">Password</label>
          <input
            className="save-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-save" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button onClick={switchMode}>{mode === "login" ? "Create an account" : "Log in"}</button>
        </p>
      </div>

    </section>
  )
}

export default AuthScreen