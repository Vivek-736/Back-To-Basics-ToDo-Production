"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { useTheme } from "@/components/ThemeClerkProvider";

export default function Header() {
  const { user, isSignedIn } = useUser();
  const { isDark, toggleTheme } = useTheme();

  const displayName = user?.firstName || "Vivek";

  return (
    <header className="w-full max-w-7xl mx-auto flex items-center justify-between pt-8 md:pt-10 pb-6 md:pb-8 px-3 md:px-6">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-indigo-900/40">
          <Image
            src="/icon.svg"
            alt="TaskPulse Logo"
            width={36}
            height={36}
            priority
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-main">
          Task{" "}<span className="text-indigo-500">Pulse</span>
        </span>
      </div>

      {/* Center Dynamic Heading: Signed In vs Signed Out */}
      <div className="text-center">
        {isSignedIn ? (
          <>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-main tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs md:text-sm text-sub font-normal mt-0.5">
              Let&apos;s crush your tasks today.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-main tracking-tight">
              Sign in to use the services
            </h1>
            <p className="text-xs md:text-sm text-sub font-normal mt-0.5">
              Organize, track, and complete your tasks with TaskPulse.
            </p>
          </>
        )}
      </div>

      {/* Right Controls: Theme Toggle & Clerk Auth */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-xl control-box flex items-center justify-center hover:border-indigo-500/50 transition shadow-md cursor-pointer"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-indigo-300" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {isSignedIn ? (
          <div className="flex items-center border border-indigo-500/30 p-0.5 rounded-full">
            <UserButton />
          </div>
        ) : (
          <SignInButton mode="modal">
            <button className="btn-3d-indigo text-xs px-3.5 py-1.5 rounded-xl text-white font-medium cursor-pointer">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </header>
  );
}