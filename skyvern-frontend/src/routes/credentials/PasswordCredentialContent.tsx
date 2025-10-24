import { QRCodeIcon } from "@/components/icons/QRCodeIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/util/utils";
import {
  EnvelopeClosedIcon,
  EyeNoneIcon,
  EyeOpenIcon,
  MobileIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

type Props = {
  values: {
    name: string;
    username: string;
    password: string;
    totp: string;
    totp_type: "authenticator" | "email" | "text" | "none";
  };
  onChange: (values: {
    name: string;
    username: string;
    password: string;
    totp: string;
    totp_type: "authenticator" | "email" | "text" | "none";
  }) => void;
};

function PasswordCredentialContent({
  values: { name, username, password, totp, totp_type },
  onChange,
}: Props) {
  const { t } = useTranslation("credentials");
  const [totpMethod, setTotpMethod] = useState<
    "authenticator" | "email" | "text"
  >("authenticator");
  const [showPassword, setShowPassword] = useState(false);

  // Update totp_type when totpMethod changes
  const handleTotpMethodChange = (
    method: "authenticator" | "email" | "text",
  ) => {
    setTotpMethod(method);
    onChange({
      name,
      username,
      password,
      totp: method === "authenticator" ? totp : "",
      totp_type: method,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex">
        <div className="w-72 shrink-0 space-y-1">
          <Label>{t("password.name")}</Label>
          <div className="text-sm text-slate-400">
            {t("password.nameDescription")}
          </div>
        </div>
        <Input
          value={name}
          onChange={(e) =>
            onChange({
              name: e.target.value,
              username,
              password,
              totp,
              totp_type,
            })
          }
        />
      </div>
      <Separator />
      <div className="flex items-center gap-12">
        <div className="w-40 shrink-0">
          <Label>{t("password.usernameOrEmail")}</Label>
        </div>
        <Input
          value={username}
          onChange={(e) =>
            onChange({
              name,
              username: e.target.value,
              password,
              totp,
              totp_type,
            })
          }
        />
      </div>
      <div className="flex items-center gap-12">
        <div className="w-40 shrink-0">
          <Label>{t("password.password")}</Label>
        </div>
        <div className="relative w-full">
          <Input
            className="pr-9"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) =>
              onChange({
                name,
                username,
                totp,
                password: e.target.value,
                totp_type,
              })
            }
          />
          <div
            className="absolute right-0 top-0 flex size-9 cursor-pointer items-center justify-center"
            onClick={() => {
              setShowPassword((value) => !value);
            }}
            aria-label={t("password.togglePasswordVisibility")}
          >
            {showPassword ? (
              <EyeOpenIcon className="size-4" />
            ) : (
              <EyeNoneIcon className="size-4" />
            )}
          </div>
        </div>
      </div>
      <Separator />
      <Accordion type="single" collapsible>
        <AccordionItem value="two-factor-authentication" className="border-b-0">
          <AccordionTrigger className="py-2">
            {t("password.twoFactor.title")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                {t("password.twoFactor.description")}
              </p>
              <div className="grid h-36 grid-cols-3 gap-4">
                <div
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-elevation1 hover:bg-slate-elevation3",
                    {
                      "bg-slate-elevation3": totpMethod === "authenticator",
                    },
                  )}
                  onClick={() => handleTotpMethodChange("authenticator")}
                >
                  <QRCodeIcon className="h-6 w-6" />
                  <Label>{t("password.twoFactor.authenticatorApp")}</Label>
                </div>
                <div
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-elevation1 hover:bg-slate-elevation3",
                    {
                      "bg-slate-elevation3": totpMethod === "email",
                    },
                  )}
                  onClick={() => handleTotpMethodChange("email")}
                >
                  <EnvelopeClosedIcon className="h-6 w-6" />
                  <Label>{t("password.twoFactor.email")}</Label>
                </div>
                <div
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-elevation1 hover:bg-slate-elevation3",
                    {
                      "bg-slate-elevation3": totpMethod === "text",
                    },
                  )}
                  onClick={() => handleTotpMethodChange("text")}
                >
                  <MobileIcon className="h-6 w-6" />
                  <Label>{t("password.twoFactor.textMessage")}</Label>
                </div>
              </div>
              {(totpMethod === "text" || totpMethod === "email") && (
                <p className="text-sm text-slate-400">
                  <Link
                    to="https://meetings.hubspot.com/skyvern/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {t("password.twoFactor.contactUs")}
                  </Link>{" "}
                  {t("password.twoFactor.or")}{" "}
                  <Link
                    to="https://www.skyvern.com/docs/running-tasks/advanced-features#time-based-one-time-password-totp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {t("password.twoFactor.seeDocumentation")}
                  </Link>{" "}
                  {t("password.twoFactor.toGetStarted")}
                </p>
              )}
              {totpMethod === "authenticator" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-12">
                    <div className="w-40 shrink-0">
                      <Label className="whitespace-nowrap">
                        {t("password.twoFactor.authenticatorKey")}
                      </Label>
                    </div>
                    <Input
                      value={totp}
                      onChange={(e) =>
                        onChange({
                          name,
                          username,
                          password,
                          totp: e.target.value,
                          totp_type,
                        })
                      }
                    />
                  </div>
                  <p className="text-sm text-slate-400">
                    {t("password.twoFactor.authenticatorHelp")}{" "}
                    <Trans
                      i18nKey="password.twoFactor.authenticatorApps"
                      ns="credentials"
                      components={{
                        bitwarden: (
                          <Link
                            to="https://bitwarden.com/help/integrated-authenticator/#manually-enter-a-secret"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          />
                        ),
                        onepassword: (
                          <Link
                            to="https://support.1password.com/one-time-passwords#on-1passwordcom"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          />
                        ),
                        lastpass: (
                          <Link
                            to="https://support.lastpass.com/s/document-item?language=en_US&bundleId=lastpass&topicId=LastPass/create-totp-vault.html&_LANG=enus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          />
                        ),
                      }}
                    />
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export { PasswordCredentialContent };
