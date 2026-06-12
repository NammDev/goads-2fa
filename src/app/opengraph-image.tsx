import { ImageResponse } from "next/og";

export const alt = "2FA.media — Free 2FA Code Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG image: dark brand bg + wordmark + mock TOTP code card. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#101522",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            2FA
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "-2px",
            }}
          >
            .media
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "30px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.65)",
            marginBottom: "52px",
            letterSpacing: "-0.5px",
          }}
        >
          Free 2FA Code Generator
        </div>

        {/* Mock code card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "28px 56px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
              marginBottom: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Your TOTP Code
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "10px",
            }}
          >
            123 456
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.35)",
              marginTop: "10px",
            }}
          >
            Refreshes every 30 seconds
          </div>
        </div>

        {/* Footer badges */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "44px",
          }}
        >
          {["Browser-only", "No signup", "100% Free"].map((label) => (
            <div
              key={label}
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.45)",
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: "999px",
                padding: "8px 20px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
