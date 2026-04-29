import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef9f4",
          100: "#d6f1e3",
          200: "#aee2c9",
          300: "#7dcfa9",
          400: "#4eb88a",
          500: "#2fa172",
          600: "#1f815c",
          700: "#1a674b",
          800: "#17533d",
          900: "#134434",
          950: "#08261d"
        },
        gold: {
          50: "#fdf9ed",
          100: "#faf0cc",
          200: "#f5e295",
          300: "#efcd5e",
          400: "#e9b938",
          500: "#d99c20",
          600: "#bb781a",
          700: "#955718",
          800: "#7b441b",
          900: "#67381b",
          950: "#3b1d0b"
        }
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
      }
    }
  },
  plugins: []
};

export default config;
