import { createContext, useContext, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n/constants";

interface LanguageContextValue {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
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
  const normalizeLanguageCode = (langCode: string | null): string | null => {
    if (!langCode) return null;

    // 基本言語コードを取得（地域コードを除去）
    const baseLang = (langCode.split("-")[0] || "").toLowerCase();

    // サポートされている言語の中から最適なマッチを探す
    if (SUPPORTED_LANGUAGES.includes(baseLang as never)) {
      return baseLang;
    }

    return null;
  };

  /**
   * 言語設定の優先順位
   *
   * 1. URLクエリパラメータ (?lng=ja または ?lng=ja-JP) - 一時的な切り替え用
   * 2. Cookie (i18next=ja) - クロスタブ共有可能
   * 3. localStorage (i18nextLng=ja) - Cookieのバックアップ
   * 4. ブラウザ言語 (navigator.language) - 初回訪問時
   * 5. デフォルト (en)
   *
   * 各ソースから取得した言語コードは正規化され、BCP47タグ（ja-JP, en-USなど）も
   * 基本言語コード（ja, en）に変換されます。
   */
  useEffect(() => {
    const determineLanguage = (): string => {
      if (import.meta.env.DEV) {
        console.log("[LanguageContext] Determining language...");
      }

      // 優先度1: URLクエリパラメータ
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = normalizeLanguageCode(urlParams.get("lng"));
      if (urlLang) {
        if (import.meta.env.DEV) {
          console.log("[LanguageContext] ✓ Using URL parameter:", urlLang);
        }
        return urlLang;
      }

      // 優先度2: Cookie（i18next-browser-languagedetectorが自動設定）
      const cookieLang = normalizeLanguageCode(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("i18next="))
          ?.split("=")[1] || null,
      );
      if (cookieLang) {
        if (import.meta.env.DEV) {
          console.log("[LanguageContext] ✓ Using Cookie:", cookieLang);
        }
        return cookieLang;
      }

      // 優先度3: localStorage
      const storedLang = normalizeLanguageCode(
        localStorage.getItem("i18nextLng"),
      );
      if (storedLang) {
        if (import.meta.env.DEV) {
          console.log("[LanguageContext] ✓ Using localStorage:", storedLang);
        }
        return storedLang;
      }

      // 優先度4: ブラウザ言語
      const browserLang = normalizeLanguageCode(navigator.language);
      if (browserLang) {
        if (import.meta.env.DEV) {
          console.log(
            "[LanguageContext] ✓ Using browser language:",
            browserLang,
          );
        }
        return browserLang;
      }

      // 優先度5: デフォルト
      if (import.meta.env.DEV) {
        console.log("[LanguageContext] ✓ Using default: en");
      }
      return "en";
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
   * すべてのソースを同期的に更新:
   * 1. i18next (UI即座反映)
   * 2. Cookie (クロスタブ共有)
   * 3. localStorage (永続化)
   * 4. HTML lang属性 (A11y/SEO)
   */
  const setLanguage = async (lang: string) => {
    if (!SUPPORTED_LANGUAGES.includes(lang as never)) {
      if (import.meta.env.DEV) {
        console.error(`[LanguageContext] Invalid language: ${lang}`);
      }
      return;
    }

    if (import.meta.env.DEV) {
      console.log(`[LanguageContext] User requested language change: ${lang}`);
    }

    // 1. i18nextを即座に切り替え（UI即座反映）
    await i18n.changeLanguage(lang);

    // 2. Cookieに保存（クロスタブ共有、1年間有効）
    document.cookie = `i18next=${lang}; path=/; max-age=31536000; SameSite=Strict`;

    // 3. localStorageに保存（Cookieのバックアップ）
    localStorage.setItem("i18nextLng", lang);

    // 4. <html lang> 属性を更新（A11y + SEO）
    document.documentElement.lang = lang;

    if (import.meta.env.DEV) {
      console.log(`[LanguageContext] Language change complete: ${lang}`);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language: i18n.language || "en",
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
