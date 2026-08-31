/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#5B0018",
          50: "#FBE9ED",
          100: "#F0C4CE",
          400: "#8A0F32",
          500: "#5B0018",
          600: "#4A0014",
          700: "#39000F",
          900: "#2A000B",
        },
        teal: {
          DEFAULT: "#008C95",
          50: "#E6F6F7",
          100: "#B3E4E7",
          400: "#00A5AF",
          500: "#008C95",
          600: "#00747B",
          700: "#005C62",
        },
        purple: {
          DEFAULT: "#7C3AED",
          50: "#F3ECFE",
          100: "#E0CDFB",
          500: "#7C3AED",
          600: "#6425D6",
        },
        ink: "#111111",
        gray: {
          25: "#FAFAFB",
          50: "#F3F4F6",
          100: "#E7E9EC",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,17,17,0.04), 0 4px 16px rgba(17,17,17,0.06)",
        "card-hover": "0 4px 8px rgba(17,17,17,0.06), 0 12px 24px rgba(17,17,17,0.08)",
        drawer: "4px 0 24px rgba(17,17,17,0.12)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideInRight: { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
        scanLine: { "0%": { transform: "translateY(0%)" }, "50%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0%)" } },
        popIn: { "0%": { opacity: 0, transform: "scale(0.85)" }, "100%": { opacity: 1, transform: "scale(1)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
        slideUp: "slideUp 0.25s ease-out",
        slideInRight: "slideInRight 0.25s ease-out",
        scanLine: "scanLine 2.2s ease-in-out infinite",
        popIn: "popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
