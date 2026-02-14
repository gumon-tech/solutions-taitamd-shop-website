import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fresh Botanical Daylight (Light)
        bg0: "#FCF9F1", // warm cream canvas
        bg1: "#F3EEDF", // soft cream surface
        ink: "#15321B", // deep readable green
        mist: "rgba(21,50,27,0.9)",

        // Accents (keep legacy keys used across components)
        gold: "#114811",  // brand green
        gold2: "#2F7A35", // active green
        rose: "#5E8F5D"   // soft botanical accent
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(17,72,17,0.14), 0 14px 40px rgba(17,72,17,0.12)"
      },
      backgroundImage: {
        luxe:
          "radial-gradient(1100px 760px at 18% 6%, rgba(56,128,62,0.12), rgba(0,0,0,0) 62%), radial-gradient(980px 720px at 84% 18%, rgba(17,72,17,0.10), rgba(0,0,0,0) 66%), radial-gradient(720px 520px at 50% 92%, rgba(111,174,116,0.10), rgba(0,0,0,0) 70%), linear-gradient(180deg, #FCF9F1 0%, #F3EEDF 55%, #FCF9F1 100%)"
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
