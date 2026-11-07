// ===== IMPORTS =====
import { useState, useEffect } from 'react'
import parts from '../data/parts'
import API_URL from '../api'

// ===== SLOTS =====
const slots = ["cpu", "motherboard", "ram", "gpu", "psu"]

// ===== HELPER =====
// turns a part id (like "cpu3") back into the full part
function findPart(slotKey, id) {
  if (!id) return null
  return parts[slotKey].find((part) => part.id === id) || null
}

// ===== COMPONENT =====
function SavedBuilds({ onBack, onLoad }) {

  // ----- State -----
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ----- Load builds when the page opens -----
  useEffect(() => {
    async function getBuilds() {
      try {
        const res = await fetch(API_URL + "/api/builds")
        const data = await res.json()
        setBuilds(data)
      } catch (err) {
        setError("Can't reach the server right now")
      }
      setLoading(false)
    }

    getBuilds()
  }, [])

  // ----- Open a saved build in the builder -----
  function loadBuild(saved) {
    const fullBuild = {}
    for (const slot of slots) {
      fullBuild[slot] = findPart(slot, saved.parts[slot])
    }
    onLoad(fullBuild)
  }

  // ----- Delete a saved build -----
  async function deleteBuild(id) {
    try {
      const res = await fetch(API_URL + "/api/builds/" + id, { method: "DELETE" })
      if (res.ok) {
        setBuilds(builds.filter((b) => b._id !== id))
      }
    } catch (err) {
      setError("Could not delete build")
    }
  }

  // ----- Layout -----
  return (
    <section className="builder">

      {/* Top bar */}
      <nav className="builder-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <span className="logo">My Builds</span>
      </nav>

      {loading && <p className="saved-empty">Loading your builds...</p>}
      {error && <p className="saved-empty">{error}</p>}

      {!loading && !error && builds.length === 0 && (
        <p className="saved-empty">No saved builds yet. Make one and hit Save build.</p>
      )}

      {/* Saved build cards */}
      <div className="saved-grid">
        {builds.map((saved) => (
          <div className="saved-card" key={saved._id}>
            <div className="saved-top">
              <h3>{saved.name}</h3>
              <span className="saved-price">S${saved.totalPrice.toLocaleString()}</span>
            </div>

            <ul className="saved-parts">
              {slots.map((slot) => {
                const part = findPart(slot, saved.parts[slot])
                return part ? <li key={slot}>{part.name}</li> : null
              })}
            </ul>

            <span className="saved-date">
              Saved {new Date(saved.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>

            <div className="saved-actions">
              <button className="btn-choose" onClick={() => loadBuild(saved)}>Open</button>
              <button className="btn-remove" onClick={() => deleteBuild(saved._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default SavedBuilds