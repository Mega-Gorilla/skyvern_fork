/**
 * i18n共通定数
 *
 * サポート言語と名前空間の定義
 * - config.ts と LanguageContext.tsx で共有
 * - 言語追加時はここだけを更新すれば全体に反映
 */

export const SUPPORTED_LANGUAGES = ["en", "ja"] as const;
export const SUPPORTED_NAMESPACES = [
  "common",
  "errors",
  "workflows",
  "tasks",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type SupportedNamespace = (typeof SUPPORTED_NAMESPACES)[number];
