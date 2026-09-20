/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#101010",
        elevated: "#151515",
        brand: {
          orange: "#FF5A00",
          amber: "#FF9D1C",
          deepOrange: "#D93600",
          deepRed: "#650B05"
        },
        security: {
          safe: "#36C275",
          warning: "#F2B84B",
          highRisk: "#FF7A45",
          critical: "#E5484D"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        accent: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
