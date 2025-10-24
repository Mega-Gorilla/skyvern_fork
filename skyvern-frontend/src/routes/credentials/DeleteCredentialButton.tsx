import { DialogClose } from "@/components/ui/dialog";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getClient } from "@/api/AxiosClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { useCredentialGetter } from "@/hooks/useCredentialGetter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { CredentialApiResponse } from "@/api/types";
import { useTranslation } from "react-i18next";

type Props = {
  credential: CredentialApiResponse;
};

function DeleteCredentialButton({ credential }: Props) {
  const { t } = useTranslation("credentials");
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();

  const deleteCredentialMutation = useMutation({
    mutationFn: async (id: string) => {
      const client = await getClient(credentialGetter);
      return client.delete(`/credentials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["credentials"],
      });
      toast({
        title: t("delete.success.title"),
        variant: "success",
        description: t("delete.success.description"),
      });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: "destructive",
        title: t("delete.error.title"),
        description: error.message,
      });
    },
  });

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon" variant="tertiary" className="h-8 w-9">
                <TrashIcon className="size-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t("delete.tooltip")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("delete.title")}</DialogTitle>
        </DialogHeader>
        <div
          className="text-sm text-slate-400"
          dangerouslySetInnerHTML={{
            __html: t("delete.message", { name: credential.name }).replace(
              credential.name,
              `<span class="font-bold text-primary">${credential.name}</span>`,
            ),
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{t("delete.cancelButton")}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              deleteCredentialMutation.mutate(credential.credential_id);
            }}
            disabled={deleteCredentialMutation.isPending}
          >
            {deleteCredentialMutation.isPending && (
              <ReloadIcon className="mr-2 size-4 animate-spin" />
            )}
            {t("delete.deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteCredentialButton };
