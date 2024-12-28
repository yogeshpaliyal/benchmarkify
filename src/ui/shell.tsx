import { Github } from 'lucide-react'
// import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Outlet } from 'react-router-dom'

export function Shell() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Benchmarkify 📈</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/yogeshpaliyal/benchmarkify">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center gap-4 md:h-14 md:flex-row justify-center">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a href="https://github.com/yogeshpaliyal" className="font-medium underline underline-offset-4">
              yogeshpaliyal
            </a>
            . The source code is available on{" "}
            <a href="https://github.com/yogeshpaliyal/benchmarkify" className="font-medium underline underline-offset-4">
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
