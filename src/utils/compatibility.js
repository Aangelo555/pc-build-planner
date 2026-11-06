// ===== SETTINGS =====
// Extra watts on top of CPU + GPU for fans, drives, RAM etc.
const HEADROOM = 100

// ===== POWER =====
export function getPowerNeeded(build) {
  const cpuWatts = build.cpu ? build.cpu.watts : 0
  const gpuWatts = build.gpu ? build.gpu.watts : 0
  return cpuWatts + gpuWatts + HEADROOM
}

// ===== CHECK ONE PART =====
// Used in the picker. Returns a reason if the part doesn't fit, or null if it's fine
export function checkPart(slotKey, part, build) {
  const { cpu, motherboard, ram, gpu } = build

  // ----- CPU -----
  if (slotKey === "cpu") {
    if (motherboard && part.socket !== motherboard.socket) {
      return "Your board is " + motherboard.socket
    }
  }

  // ----- Motherboard -----
  if (slotKey === "motherboard") {
    if (cpu && part.socket !== cpu.socket) {
      return "Your CPU needs " + cpu.socket
    }
    if (ram && part.ramType !== ram.ramType) {
      return "Your RAM is " + ram.ramType
    }
  }

  // ----- RAM -----
  if (slotKey === "ram") {
    if (motherboard && part.ramType !== motherboard.ramType) {
      return "Your board needs " + motherboard.ramType
    }
  }

  // ----- GPU -----
  if (slotKey === "gpu") {
    const needed = getPowerNeeded({ ...build, gpu: part })
    if (build.psu && build.psu.wattage < needed) {
      return "Your PSU is too weak (needs " + needed + "W)"
    }
  }

  // ----- PSU -----
  if (slotKey === "psu") {
    const needed = getPowerNeeded(build)
    if ((cpu || gpu) && part.wattage < needed) {
      return "Too weak, needs " + needed + "W"
    }
  }

  return null
}

// ===== CHECK WHOLE BUILD =====
// Used in the summary. Returns a list of problems (empty list = all good)
export function getIssues(build) {
  const { cpu, motherboard, ram, psu } = build
  const issues = []

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    issues.push("CPU is " + cpu.socket + " but the board is " + motherboard.socket)
  }

  if (ram && motherboard && ram.ramType !== motherboard.ramType) {
    issues.push("RAM is " + ram.ramType + " but the board needs " + motherboard.ramType)
  }

  const needed = getPowerNeeded(build)
  if (psu && psu.wattage < needed) {
    issues.push("PSU is " + psu.wattage + "W but the build needs " + needed + "W")
  }

  return issues
}

// ===== WARNINGS =====
// Things that still work, but aren't ideal
export function getWarnings(build) {
  const { psu } = build
  const warnings = []

  const needed = getPowerNeeded(build)
  if (psu && needed <= psu.wattage) {
    const load = Math.round((needed / psu.wattage) * 100)
    if (load > 80) {
      warnings.push("PSU is running at " + load + "%, a bigger one is safer")
    }
  }

  return warnings
}