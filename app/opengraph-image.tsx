import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(900px 600px at 18% 12%, rgba(214,179,106,0.25), rgba(0,0,0,0)), radial-gradient(800px 550px at 82% 18%, rgba(255,77,141,0.18), rgba(0,0,0,0)), linear-gradient(180deg, #07060A, #0B0A12)",
          color: "#F5F3FF",
          padding: "70px",
          fontFamily: "Inter"
        }}
      >
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, letterSpacing: -1, fontWeight: 700 }}>{SITE.name}</div>
          <div style={{ fontSize: 28, opacity: 0.9 }}>{SITE.tagline}</div>
          <div style={{ marginTop: 14, fontSize: 22, opacity: 0.78, maxWidth: 900 }}>
            Luxury Thai‑inspired beauty & wellness in King’s Cross — book online.
          </div>

          <div style={{ marginTop: 26, display: "flex", gap: 10 }}>
            {["Massage", "Hair", "Nails", "Face", "Waxing"].map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 18,
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(245,243,255,0.18)",
                  background: "rgba(255,255,255,0.06)"
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
