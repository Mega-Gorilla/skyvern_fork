import { CompassIcon } from "@/components/icons/CompassIcon";
import { NavLinkGroup } from "@/components/NavLinkGroup";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/util/utils";
import {
  CounterClockwiseClockIcon,
  GearIcon,
  GlobeIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { KeyIcon } from "@/components/icons/KeyIcon.tsx";
import { useTranslation } from "react-i18next";

function SideNav() {
  const { collapsed } = useSidebarStore();
  const { t } = useTranslation("common");

  return (
    <nav
      className={cn("space-y-5", {
        "items-center": collapsed,
      })}
    >
      <NavLinkGroup
        title={t("navigation.build")}
        links={[
          {
            label: t("navigation.discover"),
            to: "/discover",
            icon: <CompassIcon className="size-6" />,
          },
          {
            label: t("navigation.workflows"),
            to: "/workflows",
            icon: <LightningBoltIcon className="size-6" />,
          },
          {
            label: t("navigation.history"),
            to: "/history",
            icon: <CounterClockwiseClockIcon className="size-6" />,
          },
          {
            label: t("navigation.browsers"),
            to: "/browser-sessions",
            icon: <GlobeIcon className="size-6" />,
          },
        ]}
      />
      <NavLinkGroup
        title={t("navigation.general")}
        links={[
          {
            label: t("navigation.settings"),
            to: "/settings",
            icon: <GearIcon className="size-6" />,
          },
          {
            label: t("navigation.credentials"),
            to: "/credentials",
            icon: <KeyIcon className="size-6" />,
          },
        ]}
      />
    </nav>
  );
}

export { SideNav };
