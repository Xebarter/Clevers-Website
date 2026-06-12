"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, ChevronRight, ArrowRight, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type MenuItem = {
  name: string;
  href: string;
  submenu?: { name: string; href: string; description?: string; dot?: string }[];
};

const menuItems: MenuItem[] = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    submenu: [
      { name: "Our Story", href: "/about", description: "History & values" },
      { name: "Mission & Vision", href: "/about/mission", description: "What drives us" },
    ],
  },
  {
    name: "Campuses",
    href: "/campus",
    submenu: [
      { name: "Kitintale Campus", href: "/campus/kitintale", description: "Flagship campus", dot: "bg-red-500" },
      { name: "Kasokoso Campus", href: "/campus/kasokoso", description: "Urban day school", dot: "bg-blue-500" },
      { name: "Maganjo Campus", href: "/campus/maganjo", description: "Innovation hub", dot: "bg-emerald-500" },
    ],
  },
  { name: "Gallery", href: "/gallery" },
  { name: "Resources", href: "/resources" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isItemActive(pathname: string, item: MenuItem) {
  if (isLinkActive(pathname, item.href)) return true;
  return item.submenu?.some((sub) => isLinkActive(pathname, sub.href)) ?? false;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.submenu?.some((sub) => isLinkActive(pathname, sub.href))) {
        initial[item.name] = true;
      }
    });
    setExpandedItems((prev) => ({ ...prev, ...initial }));
  }, [pathname]);

  const toggleExpanded = useCallback((itemName: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  }, []);

  const navLinkClass = (active: boolean) =>
    cn(
      "relative px-1 py-2 text-sm font-medium transition-colors",
      active ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
    );

  const NavIndicator = ({ active }: { active: boolean }) =>
    active ? (
      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500" />
    ) : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14" : "h-16 sm:h-[4.25rem]"
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div
              className={cn(
                "relative shrink-0 transition-all duration-300",
                scrolled ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11"
              )}
            >
              <Image
                src="/logo.svg"
                alt="Clevers' Origin Schools"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block truncate font-bold text-gray-900 font-heading text-base sm:text-lg">
                <span className="hidden sm:inline">Clevers&apos; Origin Schools</span>
                <span className="sm:hidden">Clevers&apos; Origin</span>
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-widest text-green-600 lg:block">
                Mean What You&apos;re
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1" aria-label="Main navigation">
            {menuItems.map((item) => {
              const active = isItemActive(pathname, item);

              if (item.submenu) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(navLinkClass(active), "flex items-center gap-0.5 outline-none")}
                        aria-current={active ? "true" : undefined}
                      >
                        {item.name}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        <NavIndicator active={active} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={10}
                      className="min-w-[220px] rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg"
                    >
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.href} asChild className="p-0 focus:bg-transparent">
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                              isLinkActive(pathname, subItem.href)
                                ? "bg-green-50 text-green-800"
                                : "hover:bg-gray-50"
                            )}
                          >
                            {subItem.dot && (
                              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", subItem.dot)} />
                            )}
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-gray-900">{subItem.name}</span>
                              {subItem.description && (
                                <span className="block text-xs text-gray-500">{subItem.description}</span>
                              )}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      {item.name === "Campuses" && (
                        <div className="mt-1 border-t border-gray-100 pt-1">
                          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                            <Link
                              href="/campus"
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50"
                            >
                              View all campuses
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </DropdownMenuItem>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={navLinkClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {item.name}
                  <NavIndicator active={active} />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="tel:+256772470972"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 xl:flex"
            >
              <Phone className="h-4 w-4 text-green-600" />
              <span className="hidden 2xl:inline">+256 772 470 972</span>
            </a>
            <Link href="/apply">
              <Button className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 px-5 shadow-md shadow-pink-200/50 hover:from-pink-600 hover:to-pink-700">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/apply">
              <Button
                size="sm"
                className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 px-3 text-white shadow-sm"
              >
                Apply
              </Button>
            </Link>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg border-gray-200"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex h-full w-[min(20rem,85vw)] max-w-sm flex-col border-l border-gray-100 p-0 [&>button.absolute]:hidden"
              >
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative h-9 w-9">
                      <Image src="/logo.svg" alt="Clevers' Origin Schools" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-gray-900">Clevers&apos; Origin</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
                  {menuItems.map((item) => {
                    const active = isItemActive(pathname, item);

                    if (item.submenu) {
                      const expanded = expandedItems[item.name];
                      return (
                        <div key={item.name} className="mb-1">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(item.name)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-semibold transition-colors",
                              active ? "bg-green-50 text-green-800" : "text-gray-800 hover:bg-gray-50"
                            )}
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-gray-400 transition-transform",
                                expanded && "rotate-180"
                              )}
                            />
                          </button>
                          {expanded && (
                            <div className="mb-2 ml-2 space-y-0.5 border-l-2 border-green-100 pl-3">
                              {item.submenu.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={cn(
                                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                    isLinkActive(pathname, sub.href)
                                      ? "bg-green-50 font-medium text-green-800"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  )}
                                >
                                  {sub.dot && (
                                    <span className={cn("h-2 w-2 shrink-0 rounded-full", sub.dot)} />
                                  )}
                                  <span>
                                    <span className="block font-medium">{sub.name}</span>
                                    {sub.description && (
                                      <span className="block text-xs text-gray-400">{sub.description}</span>
                                    )}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "mb-1 flex items-center justify-between rounded-lg px-3 py-3 font-semibold transition-colors",
                          active
                            ? "bg-green-50 text-green-800"
                            : "text-gray-800 hover:bg-gray-50"
                        )}
                      >
                        {item.name}
                        {active && <ChevronRight className="h-4 w-4 text-green-600" />}
                      </Link>
                    );
                  })}
                </nav>

                <div className="space-y-3 border-t border-gray-100 bg-gray-50/80 p-4">
                  <a
                    href="tel:+256772470972"
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700"
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                    Call +256 772 470 972
                  </a>
                  <Link href="/apply" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 py-5 shadow-md">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
