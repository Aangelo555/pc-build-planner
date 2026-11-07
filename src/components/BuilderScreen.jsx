// ===== IMPORTS =====
import { useState } from 'react'
import parts from '../data/parts'
import PartPicker from './PartPicker'
import { getPowerNeeded, getIssues, getWarnings } from '../utils/compatibility'
import API_URL from '../api'

// ===== SLOTS =====
const slots = [
  { key: "cpu", label: "CPU" },
  { key: "motherboard", label: "Motherboard" },
  { key: "ram", label: "RAM" },
  { key: "gpu", label: "GPU" },
  { key: "psu", label: "Power Supply" },
]

// ===== EMPTY BUILD =====
const emptyBuild = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  psu: null,
}

// ===== COMPONENT =====
function BuilderScreen({ onBack }) {

  // ----- State -----
  const [build, setBuild] = useState(emptyBuild)

  const [picking, setPicking] = useState(null)

  const [buildName, setBuildName] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
  const [saving, setSaving] = useState(false)

  // ----- Functions -----
  function pickPart(part) {
    setBuild({ ...build, [picking.key]: part })
    setPicking(null)
  }

  function removePart(key) {
    setBuild({ ...build, [key]: null })
  }

  function resetBuild() {
    setBuild(emptyBuild)
    setSaveMessage("")
  }

  // ----- Save build to the database -----
  async function saveBuild() {
    if (buildName.trim() === "") {
      setSaveMessage("Give your build a name first")
      return
    }

    // only send each part's id, not the whole part
    const partIds = {}
    for (const slot of slots) {
      partIds[slot.key] = build[slot.key] ? build[slot.key].id : null
    }

    setSaving(true)
    setSaveMessage("")

    try {
      const res = await fetch(API_URL + "/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: buildName, parts: partIds, totalPrice: totalPrice }),
      })

      if (!res.ok) {
        const data = await res.json()
        setSaveMessage(data.message || "Could not save build")
      } else {
        setSaveMessage("Build saved!")
        setBuildName("")
      }
    } catch (err) {
      setSaveMessage("Can't reach the server right now")
    }

    setSaving(false)
  }

  // ----- Totals -----
  let totalPrice = 0
  let partsPicked = 0
  for (const slot of slots) {
    if (build[slot.key]) {
      totalPrice += build[slot.key].price
      partsPicked++
    }
  }

  // ----- Power -----
  const powerNeeded = build.cpu || build.gpu ? getPowerNeeded(build) : 0
  const psuWatts = build.psu ? build.psu.wattage : 0

  let powerPercent = 0
  if (psuWatts > 0) {
    powerPercent = Math.min((powerNeeded / psuWatts) * 100, 100)
  }

  let powerColor = "green"
  if (powerPercent > 80) powerColor = "amber"
  if (powerNeeded > psuWatts && psuWatts > 0) powerColor = "red"

  // ----- Compatibility -----
  const issues = getIssues(build)
  const warnings = getWarnings(build)

  let status = "empty"
  if (partsPicked > 0) status = "good"
  if (warnings.length > 0) status = "warn"
  if (issues.length > 0) status = "bad"

  // ----- Layout -----
  return (
    <section className="builder">

      {/* Top bar */}
      <nav className="builder-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <span className="logo">PC Build Planner</span>
      </nav>

      <div className="builder-grid">

        {/* Left: part slots */}
        <div className="slots">
          <div className="slots-top">
            <h2>Your build</h2>
            {partsPicked > 0 && (
              <button className="btn-reset" onClick={resetBuild}>Reset build</button>
            )}
          </div>

          {slots.map((slot) => (
            <div className="slot" key={slot.key}>
              <div>
                <span className="slot-label">{slot.label}</span>
                {build[slot.key] ? (
                  <p className="slot-part">{build[slot.key].name}</p>
                ) : (
                  <p className="slot-empty">Nothing picked yet</p>
                )}
              </div>

              <div className="slot-right">
                {build[slot.key] && <span className="slot-price">S${build[slot.key].price.toLocaleString()}</span>}
                {build[slot.key] && (
                  <button className="btn-remove" onClick={() => removePart(slot.key)}>Remove</button>
                )}
                <button className="btn-choose" onClick={() => setPicking(slot)}>
                  {build[slot.key] ? "Change" : "Choose"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: summary */}
        <aside className="summary">

          {/* Status badge */}
          <span className={"status " + status}>
            {status === "empty" && "No parts yet"}
            {status === "good" && "All compatible"}
            {status === "warn" && "Works, but check below"}
            {status === "bad" && issues.length + " issue(s)"}
          </span>

          {/* Price */}
          <span className="summary-label">Total</span>
          <p className="summary-price">S${totalPrice.toLocaleString()}</p>

          {/* Power */}
          <span className="summary-label">Power</span>
          <p className="summary-power">
            {powerNeeded}W {psuWatts > 0 && <span>/ {psuWatts}W</span>}
          </p>
          <div className="power-bar">
            <div className={"power-fill " + powerColor} style={{ width: powerPercent + "%" }}></div>
          </div>
          {psuWatts === 0 && <p className="power-hint">Pick a PSU to see the load</p>}

          {/* Issues + warnings list */}
          {(issues.length > 0 || warnings.length > 0) && (
            <ul className="issues">
              {issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
              {warnings.map((warning) => (
                <li className="warning" key={warning}>{warning}</li>
              ))}
            </ul>
          )}

          {/* Save build */}
          {partsPicked > 0 && (
            <div className="save-box">
              <span className="summary-label">Save this build</span>
              <input
                className="save-input"
                type="text"
                placeholder="e.g. My gaming PC"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
              />
              <button className="btn-save" onClick={saveBuild} disabled={saving}>
                {saving ? "Saving..." : "Save build"}
              </button>
              {saveMessage && <p className="save-message">{saveMessage}</p>}
            </div>
          )}
        </aside>

      </div>

      {/* Part picker (only shows when picking) */}
      {picking && (
        <PartPicker
          title={picking.label}
          slotKey={picking.key}
          options={parts[picking.key]}
          build={build}
          onPick={pickPart}
          onClose={() => setPicking(null)}
        />
      )}

    </section>
  )
}

export default BuilderScreen