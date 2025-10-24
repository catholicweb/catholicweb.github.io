/** @type {import('tailwindcss').Config} */
export default {
  content: ["./docs/**/*.{md,vue}", "./docs/.vitepress/**/*.{js,ts,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: false, // We use custom themes
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};
