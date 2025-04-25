"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import MemoryDashboard from "@/components/memory-core/memory-dashboard"
import PerceptionDashboard from "@/components/perception-layer/perception-dashboard"
import ActionDashboard from "@/components/action-layer/action-dashboard"
import EvolverDashboard from "@/components/evolver/evolver-dashboard"
import TreasuryDashboard from "@/components/treasury/treasury-dashboard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MainLayoutProps {
  children?: React.ReactNode
  showDashboard?: boolean
}

export const MainLayout = ({ children, showDashboard = false }: MainLayoutProps) => {
  const [activeTab, setActiveTab] = useState("memory")
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">ASECN</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground"
                href="/"
              >
                Dashboard
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground"
                href="/about"
              >
                About
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground"
                href="/auction"
              >
                Auctions
              </Link>
            </nav>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="ml-auto"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-light">
                Autonomous Cognitive Network
              </h1>
              <Button variant="outline">
                System Status
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="memory">Memory Core</TabsTrigger>
                <TabsTrigger value="perception">Perception Layer</TabsTrigger>
                <TabsTrigger value="action">Action Layer</TabsTrigger>
                <TabsTrigger value="evolver">Evolver</TabsTrigger>
                <TabsTrigger value="treasury">Treasury</TabsTrigger>
              </TabsList>

              <TabsContent value="memory">
                <MemoryDashboard />
              </TabsContent>

              <TabsContent value="perception">
                <PerceptionDashboard />
              </TabsContent>

              <TabsContent value="action">
                <ActionDashboard />
              </TabsContent>

              <TabsContent value="evolver">
                <EvolverDashboard />
              </TabsContent>

              <TabsContent value="treasury">
                <TreasuryDashboard />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                href="https://github.com/amuzetnom02"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                ASECN
              </a>
              . The source code is available on{" "}
              <a
                href="https://github.com/amuzetnom02/asecn"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 