import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 初回描画に必須の common (英語) のみ静的バンドル
import enCommon from "../locales/en/common.json";

// 共通定数をインポート
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_NAMESPACES,
  type SupportedLanguage,
  type SupportedNamespace,
} from "./constants";

/**
 * Vite の import.meta.glob で翻訳ファイルをすべて列挙
 *
 * - eager: false = 遅延ロード（デフォルト）
 * - import: 'default' = JSONファイルのデフォルトエクスポート
 *
 * ビルド時に以下のようなコードに変換される:
 * {
 *   '../locales/en/common.json': () => import('../locales/en/common.json'),
 *   '../locales/ja/common.json': () => import('../locales/ja/common.json'),
 * }
 */
const translationModules = import.meta.glob<{
  default: Record<string, unknown>;
}>("../locales/*/*.json", { eager: false, import: "default" });

/**
 * 翻訳リソースの動的ロード関数
 */
async function loadTranslation(
  language: string,
  namespace: string,
): Promise<Record<string, unknown>> {
  // ホワイトリストチェック
  if (!SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
    if (import.meta.env.DEV) {
      console.warn(
        `[i18n] Unsupported language: ${language}, falling back to 'en'`,
      );
    }
    language = "en";
  }

  if (!SUPPORTED_NAMESPACES.includes(namespace as SupportedNamespace)) {
    if (import.meta.env.DEV) {
      console.error(`[i18n] Unknown namespace: ${namespace}`);
    }
    return {};
  }

  // common/en は既に静的バンドル済み
  if (language === "en" && namespace === "common") {
    return enCommon;
  }

  // パスを構築
  const modulePath = `../locales/${language}/${namespace}.json`;

  // import.meta.glob のマップから取得
  const moduleLoader = translationModules[modulePath];

  if (!moduleLoader) {
    if (import.meta.env.DEV) {
      console.error(`[i18n] Translation file not found: ${modulePath}`);
    }

    // フォールバック: 日本語失敗時は英語を試行
    if (language !== "en") {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Falling back to en/${namespace}`);
      }
      return loadTranslation("en", namespace);
    }

    // 英語も存在しない場合は空オブジェクト
    return {};
  }

  try {
    // 動的インポート実行（Viteが自動的にチャンク分割）
    const module = await moduleLoader();
    if (import.meta.env.DEV) {
      console.log(`[i18n] Loaded ${modulePath} successfully`);
    }
    return module;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[i18n] Failed to load ${modulePath}:`, error);
    }

    // フォールバック
    if (language !== "en") {
      return loadTranslation("en", namespace);
    }

    return {};
  }
}

// i18next初期化
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 静的バンドル分（必須: en/common のみ）
    resources: {
      en: {
        common: enCommon,
      },
    },

    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGUAGES],

    // すべての名前空間を宣言
    ns: [...SUPPORTED_NAMESPACES],
    defaultNS: "common",
    fallbackNS: "common",

    // 部分的な言語リソース許可
    partialBundledLanguages: true,

    // React最適化
    react: {
      useSuspense: true,
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added",
    },

    // セキュリティ
    interpolation: {
      escapeValue: false, // Reactが自動エスケープ
    },

    // 言語検出
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["localStorage", "cookie"],
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      cookieOptions: { path: "/", sameSite: "strict" },
    },

    // 開発環境のみデバッグ
    debug: import.meta.env.DEV,

    // 欠落キー検知
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key) => {
      const message = `Missing key: ${lngs[0]}/${ns}/${key}`;

      if (import.meta.env.DEV) {
        console.warn(`[i18n] ${message}`);
      }
    },
  });

// カスタムバックエンド: import.meta.glob を使用
i18n.services.backendConnector.backend = {
  type: "backend",
  init: () => {},
  read: (
    language: string,
    namespace: string,
    callback: (
      error: Error | null,
      data: Record<string, unknown> | null,
    ) => void,
  ) => {
    loadTranslation(language, namespace)
      .then((data) => callback(null, data))
      .catch((error) => callback(error as Error, null));
  },
};

// 言語変更時の処理
i18n.on("languageChanged", (lng) => {
  if (import.meta.env.DEV) {
    console.log(`[i18n] Language changed to: ${lng}`);
  }

  // <html lang> 属性を更新（A11y対応）
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;

    // 将来的にRTL言語を追加する場合
    const rtlLanguages = ["ar", "he"];
    document.documentElement.dir = rtlLanguages.includes(lng) ? "rtl" : "ltr";
  }
});

// 初期化時にlang属性設定
if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language || "en";
}

// リソース読み込み失敗の監視
i18n.on("failedLoading", (lng, ns, msg) => {
  if (import.meta.env.DEV) {
    const error = `Failed to load ${lng}/${ns}: ${msg}`;
    console.error(`[i18n] ${error}`);
  }
});

export default i18n;
