import { createContext, useContext, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";

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
   * 言語設定の優先順位
   *
   * 1. URLクエリパラメータ (?lng=ja) - 一時的な切り替え用
   * 2. Cookie (i18next=ja) - クロスタブ共有可能
   * 3. localStorage (i18nextLng=ja) - Cookieのバックアップ
   * 4. ブラウザ言語 (navigator.language) - 初回訪問時
   * 5. デフォルト (en)
   */
  useEffect(() => {
    const determineLanguage = (): string => {
      console.log("[LanguageContext] Determining language...");

      // 優先度1: URLクエリパラメータ
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lng");
      if (urlLang && ["en", "ja"].includes(urlLang)) {
        console.log("[LanguageContext] ✓ Using URL parameter:", urlLang);
        return urlLang;
      }

      // 優先度2: Cookie（i18next-browser-languagedetectorが自動設定）
      const cookieLang = document.cookie
        .split("; ")
        .find((row) => row.startsWith("i18next="))
        ?.split("=")[1];
      if (cookieLang && ["en", "ja"].includes(cookieLang)) {
        console.log("[LanguageContext] ✓ Using Cookie:", cookieLang);
        return cookieLang;
      }

      // 優先度3: localStorage
      const storedLang = localStorage.getItem("i18nextLng");
      if (storedLang && ["en", "ja"].includes(storedLang)) {
        console.log("[LanguageContext] ✓ Using localStorage:", storedLang);
        return storedLang;
      }

      // 優先度4: ブラウザ言語
      const browserLang = navigator.language.split("-")[0];
      if (browserLang && ["en", "ja"].includes(browserLang)) {
        console.log("[LanguageContext] ✓ Using browser language:", browserLang);
        return browserLang;
      }

      // 優先度5: デフォルト
      console.log("[LanguageContext] ✓ Using default: en");
      return "en";
    };

    const targetLang = determineLanguage();

    // i18nの言語が異なる場合のみ切り替え
    const currentLanguage = i18n.language || "en";
    if (currentLanguage !== targetLang) {
      console.log(
        `[LanguageContext] Switching from ${currentLanguage} to ${targetLang}`,
      );
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
    if (!["en", "ja"].includes(lang)) {
      console.error(`[LanguageContext] Invalid language: ${lang}`);
      return;
    }

    console.log(`[LanguageContext] User requested language change: ${lang}`);

    // 1. i18nextを即座に切り替え（UI即座反映）
    await i18n.changeLanguage(lang);

    // 2. Cookieに保存（クロスタブ共有、1年間有効）
    document.cookie = `i18next=${lang}; path=/; max-age=31536000; SameSite=Strict`;

    // 3. localStorageに保存（Cookieのバックアップ）
    localStorage.setItem("i18nextLng", lang);

    // 4. <html lang> 属性を更新（A11y + SEO）
    document.documentElement.lang = lang;

    console.log(`[LanguageContext] Language change complete: ${lang}`);
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
