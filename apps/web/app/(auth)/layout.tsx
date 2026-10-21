import { CommandIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import * as React from "react"

import { isAuthenticated } from "@/auth/auth"
import { AuthShowcase } from "@/components/auth/auth-showcase"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (await isAuthenticated()) {
    redirect("/")
  }

  return (
    <div className="bg-sidebar flex h-svh w-full overflow-hidden p-2">
      <div className="bg-background flex h-full w-full overflow-hidden rounded-xl shadow-sm">
        {/* Left column: Form container */}
        <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto overscroll-contain p-6 sm:p-10">
          <header className="flex items-center justify-between">
            <Link
              href="/"
              className="focus-visible:ring-ring/40 group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2"
            >
              <div className="text-white! shadow-xs **:text-white! flex size-8 items-center justify-center rounded-lg bg-indigo-600 outline-1 -outline-offset-1 outline-white/15 transition-colors duration-150 group-hover:bg-indigo-500">
                <HugeiconsIcon
                  icon={CommandIcon}
                  strokeWidth={2.25}
                  className="size-4"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-foreground text-[13px] font-semibold tracking-tight">
                  Synapse CRM
                </span>
                <span className="text-muted-foreground text-[11px]">
                  CRM Workspace
                </span>
              </div>
            </Link>

            <ThemeSwitcher />
          </header>

          <main className="my-auto py-8">{children}</main>

          <footer className="text-muted-foreground flex items-center justify-between text-[11px]">
            <span>&copy; {new Date().getFullYear()} Synapse CRM</span>
            <span>Secured with JWT &amp; RBAC</span>
          </footer>
        </div>

        {/* Right column: Inset CRM visual showcase */}
        <div className="hidden p-2 pl-0 lg:flex lg:w-[46%] xl:w-[50%]">
          <AuthShowcase />
        </div>
      </div>
    </div>
  )
}
