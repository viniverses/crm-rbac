"use client"

import {
  Alert02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "cn"
import { useTheme } from "next-themes"
import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({
  className,
  toastOptions,
  icons,
  style,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group font-sans", className)}
      gap={10}
      icons={{
        success: (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={1.85}
            className="size-4 shrink-0"
          />
        ),
        info: (
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={1.85}
            className="size-4 shrink-0"
          />
        ),
        warning: (
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={1.85}
            className="size-4 shrink-0"
          />
        ),
        error: (
          <HugeiconsIcon
            icon={AlertCircleIcon}
            strokeWidth={1.85}
            className="size-4 shrink-0"
          />
        ),
        loading: (
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={1.85}
            className="size-4 shrink-0 motion-safe:animate-spin"
          />
        ),
        close: (
          <HugeiconsIcon
            icon={Cancel01Icon}
            strokeWidth={1.85}
            className="size-3.5 shrink-0"
          />
        ),
        ...icons,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: cn(
            "group/toast crm-toast font-sans",
            toastOptions?.classNames?.toast
          ),
          title: cn(
            "text-xs font-semibold tracking-tight text-popover-foreground leading-snug",
            toastOptions?.classNames?.title
          ),
          description: cn(
            "text-[11px] leading-relaxed text-muted-foreground",
            toastOptions?.classNames?.description
          ),
          content: cn(
            "flex min-w-0 flex-1 flex-col gap-0.5",
            toastOptions?.classNames?.content
          ),
          icon: cn("crm-toast-icon", toastOptions?.classNames?.icon),
          actionButton: cn(
            "crm-toast-action",
            toastOptions?.classNames?.actionButton
          ),
          cancelButton: cn(
            "crm-toast-cancel",
            toastOptions?.classNames?.cancelButton
          ),
          closeButton: cn(
            "crm-toast-close",
            toastOptions?.classNames?.closeButton
          ),
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "transparent",
          "--border-radius": "var(--radius-2xl)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

