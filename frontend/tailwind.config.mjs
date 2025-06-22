// tailwind.config.js
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  safelist: [
    "bg-blue-600",
    "hover:bg-blue-500",
    "text-white",
    "text-blue-400",
    "bg-gray-900",
    "bg-gray-700",
  ],
  plugins: [],
};
