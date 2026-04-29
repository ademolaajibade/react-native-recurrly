/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#fff9e3",
        foreground: "#081126",
        card: "#fff8e7",
        muted: {
          DEFAULT: "#f6eecf",
          foreground: "rgba(0,0,0,0.6)",
        },
        primary: "#081126",
        accent: "#ea7a53",
        border: "rgba(0,0,0,0.1)",
        success: "#16a34a",
        destructive: "#dc2626",
        subscription: "#8fd1bd",
      },
      fontFamily: {
        "sans-light": ["PlusJakartaSans-Light", "sans-serif"],
        sans: ["PlusJakartaSans-Regular", "sans-serif"],
        "sans-medium": ["PlusJakartaSans-Medium", "sans-serif"],
        "sans-semibold": ["PlusJakartaSans-SemiBold", "sans-serif"],
        "sans-bold": ["PlusJakartaSans-Bold", "sans-serif"],
        "sans-extrabold": ["PlusJakartaSans-ExtraBold", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      minHeight: {
        50: "200px",
      },
    },
  },
  plugins: [],
};
