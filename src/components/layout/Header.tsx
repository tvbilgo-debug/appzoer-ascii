
"use client";

import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";
import { Image as ImageIcon, LogIn, User, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import * as React from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useSession, signOut } from "next-auth/react";
import { CreditDisplay } from "@/components/ui/CreditDisplay";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="flex justify-center w-full border-b">
      <div className="flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/mark-8.svg" alt="Logo" width={24} height={24} />
            <span className="text-xl font-bold font-mono">ASCII Generator</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link href="/landing" className="text-sm hover:underline">Home</Link>
            <Link href="/landing#pricing" className="text-sm hover:underline">Pricing</Link>
            {session && (
              <Link href="/converter" className="text-sm hover:underline">Converter</Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {session && <CreditDisplay />}
            <ThemeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {session.user?.name || session.user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
      <LoginDialog open={open} onOpenChange={setOpen} setOpen={setOpen} />
    </header>
  );
}
