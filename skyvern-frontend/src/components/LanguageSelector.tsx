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

/**
 * LanguageSelector
 *
 * 言語切り替えUIコンポーネント
 *
 * 配置場所: ヘッダー右上（ユーザーアバターの横）
 *
 * 対応言語:
 * - English (en)
 * - 日本語 (ja)
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
        <SelectItem value="en">
          <span role="img" aria-label="English">
            🇺🇸
          </span>{" "}
          English
        </SelectItem>
        <SelectItem value="ja">
          <span role="img" aria-label="Japanese">
            🇯🇵
          </span>{" "}
          日本語
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
