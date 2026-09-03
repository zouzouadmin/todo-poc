import type { ConfigContext, ExpoConfig } from "expo/config";

type AppVariant = "development" | "preview" | "production";

const APP_VARIANT = (process.env.APP_VARIANT ?? "development") as AppVariant;

const BASE_PACKAGE = 'com.zouzougo.todopoc';
const BASE_SLUG = "todo-poc";

type VariantConfig = {
  name: string;
  packageId: string;
  scheme: string;
  adaptiveIconBackground: string;
};

const VARIANTS: Record<AppVariant, VariantConfig> = {
  development: {
    name: "TODO (Dev)",
    packageId: `${BASE_PACKAGE}.dev`,
    scheme: "todopoc-dev",
    adaptiveIconBackground: "#7c3aed",
  },
  preview: {
    name: "TODO (Preview)",
    packageId: `${BASE_PACKAGE}.preview`,
    scheme: "todopoc-preview",
    adaptiveIconBackground: "#f59e0b",
  },
  production: {
    name: "TODO",
    packageId: BASE_PACKAGE,
    scheme: "todopoc",
    adaptiveIconBackground: "#0f1115",
  },
};

const variant = VARIANTS[APP_VARIANT];

if (!variant) {
  throw new Error(
    `Unknown APP_VARIANT: "${APP_VARIANT}". Expected development | preview | production.`,
  );
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: variant.name,
  slug: BASE_SLUG,
  owner: "zouzougo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: variant.scheme,
  userInterfaceStyle: "dark",
  backgroundColor: "#0f1115",
  // SDK 57 起只剩 New Architecture,不再有 newArchEnabled 這個欄位

  // Step 9 會用到:決定一包 OTA 更新能餵給哪些原生 binary
  runtimeVersion: {
    policy: "appVersion",
  },

  // eas init 之後填入,Step 3 會處理
  // extra: { eas: { projectId: 'xxxx-xxxx-xxxx' } },
  // updates: { url: 'https://u.expo.dev/xxxx-xxxx-xxxx' },

  // SDK 57 起原生 splash screen 改由 expo-splash-screen 這個 config plugin 負責,
  // 不再吃最上層的 splash 欄位
  plugins: [
    "expo-sqlite",
    "@react-native-community/datetimepicker",
    "expo-font",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#0f1115",
      },
    ],
  ],

  android: {
    package: variant.packageId,
    adaptiveIcon: {
      foregroundImage: "./assets/android-icon-foreground.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
      backgroundColor: variant.adaptiveIconBackground,
    },
    // SDK 57 起 edge-to-edge 為預設行為,不再有 edgeToEdgeEnabled 這個欄位
    // 不要寫 versionCode,Step 3 的 appVersionSource: remote 會接管
  },

  ios: {
    // 跟 Android package name 完全一致,之後開 iOS 不用再改
    bundleIdentifier: BASE_PACKAGE,
    supportsTablet: false,
    // 不要寫 buildNumber,同上
  },

  web: {
    favicon: "./assets/favicon.png",
  },

  extra: {
    ...config.extra,
    appVariant: APP_VARIANT,
    eas: {
      projectId: "b8f9849c-6fd0-48b8-981c-81f265d0201b",
    },
  },
});
