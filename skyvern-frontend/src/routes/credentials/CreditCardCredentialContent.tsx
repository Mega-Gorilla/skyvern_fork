import { DropdownWithOptions } from "@/components/DropdownWithOptions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

type Props = {
  values: {
    name: string;
    cardNumber: string;
    cardExpirationDate: string;
    cardCode: string;
    cardBrand: string;
    cardHolderName: string;
  };
  onChange: (values: {
    name: string;
    cardNumber: string;
    cardExpirationDate: string;
    cardCode: string;
    cardBrand: string;
    cardHolderName: string;
  }) => void;
};

function formatCardNumber(cardNumber: string) {
  // put spaces every 4 digits
  return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatCardExpirationDate(cardExpirationDate: string) {
  // put a slash between the month and year
  return cardExpirationDate.replace(/(\d{2})(?=\d)/g, "$1/");
}

function CreditCardCredentialContent({ values, onChange }: Props) {
  const { t } = useTranslation("credentials");

  const brandOptions = [
    { value: "Visa", label: t("creditCard.brands.visa") },
    { value: "Mastercard", label: t("creditCard.brands.mastercard") },
    { value: "American Express", label: t("creditCard.brands.amex") },
    { value: "Discover", label: t("creditCard.brands.discover") },
    { value: "JCB", label: t("creditCard.brands.jcb") },
    { value: "Diners Club", label: t("creditCard.brands.dinersClub") },
    { value: "Maestro", label: t("creditCard.brands.maestro") },
    { value: "UnionPay", label: t("creditCard.brands.unionPay") },
    { value: "RuPay", label: t("creditCard.brands.rupay") },
    { value: "Other", label: t("creditCard.brands.other") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex">
        <div className="w-72 shrink-0 space-y-1">
          <div>{t("creditCard.name")}</div>
          <div className="text-sm text-slate-400">
            {t("creditCard.nameDescription")}
          </div>
        </div>
        <Input
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
        />
      </div>
      <Separator />
      <div className="space-y-2">
        <Label>{t("creditCard.cardholderName")}</Label>
        <Input
          value={values.cardHolderName}
          onChange={(e) =>
            onChange({ ...values, cardHolderName: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>{t("creditCard.number")}</Label>
        <Input
          value={values.cardNumber}
          onChange={(event) => {
            onChange({
              ...values,
              cardNumber: formatCardNumber(event.target.value),
            });
          }}
          pattern="[0-9]{13,19}"
          placeholder="XXXX XXXX XXXX XXXX"
          maxLength={19}
          autoComplete="cc-number"
        />
      </div>
      <div className="space-y-2">
        <Label>{t("creditCard.brand")}</Label>
        <DropdownWithOptions
          options={brandOptions}
          value={values.cardBrand}
          onChange={(value) => onChange({ ...values, cardBrand: value })}
          placeholder={t("creditCard.selectBrand")}
        />
      </div>
      <div className="flex gap-2">
        <div className="space-y-2">
          <Label>{t("creditCard.expiration")}</Label>
          <Input
            value={values.cardExpirationDate}
            onChange={(event) => {
              onChange({
                ...values,
                cardExpirationDate: formatCardExpirationDate(
                  event.target.value,
                ),
              });
            }}
            placeholder="MM/YY"
            pattern="[0-9]{2}/[0-9]{2}"
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("creditCard.cvv")}</Label>
          <Input
            value={values.cardCode}
            onChange={(event) => {
              onChange({ ...values, cardCode: event.target.value });
            }}
            placeholder="XXX"
            pattern="[0-9]{3,4}"
            maxLength={4}
          />
        </div>
      </div>
    </div>
  );
}

export { CreditCardCredentialContent };
