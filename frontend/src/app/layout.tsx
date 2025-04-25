import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { MainLayout } from "@/components/layout/main-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ASECN - Autonomous Self-Evolving Cognitive Network",
  description: "A decentralized autonomous cognitive network",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout showDashboard={true}>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
