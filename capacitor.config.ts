
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zakatfitrah.app',
  appName: 'ZakatFitrahDigitalHub',
  webDir: 'dist',
  server: {
    url: "http://localhost:8080",
    cleartext: true
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
