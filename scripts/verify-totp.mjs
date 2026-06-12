/**
 * TOTP RFC 6238 verification script.
 * Tests the same algorithm as src/lib/totp.ts against official RFC test vectors.
 * Run: node scripts/verify-totp.mjs
 */

// ── Core algorithm (mirrors totp.ts exactly) ─────────────────────────────────

function base32ToBytes(secret) {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanSecret = secret.replace(/[\s=-]/g, "").toUpperCase();
  let bits = "";
  for (const c of cleanSecret) {
    const val = base32Chars.indexOf(c);
    if (val === -1) throw new Error(`Invalid base32 char: ${c}`);
    bits += val.toString(2).padStart(5, "0");
  }
  const keyBytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < keyBytes.length; i++) {
    keyBytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return keyBytes;
}

async function totpForCounter(secretBytes, counter) {
  const counterBytes = new Uint8Array(8);
  let tmp = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = tmp & 0xff;
    tmp = Math.floor(tmp / 256);
  }
  const key = await crypto.subtle.importKey(
    "raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));
  const offset = sig[sig.length - 1] & 0x0f;
  const code =
    ((sig[offset] & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) << 8) |
    (sig[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, "0");
}

// ── Test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label, actual, expected) {
  if (actual === expected) {
    console.log(`  PASS  ${label}: ${actual}`);
    passed++;
  } else {
    console.error(`  FAIL  ${label}: expected=${expected} actual=${actual}`);
    failed++;
  }
}

// ── RFC 6238 Test Vectors ─────────────────────────────────────────────────────
// RFC 6238 Appendix B uses secret "12345678901234567890" (20 bytes) for SHA-1.
// Base32 of that exact byte string: GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ
// The RFC lists 8-digit TOTP values; we truncate to 6 by taking last 6 digits.
//   T=59          → 8-digit 94287082 → last 6: "287082"
//   T=1111111109  → 8-digit 07081804 → last 6: "081804"
//   T=1234567890  → 8-digit 89005924 → last 6: "005924"
//   T=2000000000  → 8-digit 69279037 → last 6: "279037"

const RFC_SECRET_B32 = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

const rfcVectors = [
  { T: 59,          counter: Math.floor(59 / 30),         expected: "287082" },
  { T: 1111111109,  counter: Math.floor(1111111109 / 30), expected: "081804" },
  { T: 1234567890,  counter: Math.floor(1234567890 / 30), expected: "005924" },
  { T: 2000000000,  counter: Math.floor(2000000000 / 30), expected: "279037" },
];

// ── Base32 edge-case tests ────────────────────────────────────────────────────

function testBase32Parsing() {
  console.log("\n[Base32 Parsing]");

  // Lowercase should work (toUpperCase normalization)
  try {
    const b = base32ToBytes("gezdgnbvgy3tqojq");
    assert("lowercase 16-char secret parses", b.length > 0 ? "ok" : "empty", "ok");
  } catch (e) {
    assert("lowercase 16-char secret parses", "throws:" + e.message, "ok");
  }

  // Spaces and = padding stripped
  try {
    const b = base32ToBytes("GESD GNBV GY3T QOJQ====");
    assert("spaces+padding stripped", b.length > 0 ? "ok" : "empty", "ok");
  } catch (e) {
    assert("spaces+padding stripped", "throws:" + e.message, "ok");
  }

  // Hyphens stripped (site-links style export format uses - in labels sometimes)
  try {
    const b = base32ToBytes("GEZDGNBV-GY3TQOJQ");
    assert("hyphens stripped", b.length > 0 ? "ok" : "empty", "ok");
  } catch (e) {
    assert("hyphens stripped", "throws:" + e.message, "ok");
  }

  // Invalid char '1' (not in base32 alphabet A-Z2-7) must throw
  let threw = false;
  try {
    base32ToBytes("1EZDGNBVGY3TQOJQ");
  } catch {
    threw = true;
  }
  assert("invalid char '1' rejected", threw ? "throws" : "no-throw", "throws");

  // Invalid char '@' must throw
  threw = false;
  try {
    base32ToBytes("@EZDGNBVGY3TQOJQ");
  } catch {
    threw = true;
  }
  assert("invalid char '@' rejected", threw ? "throws" : "no-throw", "throws");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== TOTP RFC 6238 Verification ===\n");
  console.log("[RFC Vectors — SHA-1, 6-digit truncation of 8-digit RFC values]");

  const secretBytes = base32ToBytes(RFC_SECRET_B32);

  for (const { T, counter, expected } of rfcVectors) {
    const code = await totpForCounter(secretBytes, counter);
    assert(`T=${T} (counter=${counter})`, code, expected);
  }

  testBase32Parsing();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
