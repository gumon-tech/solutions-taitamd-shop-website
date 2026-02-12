import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Forest Olive Cinematic (Dark)
        bg0: "#0B0F0B", // forest black
        bg1: "#111614", // deep olive shadow
        ink: "#E6EBDF", // off-white moss
        mist: "rgba(230,235,223,0.66)",

        // Accents (keep legacy keys used across components)
        gold: "#9FB36B",  // cinematic olive highlight
        gold2: "#C7D3A0", // pale highlight
        rose: "#3F5D3B"   // moss accent
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(159,179,107,0.14), 0 18px 55px rgba(0,0,0,0.55)"
      },
      backgroundImage: {
        luxe:
          "radial-gradient(1100px 760px at 18% 6%, rgba(107,127,90,0.22), rgba(0,0,0,0) 62%), radial-gradient(980px 720px at 84% 18%, rgba(63,93,59,0.18), rgba(0,0,0,0) 66%), radial-gradient(720px 520px at 50% 92%, rgba(159,179,107,0.10), rgba(0,0,0,0) 70%), linear-gradient(180deg, #0B0F0B 0%, #111614 55%, #0B0F0B 100%)"
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(140%)" }
        },
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        sweep: "sweep 22s linear infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
