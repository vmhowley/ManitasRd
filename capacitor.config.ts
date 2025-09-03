import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ManitasRd.app',
  appName: 'ManitasRd',
  webDir: 'dist'
,
    android: {
       buildOptions: {
          keystorePath: 'c:\Users\victormh\Desktop\key',
          keystoreAlias: 'key0',
       }
    }
  };

export default config;
