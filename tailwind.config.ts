import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        myBlack: "#151515",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    keyframes: {
      "slide-in": {
        "0%": {
          "-webkit-transform": "translateX(-200px)",
          transform: "translateX(-200px)",
        },
        "100%": {
          "-webkit-transform": "translateX(0px)",
          transform: "translateX(0px)",
        },
      },

      "slide-fwd": {
        "0%": {
          "-webkit-transform": "translateZ(0px)",
          transform: "translateZ(0px)",
        },
        "100%": {
          "-webkit-transform": "translateZ(160px)",
          transform: "translateZ(160px)",
        },
      },
    },
    animation: {
      "slide-in": "slide-in 0.5s ease-out",
      "slide-fwd":
        " slide-fwd 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
    },
    transitionProperty: {
      height: "height",
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
