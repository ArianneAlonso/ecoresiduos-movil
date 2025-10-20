module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // AÑADE LA SECCIÓN 'plugins' AQUÍ
    plugins: [
      // Asegúrate de que este plugin sea el ÚLTIMO en el array
      'react-native-worklets/plugin', 
    ],
  };
};