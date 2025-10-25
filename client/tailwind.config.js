/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: le dice a NativeWind qué archivos escanear
  // en busca de clases de Tailwind.
  content: [
    "./App.tsx", // Escanea el archivo App.tsx en la raíz
    "./src/**/*.{js,jsx,ts,tsx}", // Escanea TODO dentro de la carpeta src
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};