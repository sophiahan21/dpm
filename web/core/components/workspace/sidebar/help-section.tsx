"use client";

import React, { useRef, useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import { FileText, HelpCircle, MessagesSquare, MoveLeft, Zap } from "lucide-react";
import { Transition } from "@headlessui/react";
// ui
import { DiscordIcon, GithubIcon, Tooltip } from "@plane/ui";
// helpers
import { cn } from "@/helpers/common.helper";
// hooks
import { useAppTheme, useCommandPalette, useInstance, useTransient } from "@/hooks/store";
import useOutsideClickDetector from "@/hooks/use-outside-click-detector";
import { usePlatformOS } from "@/hooks/use-platform-os";
// components
import { PlaneVersionNumber } from "@/plane-web/components/global";
import { WorkspaceEditionBadge } from "@/plane-web/components/workspace";

const HELP_OPTIONS = [
  {
    name: "Documentation",
    href: "https://docs.plane.so/",
    Icon: FileText,
  },
  {
    name: "Join our Discord",
    href: "https://discord.com/invite/A92xrEGCge",
    Icon: DiscordIcon,
  },
  {
    name: "Report a bug",
    href: "https://github.com/makeplane/plane/issues/new/choose",
    Icon: GithubIcon,
  },
];

export interface WorkspaceHelpSectionProps {
  setSidebarActive?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarHelpSection: React.FC<WorkspaceHelpSectionProps> = observer(() => {
  // store hooks
  const { sidebarCollapsed, toggleSidebar } = useAppTheme();
  const { toggleShortcutModal } = useCommandPalette();
  const { isMobile } = usePlatformOS();
  const { config } = useInstance();
  const { isIntercomToggle, toggleIntercom } = useTransient();
  // states
  const [isNeedHelpOpen, setIsNeedHelpOpen] = useState(false);
  // refs
  const helpOptionsRef = useRef<HTMLDivElement | null>(null);

  const handleCrispWindowShow = () => {
    toggleIntercom(!isIntercomToggle);
  };

  useOutsideClickDetector(helpOptionsRef, () => setIsNeedHelpOpen(false));

  const isCollapsed = sidebarCollapsed || false;

  return (
    <>
      <div
        className={cn(
          "flex w-full items-center justify-between px-4 gap-1 self-baseline border-t border-custom-border-200 bg-custom-sidebar-background-100 h-14 flex-shrink-0",
          {
            "flex-col h-auto py-1.5": isCollapsed,
          }
        )}
      >
        <div
          className={cn("w-3/5", {
            hidden: isCollapsed,
          })}
        >
          {/* <WorkspaceEditionBadge /> */}
        </div>
        <div className={`flex items-center gap-1 ${isCollapsed ? "flex-col justify-center" : "w-2/5 justify-evenly"}`}>
          <Tooltip tooltipContent="Shortcuts" isMobile={isMobile}>
            <button
              type="button"
              className={`grid place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 ${
                isCollapsed ? "w-full" : ""
              }`}
              onClick={() => toggleShortcutModal(true)}
            >
              <Zap className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip tooltipContent="Help" isMobile={isMobile}>
            <button
              type="button"
              className={`grid place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 ${
                isCollapsed ? "w-full" : ""
              }`}
              onClick={() => setIsNeedHelpOpen((prev) => !prev)}
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </Tooltip>

          <button
            type="button"
            className="grid place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 md:hidden"
            onClick={() => toggleSidebar()}
          >
            <MoveLeft className="h-3.5 w-3.5" />
          </button>

          <Tooltip tooltipContent={`${isCollapsed ? "Expand" : "Hide"}`} isMobile={isMobile}>
            <button
              type="button"
              className={`hidden place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 md:grid ${
                isCollapsed ? "w-full" : ""
              }`}
              onClick={() => toggleSidebar()}
            >
              <MoveLeft className={`h-3.5 w-3.5 duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
            </button>
          </Tooltip>
        </div>

        <div className="relative">
          <Transition
            show={isNeedHelpOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div
              className={`absolute bottom-2 min-w-[10rem] z-[15] ${
                isCollapsed ? "left-full" : "-left-[75px]"
              } divide-y divide-custom-border-200 whitespace-nowrap rounded bg-custom-background-100 p-1 shadow-custom-shadow-xs`}
              ref={helpOptionsRef}
            >
              <div className="space-y-1 pb-2">
                {HELP_OPTIONS.map(({ name, Icon, href }) => (
                  <Link href={href} key={name} target="_blank">
                    <span className="flex items-center gap-x-2 rounded px-2 py-1 text-xs hover:bg-custom-background-80">
                      <div className="grid flex-shrink-0 place-items-center">
                        <Icon className="h-3.5 w-3.5 text-custom-text-200" size={14} />
                      </div>
                      <span className="text-xs">{name}</span>
                    </span>
                  </Link>
                ))}
                {config?.intercom_app_id && config?.is_intercom_enabled && (
                  <button
                    type="button"
                    onClick={handleCrispWindowShow}
                    className="flex w-full items-center gap-x-2 rounded px-2 py-1 text-xs hover:bg-custom-background-80"
                  >
                    <div className="grid flex-shrink-0 place-items-center">
                      <MessagesSquare className="h-3.5 w-3.5 text-custom-text-200" />
                    </div>
                    <span className="text-xs">Chat with us</span>
                  </button>
                )}
              </div>
              <div className="px-2 pb-1 pt-2 text-[10px]">
                <PlaneVersionNumber />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
});
