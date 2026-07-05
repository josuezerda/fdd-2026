/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f4f5", // Light gray background
        surface: "#ffffff", // Pure white for cards/sidebar
        primary: "#c41e3a", // Keep the red
        primaryNeon: "#ff1442",
        accent: "#0ea5e9", // Lighter blue
        success: "#10b981", // Lighter green
        border: "#e4e4e7", // Light border
        textMain: "#18181b", // Dark text for readability
        textMuted: "#71717a", // Gray text
        textHover: "#f1f5f9"
      }
    },
  },
  plugins: [],
}
