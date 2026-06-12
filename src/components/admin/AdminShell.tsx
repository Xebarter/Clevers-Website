"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ADMIN_NAV_ITEMS, getAdminNavItem } from "@/lib/admin/navigation";
import { cn } from "@/lib/utils";
import { ExternalLink, LogOut, Menu, School } from "lucide-react";

interface AdminShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

function NavItems({
  activeTab,
  onTabChange,
  onNavigate,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onTabChange(item.id);
              onNavigate?.();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-amber-500" : "text-slate-400")} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ activeTab, onTabChange, onLogout, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const current = getAdminNavItem(activeTab);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
            <School className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Clevers Admin</p>
            <p className="truncate text-xs text-slate-400">Content management</p>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <NavItems activeTab={activeTab} onTabChange={onTabChange} />
        </ScrollArea>
        <div className="border-t border-slate-800 p-3">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Link href="/" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View website
            </Link>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-slate-800 bg-slate-900 p-0 text-white">
                <SheetHeader className="border-b border-slate-800 px-5 py-4 text-left">
                  <SheetTitle className="text-white">Clevers Admin</SheetTitle>
                </SheetHeader>
                <NavItems
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
                {current?.label ?? "Dashboard"}
              </h1>
              {current?.description && (
                <p className="hidden truncate text-sm text-slate-500 sm:block">{current.description}</p>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={onLogout} className="shrink-0">
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
