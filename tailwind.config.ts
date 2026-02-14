import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Reference Green Hero
        bg0: "#0C6B22", // canvas green
        bg1: "#0B5A1C", // deep surface green
        ink: "#F2F4E8", // light text
        mist: "rgba(242,244,232,0.82)",

        // Accents (keep legacy keys used across components)
        gold: "#C8B07C",  // sand-gold highlight
        gold2: "#D8C293", // lighter highlight
        rose: "#7F9B52"   // olive accent
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,176,124,0.2), 0 18px 44px rgba(5,32,12,0.4)"
      },
      backgroundImage: {
        luxe:
          "radial-gradient(1100px 760px at 18% 6%, rgba(200,176,124,0.14), rgba(0,0,0,0) 62%), radial-gradient(980px 720px at 84% 18%, rgba(127,155,82,0.20), rgba(0,0,0,0) 66%), radial-gradient(720px 520px at 50% 92%, rgba(14,84,30,0.38), rgba(0,0,0,0) 70%), linear-gradient(180deg, #1BAA38 0%, #0C6B22 45%, #0B5A1C 100%)"
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
