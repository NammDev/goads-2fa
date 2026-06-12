/**
 * TOTP generation — RFC 6238 / RFC 4226
 * Hand-rolled via Web Crypto (crypto.subtle HMAC-SHA1).
 * No external crypto deps — bundle-safe + auditably client-only.
 */

export type CodeEntry = { secret: string; code: string }

/**
 * Generate a TOTP code for a base32-encoded secret.
 * Counter = floor(epoch_seconds / 30) per RFC 6238.
 */
export async function generateTOTP(secret: string): Promise<string> {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const cleanSecret = secret.replace(/[\s=-]/g, "").toUpperCase()
  let bits = ""
  for (const c of cleanSecret) {
    const val = base32Chars.indexOf(c)
    if (val === -1) throw new Error("Invalid base32")
    bits += val.toString(2).padStart(5, "0")
  }
  const keyBytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < keyBytes.length; i++) {
    keyBytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2)
  }

  const epoch = Math.floor(Date.now() / 1000)
  const counter = Math.floor(epoch / 30)
  const counterBytes = new Uint8Array(8)
  let tmp = counter
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = tmp & 0xff
    tmp = Math.floor(tmp / 256)
  }

  const key = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"],
  )
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes))

  const offset = sig[sig.length - 1] & 0x0f
  const code =
    ((sig[offset] & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) << 8) |
    (sig[offset + 3] & 0xff)

  return (code % 1000000).toString().padStart(6, "0")
}

/**
 * Parse multi-line secret input.
 * Accepts one secret per line and pipe-separated rows (label|SECRET|...).
 * Strips whitespace/=/-, uppercases, validates ^[A-Z2-7]{16,}$, dedupes.
 */
export function parseSecrets(input: string): string[] {
  const lines = input.split("\n").filter((l) => l.trim())
  const secrets = new Set<string>()
  for (const line of lines) {
    const parts = line.split("|")
    for (const part of parts) {
      const clean = part.trim().replace(/[\s=-]/g, "").toUpperCase()
      if (/^[A-Z2-7]{16,}$/.test(clean)) { secrets.add(clean); break }
    }
  }
  return Array.from(secrets)
}

/** Format a 6-digit code as "XXX XXX" */
export const formatCode = (code: string) =>
  code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code
