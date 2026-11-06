// ===== IMPORTS =====
import { checkPart } from '../utils/compatibility'

// ===== SPEC CHIPS =====
// Turns a part's specs into a list of small labels
function getSpecs(part) {
  const specs = []
  if (part.socket) specs.push(part.socket)
  if (part.cores) specs.push(part.cores + " cores")
  if (part.ramType) specs.push(part.ramType)
  if (part.size) specs.push(part.size)
  if (part.speed) specs.push(part.speed)
  if (part.vram) specs.push(part.vram)
  if (part.watts) specs.push(part.watts + "W")
  if (part.wattage) specs.push(part.wattage + "W")
  if (part.rating) specs.push(part.rating)
  return specs
}

// ===== COMPONENT =====
function PartPicker({ title, slotKey, options, build, onPick, onClose }) {

  // ----- Layout -----
  return (
    <>
      {/* Dark background, click to close */}
      <div className="picker-overlay" onClick={onClose}></div>

      {/* Slide-in panel */}
      <div className="picker">
        <div className="picker-top">
          <h3>Choose {title}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {options.map((part) => {
          const reason = checkPart(slotKey, part, build)
          const isSelected = build[slotKey] && build[slotKey].id === part.id

          let className = "picker-item"
          if (reason) className += " disabled"
          if (isSelected) className += " selected"

          return (
            <button
              className={className}
              key={part.id}
              disabled={reason}
              onClick={() => onPick(part)}
            >
              <div className="picker-item-top">
                <span className="picker-name">{part.name}</span>
                <span className="picker-price">S${part.price.toLocaleString()}</span>
              </div>

              <div className="chips">
                {getSpecs(part).map((spec) => (
                  <span className="chip" key={spec}>{spec}</span>
                ))}
              </div>

              {reason && <p className="picker-reason">{reason}</p>}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default PartPicker