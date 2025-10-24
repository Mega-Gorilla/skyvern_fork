import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/SettingsStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRuntimeApiKey } from "@/util/env";
import { HiddenCopyableInput } from "@/components/ui/hidden-copyable-input";
import { OnePasswordTokenForm } from "@/components/OnePasswordTokenForm";
import { AzureClientSecretCredentialTokenForm } from "@/components/AzureClientSecretCredentialTokenForm";
import { useTranslation } from "react-i18next";

function Settings() {
  const { t } = useTranslation("settings");
  const { environment, organization, setEnvironment, setOrganization } =
    useSettingsStore();
  const apiKey = getRuntimeApiKey();

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle className="text-lg">{t("pageTitle")}</CardTitle>
          <CardDescription>{t("pageDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label className="w-36 whitespace-nowrap">
                {t("environment.label")}
              </Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger>
                  <SelectValue placeholder={t("environment.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-36 whitespace-nowrap">
                {t("organization.label")}
              </Label>
              <Select value={organization} onValueChange={setOrganization}>
                <SelectTrigger>
                  <SelectValue placeholder={t("organization.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skyvern">Skyvern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle className="text-lg">{t("apiKey.title")}</CardTitle>
          <CardDescription>{t("apiKey.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <HiddenCopyableInput value={apiKey ?? t("apiKey.notFound")} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle className="text-lg">
            {t("onePassword.cardTitle")}
          </CardTitle>
          <CardDescription>
            {t("onePassword.cardDescription")}{" "}
            <a
              href="https://developer.1password.com/docs/service-accounts/get-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {t("onePassword.learnMore")}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <OnePasswordTokenForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle className="text-lg">{t("azure.cardTitle")}</CardTitle>
          <CardDescription>{t("azure.cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <AzureClientSecretCredentialTokenForm />
        </CardContent>
      </Card>
    </div>
  );
}

export { Settings };
