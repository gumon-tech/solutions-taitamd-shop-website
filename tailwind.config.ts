import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg0: "#0B0E0A",
        bg1: "#10160F",
        ink: "#F5F3FF",
        mist: "rgba(245,243,255,0.75)",
        gold: "#D7B56D",
        gold2: "#F1D594",
        rose: "#7B8B4C" // olive accent // sage accent
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(214,179,106,0.18), 0 25px 70px rgba(0,0,0,0.45)"
      },
      backgroundImage: {
        luxe:
          "radial-gradient(900px 600px at 18% 12%, rgba(214,179,106,0.18), rgba(0,0,0,0)), radial-gradient(800px 550px at 82% 18%, rgba(127,163,138,0.14), rgba(0,0,0,0)), radial-gradient(700px 500px at 50% 90%, rgba(215,181,109,0.08), rgba(0,0,0,0)), linear-gradient(180deg, #0B0E0A 0%, #10160F 55%, #0B0E0A 100%)"
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
