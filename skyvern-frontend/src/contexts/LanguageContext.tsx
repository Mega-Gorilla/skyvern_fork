import { createContext, useContext, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n/constants";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * LanguageProvider
 *
 * 言語設定の管理を行うContext Provider
 *
 * Phase 0 (PoC):
 * - localStorage + Cookie での永続化
 * - ブラウザ言語検出
 * - i18next との統合
 *
 * 将来のPhase (Phase 6):
 * - バックエンドAPI連携
 * - 複数端末での同期
 * - ユーザープロファイル統合
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  /**
   * BCP47言語タグを基本言語コードに正規化
   * 例: "ja-JP" -> "ja", "en-US" -> "en"
   *
   * @param langCode - 正規化する言語コード
   * @returns サポートされている基本言語コード、またはnull
   */
  const normalizeLanguageCode = (
    langCode: string | null,
  ): SupportedLanguage | null => {
    if (!langCode) return null;

    // 基本言語コードを取得（地域コードを除去）
    const baseLang = (langCode.split("-")[0] || "").toLowerCase();

    // サポートされている言語の中から最適なマッチを探す
    if (SUPPORTED_LANGUAGES.includes(baseLang as SupportedLanguage)) {
      return baseLang as SupportedLanguage;
    }

    return null;
  };

  /**
   * 言語設定の決定
   *
   * i18next-browser-languagedetector の標準機能を使用して言語を検出します。
   * 優先順位は i18n/config.ts の detection.order で設定されています:
   * 1. URLクエリパラメータ (?lng=ja または ?lng=ja-JP)
   * 2. Cookie (i18next=ja)
   * 3. localStorage (i18nextLng=ja)
   * 4. ブラウザ言語 (navigator.language)
   * 5. デフォルト (en)
   *
   * BCP47タグ（ja-JP, en-USなど）は自動的に正規化されます。
   */
  useEffect(() => {
    const determineLanguage = (): SupportedLanguage => {
      if (import.meta.env.DEV) {
        console.log("[LanguageContext] Determining language...");
      }

      // i18next-browser-languagedetector の検出機能を使用
      // これにより i18n/config.ts の設定と一致した言語検出が行われる
      const detectedLang = i18n.services.languageDetector?.detect();

      // 検出結果を正規化（BCP47タグ対応）
      let targetLang: SupportedLanguage | null = null;

      if (Array.isArray(detectedLang)) {
        // 複数の候補がある場合、最初のサポート言語を使用
        for (const lang of detectedLang) {
          const normalized = normalizeLanguageCode(lang);
          if (normalized) {
            targetLang = normalized;
            break;
          }
        }
      } else if (typeof detectedLang === "string") {
        targetLang = normalizeLanguageCode(detectedLang);
      }

      // フォールバック: デフォルト言語
      const finalLang = targetLang || "en";

      if (import.meta.env.DEV) {
        console.log(
          "[LanguageContext] Detected language:",
          detectedLang,
          "→ Using:",
          finalLang,
        );
      }

      return finalLang;
    };

    const targetLang = determineLanguage();

    // i18nの言語が異なる場合のみ切り替え
    const currentLanguage = i18n.language || "en";
    if (currentLanguage !== targetLang) {
      if (import.meta.env.DEV) {
        console.log(
          `[LanguageContext] Switching from ${currentLanguage} to ${targetLang}`,
        );
      }
      i18n.changeLanguage(targetLang);
    }
  }, [i18n]);

  /**
   * 言語変更関数（UIから呼び出される）
   *
   * i18next-browser-languagedetectorの機能を活用して永続化:
   * 1. i18next (UI即座反映)
   * 2. languageDetectorのcacheUserLanguage (Cookie + localStorage自動管理)
   * 3. HTML lang属性 (A11y/SEO)
   */
  const setLanguage = async (lang: SupportedLanguage) => {
    if (import.meta.env.DEV) {
      console.log(`[LanguageContext] User requested language change: ${lang}`);
    }

    // 1. i18nextを即座に切り替え（UI即座反映）
    await i18n.changeLanguage(lang);

    // 2. i18next-browser-languagedetectorのcacheUserLanguageを使用
    // これによりCookie/localStorage/その他の設定されたcachesに自動保存される
    if (i18n.services?.languageDetector) {
      i18n.services.languageDetector.cacheUserLanguage(lang);
    }

    // 3. <html lang> 属性を更新（A11y + SEO）
    document.documentElement.lang = lang;

    if (import.meta.env.DEV) {
      console.log(`[LanguageContext] Language change complete: ${lang}`);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language: (i18n.language as SupportedLanguage) || "en",
        setLanguage,
        isLoading: false, // Phase 0では常にfalse
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
