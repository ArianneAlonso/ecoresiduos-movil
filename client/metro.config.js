const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Obtiene la configuración por defecto de Expo
const config = getDefaultConfig(__dirname);

// Exporta la configuración envuelta con NativeWind
// La plantilla 'rn-new --nativewind' crea un archivo 'global.css' en la raíz.
// 'withNativeWind' necesita saber dónde está ese archivo.
module.exports = withNativeWind(config, { input: './global.css' });