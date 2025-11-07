/** @type {import('tailwindcss').Config} */
export default {
  content: ["./docs/**/*.{md,vue}", "./docs/.vitepress/**/*.{js,ts,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
