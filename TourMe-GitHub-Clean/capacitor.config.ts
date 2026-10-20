/**
 * Capacitor Mobile Configuration for Uzbekistan Travel Companion
 * Run `npx cap add android` or `npx cap add ios` after installing @capacitor/core & @capacitor/cli
 */
const config = {
  appId: 'uz.tourme.companion',
  appName: 'Uzbekistan Travel Companion',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Geolocation: {
      permissions: ['location', 'coarseLocation'],
    },
    Camera: {
      permissions: ['camera', 'photos'],
    },
  },
};

export default config;
