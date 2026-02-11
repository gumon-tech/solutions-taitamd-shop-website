import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg0: "#F6F1E6",
        bg1: "#EFE7D6",
        ink: "#1A1A16",
        mist: "rgba(26,26,22,0.66)",
        gold: "#D7B56D",
        gold2: "#F1D594",
        rose: "#7B8B4C" // olive accent // sage accent
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(214,179,106,0.16), 0 18px 55px rgba(40,35,25,0.18)"
      },
      backgroundImage: {
        luxe:
          "radial-gradient(1000px 700px at 18% 10%, rgba(127,163,138,0.22), rgba(0,0,0,0)), radial-gradient(900px 650px at 82% 18%, rgba(214,179,106,0.18), rgba(0,0,0,0)), radial-gradient(700px 520px at 50% 92%, rgba(215,181,109,0.12), rgba(0,0,0,0)), linear-gradient(180deg, #F6F1E6 0%, #EFE7D6 55%, #F6F1E6 100%)"
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
