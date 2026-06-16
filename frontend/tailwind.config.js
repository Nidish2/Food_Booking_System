/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0E4194",
          navy: "#092F6B",
          red: "#E31837",
          light: "#F4F7FC",
          border: "#D8E0EA",
          success: "#2E7D32",
          warning: "#F59E0B",
          danger: "#B00020"
        }
      }
    }
  },
  plugins: []
};
