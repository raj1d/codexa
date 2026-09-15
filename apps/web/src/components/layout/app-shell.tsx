"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-black text-[#E1E0CC]">
      {/* Sticky Dark Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 justify-between">
        <Header showBrandLogo={collapsed} />

        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-[1280px] w-full mx-auto">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/[0.06] bg-[#0c0c0c] py-8 px-6 sm:px-10 text-center font-mono text-xs text-gray-400 flex flex-col items-center gap-1.5 mt-auto">
          <p className="text-white">
            &copy; 2026 CODEXA &bull; Designed &amp; Developed by{" "}
            <span className="text-[#DEDBC8] font-semibold">Raj Prajapati</span>
          </p>
          <p className="text-[11px] text-gray-500">
            Open-Source Education Hub for IT &amp; Computer Engineering Students.
          </p>
        </footer>
      </div>
    </div>
  );
}
