import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useOnePasswordToken } from "@/hooks/useOnePasswordToken";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

function FormSchema(t: (key: string) => string) {
  return z.object({
    token: z.string().min(1, t("onePassword.required")),
  });
}

export function OnePasswordTokenForm() {
  const { t } = useTranslation("settings");
  const [showToken, setShowToken] = useState(false);
  const { onePasswordToken, isLoading, createOrUpdateToken, isUpdating } =
    useOnePasswordToken();

  const formSchema = FormSchema(t);
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: onePasswordToken?.token || "",
    },
  });

  const onSubmit = (data: FormData) => {
    createOrUpdateToken(data);
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  // Update form when token data loads
  if (
    onePasswordToken?.token &&
    form.getValues("token") !== onePasswordToken.token
  ) {
    form.setValue("token", onePasswordToken.token);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t("onePassword.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("onePassword.description")}
          </p>
        </div>
        {onePasswordToken && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("onePassword.status")}
            </span>
            <span
              className={`text-sm ${onePasswordToken.valid ? "text-green-600" : "text-red-600"}`}
            >
              {onePasswordToken.valid
                ? t("onePassword.active")
                : t("onePassword.inactive")}
            </span>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("onePassword.formLabel")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showToken ? "text" : "password"}
                      placeholder={t("onePassword.placeholder")}
                      disabled={isLoading || isUpdating}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleTokenVisibility}
                    disabled={isLoading || isUpdating}
                  >
                    {showToken ? (
                      <EyeClosedIcon className="h-4 w-4" />
                    ) : (
                      <EyeOpenIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading || isUpdating}>
              {isUpdating
                ? t("onePassword.updating")
                : t("onePassword.updateButton")}
            </Button>
            {onePasswordToken && (
              <div className="text-sm text-muted-foreground">
                {t("onePassword.lastUpdated")}{" "}
                {new Date(onePasswordToken.modified_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </form>
      </Form>

      {onePasswordToken && (
        <div className="rounded-md bg-muted p-4">
          <h4 className="mb-2 text-sm font-medium">
            {t("onePassword.tokenInfo.title")}
          </h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>
              {t("onePassword.tokenInfo.id")} {onePasswordToken.id}
            </div>
            <div>
              {t("onePassword.tokenInfo.type")} {onePasswordToken.token_type}
            </div>
            <div>
              {t("onePassword.tokenInfo.created")}{" "}
              {new Date(onePasswordToken.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
