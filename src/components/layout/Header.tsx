"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const menuItems = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "#",
      submenu: [
        { name: "Our Story", href: "/about" },
        { name: "Mission & Vision", href: "/about/mission" },
      ],
    },
    {
      name: "Campuses",
      href: "#",
      submenu: [
        { name: "Kitintale Campus", href: "/campus/kitintale" },
        { name: "Kasokoso Campus", href: "/campus/kasokoso" },
        { name: "Maganjo Campus", href: "/campus/maganjo" },
      ],
    },
    { name: "Gallery", href: "/gallery" },
    { name: "Resources", href: "/resources" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const renderMobileSubmenu = (items: any[], pathPrefix = "", level = 0) => {
    return items.map((item) => {
      const itemPath = `${pathPrefix}${item.name}`;
      const isExpanded = expandedItems[itemPath];

      return (
        <div
          key={itemPath}
          className={`${level > 0 ? "border-l border-gray-200" : "border-b border-gray-200"}`}
        >
          {item.submenu ? (
            <div>
              <button
                onClick={() => toggleExpanded(itemPath)}
                className={`flex items-center justify-between w-full text-left py-2.5 px-3 ${
                  level > 0 ? "pl-4 ml-3 text-sm" : "font-medium"
                } ${level > 1 ? "pl-6" : ""}`}
              >
                <span>{item.name}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className={`${level === 0 ? "ml-2" : "ml-3"} mb-1`}>
                  {renderMobileSubmenu(item.submenu, `${itemPath}-`, level + 1)}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.href}
              className={`block py-2.5 px-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 ${
                pathname === item.href ? "text-gray-900 font-medium bg-gray-50" : ""
              } ${level > 0 ? "pl-4 ml-3 text-sm" : ""} ${level > 1 ? "pl-6" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image src="/logo.svg" alt="Clevers' Origin Schools Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-xl font-heading sm:block hidden">Clevers' Origin Schools</span>
            <span className="font-bold text-xl font-heading sm:hidden">COJS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center text-gray-700 hover:text-gray-900 py-2">
                        {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="bg-white rounded-md shadow-lg p-2 min-w-[200px]">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          {subItem.submenu ? (
                            <div className="relative group">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex justify-between items-center">
                                  {subItem.name}
                                  <ChevronDown className="ml-1 h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="ml-2 bg-white rounded-md shadow-lg p-2 min-w-[200px]">
                                  {subItem.submenu.map((nestedItem) => (
                                    <DropdownMenuItem key={nestedItem.name} asChild>
                                      <Link
                                        href={nestedItem.href}
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md w-full text-left"
                                      >
                                        {nestedItem.name}
                                      </Link>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ) : (
                            <Link
                              href={subItem.href}
                              className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md w-full text-left"
                            >
                              {subItem.name}
                            </Link>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href} className="text-gray-700 hover:text-gray-900 py-2">
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/apply">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">Apply Now</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/apply" className="mr-1">
              <Button size="sm" className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white">
                Apply
              </Button>
            </Link>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                    <div className="relative w-8 h-8">
                      <Image src="/logo.svg" alt="Clevers' Origin Schools Logo" fill className="object-contain" />
                    </div>
                    <span className="font-bold">Clevers' Origin</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100vh-73px)]">
                  {menuItems.map((item) => (
                    <div key={item.name} className="mb-1">
                      {renderMobileSubmenu([item])}
                    </div>
                  ))}
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
