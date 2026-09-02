"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";
import { dark } from "@clerk/themes";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("taskpulse_theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        localStorage.setItem("taskpulse_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        localStorage.setItem("taskpulse_theme", "light");
      }
      return next;
    });
  };

  const clerkAppearance = isDark
    ? {
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        baseTheme: dark,
        variables: {
          colorPrimary: "#4f46e5",
          colorBackground: "#0d1226",
          colorInputBackground: "#161d3b",
          colorText: "#f8fafc",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "border border-indigo-950/60 shadow-2xl bg-[#0d1226]",
          formButtonPrimary:
            "btn-3d-indigo text-white font-medium hover:brightness-110",
        },
      }
    : {
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        baseTheme: undefined,
        variables: {
          colorPrimary: "#4f46e5",
          colorBackground: "#ffffff",
          colorInputBackground: "#f8fafc",
          colorText: "#0f172a",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "border border-slate-200 shadow-xl bg-white",
          formButtonPrimary:
            "btn-3d-indigo text-white font-medium hover:brightness-110",
        },
      };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>
    </ThemeContext.Provider>
  );
}