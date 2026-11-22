// ===== IMPORTS =====
import { useEffect, useRef } from 'react'

// ===== SHADERS =====
// vertex shader: just draws one rectangle over the whole screen
const vertexSrc = `
  attribute vec2 pos;
  void main() { gl_Position = vec4(pos, 0.0, 1.0); }
`

// fragment shader: works out the colour of every pixel, this is where the light is made
const fragmentSrc = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform vec2 uRes;
  uniform float uTime;
  uniform vec3 uBg;
  uniform vec3 uBeam;
  uniform vec3 uAccent;

  // random number for each grid point
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // smooth random noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  // layered noise, used for the smoke
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 p = uv;
    p.x *= uRes.x / uRes.y;
    float t = uTime * 0.04;

    // ----- slow drifting smoke -----
    float smoke = fbm(p * 2.2 + vec2(t * 1.5, t * 0.4));
    float smoke2 = fbm(p * 1.2 - vec2(t * 0.8, -t * 0.3) + smoke);

    // ----- spotlight cone from the top centre -----
    float d = abs(uv.x - 0.5);
    float width = 0.08 + (1.0 - uv.y) * 0.32;
    float cone = smoothstep(width, 0.0, d) * smoothstep(-0.1, 0.9, uv.y);

    // ----- glow lower down, where the GPU is -----
    float glow = exp(-pow((uv.x - 0.5) * 2.6, 2.0) - pow((uv.y - 0.32) * 3.2, 2.0));

    // ----- low fog along the bottom -----
    float fog = smoothstep(0.5, 0.0, uv.y) * smoke2;

    vec3 col = uBg;
    col += uBeam * cone * (0.08 + 0.3 * smoke);   // smoke you can see inside the light
    col += uBeam * glow * 0.18 * (0.6 + 0.4 * smoke2);
    col += uAccent * glow * pow(smoke, 3.0) * 0.18;
    col += uBeam * fog * 0.1;

    // darker around the edges so your eye goes to the middle
    float vignette = 1.0 - 0.7 * pow(length((uv - 0.5) * vec2(1.1, 1.3)), 1.6);
    col *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`

// ===== HELPERS =====
// turns "#3d5afe" into numbers the shader can use
function hexToRgb(hex) {
  const n = parseInt(hex.trim().replace('#', ''), 16)
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
}

function makeShader(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

// ===== COMPONENT =====
function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl')
    if (!gl) return // no WebGL, the plain background colour shows instead

    // ----- Set up the shader program -----
    const program = gl.createProgram()
    gl.attachShader(program, makeShader(gl, gl.VERTEX_SHADER, vertexSrc))
    gl.attachShader(program, makeShader(gl, gl.FRAGMENT_SHADER, fragmentSrc))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // one rectangle that covers the screen
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // ----- Colours from the CSS variables in index.css -----
    const styles = getComputedStyle(document.documentElement)
    gl.uniform3fv(gl.getUniformLocation(program, 'uBg'), hexToRgb(styles.getPropertyValue('--bg')))
    gl.uniform3fv(gl.getUniformLocation(program, 'uBeam'), hexToRgb(styles.getPropertyValue('--beam')))
    gl.uniform3fv(gl.getUniformLocation(program, 'uAccent'), hexToRgb(styles.getPropertyValue('--accent')))

    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')

    // ----- Size -----
    // drawn at normal screen size (not retina), sharp enough and light on laptops
    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // ----- Animation loop -----
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let frame

    function draw() {
      // time loops every few hours so the numbers never get too big
      const seconds = ((performance.now() - start) / 1000) % 10000
      gl.uniform1f(uTime, reduceMotion ? 0 : seconds)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }
    draw()

    // ----- Clean up when the component is removed -----
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="bg-canvas" />
}

export default Background