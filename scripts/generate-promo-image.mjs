// Generator for GOADS promo/banner artwork via Gemini image API.
// Usage: GEMINI_API_KEY must be set.
//   node scripts/generate-promo-image.mjs [count] [aspect] [outBase]
//   e.g.  node scripts/generate-promo-image.mjs 2 9:16 goads-banner
// Writes public/images/{outBase}-{n}.png

import { writeFile, mkdir } from "node:fs/promises"

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) { console.error("GEMINI_API_KEY not set"); process.exit(1) }

const MODELS = ["gemini-3.1-flash-image-preview", "gemini-2.5-flash-image"]
const COUNT = Number(process.argv[2] ?? 2)
const ASPECT = process.argv[3] ?? "4:5"
const OUT_BASE = process.argv[4] ?? "goads-promo"

const PROMPT = [
  "Premium dark abstract 3D illustration for a high-end ad-tech agency promo panel.",
  "Deep dark slate-navy background, hex #101522.",
  "Floating translucent frosted-glass dashboard cards with rising line graphs and bar charts,",
  "soft glowing blue-to-cyan gradient light trails sweeping diagonally upward suggesting scaling ad performance,",
  "subtle bokeh depth of field, elegant minimal composition, generous negative space,",
  "cinematic studio lighting, premium fintech aesthetic.",
  ASPECT === "9:16" ? "Tall vertical composition with the visual flow running bottom to top." : "",
  "Strictly no text, no letters, no numbers, no logos, no watermarks.",
].filter(Boolean).join(" ")

async function generate(model) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: ASPECT } },
      }),
    },
  )
  if (!res.ok) throw new Error(`${model}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`)
  const json = await res.json()
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)
  if (!part) throw new Error(`${model}: no image in response`)
  return Buffer.from(part.inlineData.data, "base64")
}

await mkdir("public/images", { recursive: true })
let model = MODELS[0]
for (let i = 1; i <= COUNT; i++) {
  let buf
  try { buf = await generate(model) }
  catch (e) {
    console.warn(String(e.message).slice(0, 200))
    model = MODELS[1] // fall back to stable model for remaining attempts
    buf = await generate(model)
  }
  const file = `public/images/${OUT_BASE}-${i}.png`
  await writeFile(file, buf)
  console.log(`${file} <- ${model} (${(buf.length / 1024).toFixed(0)} KB)`)
}
