import { isPasswordCredential } from "@/api/types";
import { DeleteCredentialButton } from "./DeleteCredentialButton";
import { CredentialApiResponse } from "@/api/types";
import { useTranslation } from "react-i18next";

type Props = {
  credential: CredentialApiResponse;
};

function CredentialItem({ credential }: Props) {
  const { t } = useTranslation("credentials");

  const getTotpTypeDisplay = (totpType: string) => {
    switch (totpType) {
      case "authenticator":
        return t("item.totpTypes.authenticator");
      case "email":
        return t("item.totpTypes.email");
      case "text":
        return t("item.totpTypes.text");
      case "none":
      default:
        return "";
    }
  };

  return (
    <div className="flex gap-5 rounded-lg bg-slate-elevation2 p-4">
      <div className="w-48 space-y-2">
        <p className="w-full truncate" title={credential.name}>
          {credential.name}
        </p>
        <p className="text-sm text-slate-400">{credential.credential_id}</p>
      </div>
      {isPasswordCredential(credential.credential) ? (
        <div className="border-l pl-5">
          <div className="flex gap-5">
            <div className="shrink-0 space-y-2">
              <p className="text-sm text-slate-400">
                {t("item.usernameEmail")}
              </p>
              <p className="text-sm text-slate-400">{t("item.password")}</p>
              {credential.credential.totp_type !== "none" && (
                <p className="text-sm text-slate-400">
                  {t("item.twoFactorType")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm">{credential.credential.username}</p>
              <p className="text-sm">{"********"}</p>
              {credential.credential.totp_type !== "none" && (
                <p className="text-sm text-blue-400">
                  {getTotpTypeDisplay(credential.credential.totp_type)}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-5 border-l pl-5">
          <div className="flex gap-5">
            <div className="shrink-0 space-y-2">
              <p className="text-sm text-slate-400">{t("item.cardNumber")}</p>
              <p className="text-sm text-slate-400">{t("item.brand")}</p>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="shrink-0 space-y-2">
              <p className="text-sm">
                {"************" + credential.credential.last_four}
              </p>
              <p className="text-sm">{credential.credential.brand}</p>
            </div>
          </div>
        </div>
      )}
      <div className="ml-auto">
        <DeleteCredentialButton credential={credential} />
      </div>
    </div>
  );
}

export { CredentialItem };
