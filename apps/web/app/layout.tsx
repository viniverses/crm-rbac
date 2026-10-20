import "@crm/ui/globals.css"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@crm/ui/components/sidebar"
import { TooltipProvider } from "@crm/ui/components/tooltip"
import { cn } from "@crm/ui/lib/utils"
import { Geist_Mono, Inter } from "next/font/google"
import * as React from "react"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "15rem",
                  "--sidebar-width-icon": "3rem",
                } as React.CSSProperties
              }
            >
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b px-6">
                  <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-2" />
                  <span className="text-foreground text-xs font-medium">
                    Deals Pipeline
                  </span>
                </header>
                <div className="flex flex-1 flex-col">{children}</div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
