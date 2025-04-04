"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, HelpCircle } from "lucide-react";
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
  const [isApplyPage, setIsApplyPage] = useState(false);

  useEffect(() => {
    setIsApplyPage(pathname === "/apply");
  }, [pathname]);

  const menuItems = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "#",
      submenu: [
        { name: "Our Story", href: "/about" },
        { name: "Mission & Vision", href: "/about/mission" },
        { name: "Leadership", href: "/about/leadership" },
        { name: "Campuses", href: "#", submenu: [
          { name: "Kitintale Campus", href: "/campus/kitintale" },
          { name: "Kasokoso Campus", href: "/campus/kasokoso" },
          { name: "Maganjo Campus", href: "/campus/maganjo" },
        ]},
        { name: "Student Life", href: "#", submenu: [
          { name: "Activities", href: "/student-life/activities" },
          { name: "Arts & Culture", href: "/student-life/arts" },
          { name: "Sports", href: "/student-life/sports" },
        ]},
      ],
    },
    {
      name: "Academics",
      href: "/academics",
      submenu: [
        { name: "Overview", href: "/academics" },
        { name: "Curriculum", href: "/academics/curriculum" },
        { name: "Teachers & Staff", href: "/academics/teachers-staff" },
        { name: "Academic Calendar", href: "/academics/calendar" },
      ],
    },
    { name: "Gallery", href: "/gallery" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ];

  // Simplified version for application page
  if (isApplyPage) {
    return (
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-12 w-12">
                <Image 
                  src="/logo.svg" 
                  alt="Clevers' Origin Schools Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl font-heading">Clevers' Origin Schools</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>Need Help?</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Recursive function to render nested dropdown menus
  const renderDropdown = (item: any) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center text-gray-700 hover:text-gray-900 py-2">
            {item.name} <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="bg-white rounded-md shadow-lg p-2 min-w-[200px]">
          {item.submenu.map((subItem: any) => (
            <DropdownMenuItem key={subItem.name} asChild>
              {subItem.submenu ? (
                renderDropdown(subItem)
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
    );
  };

  // Recursive function for mobile menu
  const renderMobileMenu = (item: any, depth = 0) => {
    return (
      <div key={item.name} className={`space-y-2 ${depth > 0 ? 'ml-4' : ''}`}>
        {item.submenu ? (
          <>
            <div className="font-medium">{item.name}</div>
            <div className={`ml-4 space-y-2 ${depth === 0 ? 'border-l-2 pl-4' : ''}`}>
              {item.submenu.map((subItem: any) => renderMobileMenu(subItem, depth + 1))}
            </div>
          </>
        ) : (
          <Link
            href={item.href}
            className="font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.name}
          </Link>
        )}
      </div>
    );
  };

  // Full version for other pages
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-12 w-12">
              <Image 
                src="/logo.svg" 
                alt="Clevers' Origin Schools Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl">Clevers' Origin Schools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  renderDropdown(item)
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 py-2"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/apply">
              <Button>Apply Now</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <span className="font-bold text-xl">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-4 py-6">
                    {menuItems.map((item) => renderMobileMenu(item))}
                  </nav>
                  <div className="mt-auto pb-8">
                    <Link href="/apply" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Apply Now</Button>
                    </Link>
                  </div>
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