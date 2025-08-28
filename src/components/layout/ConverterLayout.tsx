"use client";

import { ConverterHeader } from "./ConverterHeader";
import { ThemeProvider } from "../ThemeProvider";
import { Toaster } from "../ui/sonner";

interface ConverterLayoutProps {
  children: React.ReactNode;
}

export function ConverterLayout({ children }: ConverterLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <ConverterHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}


