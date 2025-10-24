import { GlobeIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n/constants";

/**
 * 言語表示情報のマップ
 *
 * 新しい言語を追加する場合:
 * 1. i18n/constants.ts の SUPPORTED_LANGUAGES に追加
 * 2. このマップに表示情報を追加
 */
const LANGUAGE_DISPLAY_INFO: Record<
  SupportedLanguage,
  { flag: string; label: string; ariaLabel: string }
> = {
  en: { flag: "🇺🇸", label: "English", ariaLabel: "English" },
  ja: { flag: "🇯🇵", label: "日本語", ariaLabel: "Japanese" },
};

/**
 * LanguageSelector
 *
 * 言語切り替えUIコンポーネント
 *
 * 配置場所: ヘッダー右上（ユーザーアバターの横）
 *
 * 対応言語は SUPPORTED_LANGUAGES から動的に生成されます。
 */
export function LanguageSelector() {
  const { language, setLanguage, isLoading } = useLanguage();
  const { t } = useTranslation("common");

  return (
    <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
      <SelectTrigger className="w-36" aria-label={t("language.select")}>
        <GlobeIcon className="mr-2 h-4 w-4" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const info = LANGUAGE_DISPLAY_INFO[lang];
          return (
            <SelectItem key={lang} value={lang}>
              <span role="img" aria-label={info.ariaLabel}>
                {info.flag}
              </span>{" "}
              {info.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
