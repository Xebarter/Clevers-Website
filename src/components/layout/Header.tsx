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
  const [isApplyPage, setIsApplyPage] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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
        {
          name: "Academics", 
          href: "#",
          submenu: [
            { name: "Overview", href: "/academics" },
            { name: "Curriculum", href: "/academics/curriculum" },
            { name: "Teachers & Staff", href: "/academics/teachers-staff" },
            { name: "Academic Calendar", href: "/academics/calendar" },
          ]
        },
        {
          name: "Student Life",
          href: "#",
          submenu: [
            { name: "Activities", href: "/student-life/activities" },
            { name: "Arts & Culture", href: "/student-life/arts" },
            { name: "Sports", href: "/student-life/sports" },
          ]
        }
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
    { name: "Contact", href: "/contact" },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const renderMobileSubmenu = (items: any[], pathPrefix = "", level = 0) => {
    return items.map((item) => {
      const itemPath = `${pathPrefix}${item.name}`;
      const isExpanded = expandedItems[itemPath];
      
      return (
        <div 
          key={itemPath} 
          className={`${level > 0 ? 'border-l border-gray-200' : 'border-b border-gray-200'}`}
        >
          {item.submenu ? (
            <div>
              <button
                onClick={() => toggleExpanded(itemPath)}
                className={`flex items-center justify-between w-full text-left py-2.5 px-3 ${
                  level > 0 ? 'pl-4 ml-3 text-sm' : 'font-medium'
                } ${level > 1 ? 'pl-6' : ''}`}
              >
                <span>{item.name}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
              
              {isExpanded && (
                <div className={`${level === 0 ? 'ml-2' : 'ml-3'} mb-1`}>
                  {renderMobileSubmenu(item.submenu, `${itemPath}-`, level + 1)}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.href}
              className={`block py-2.5 px-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 ${
                pathname === item.href ? 'text-gray-900 font-medium bg-gray-50' : ''
              } ${level > 0 ? 'pl-4 ml-3 text-sm' : ''} ${level > 1 ? 'pl-6' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          )}
        </div>
      );
    });
  };

  if (isApplyPage) {
    return (
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo.svg" 
                  alt="Clevers' Origin Schools Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl font-heading sm:block hidden">Clevers' Origin Schools</span>
              <span className="font-bold text-xl font-heading sm:hidden">COJS</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Need Help?</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image 
                src="/logo.svg" 
                alt="Clevers' Origin Schools Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl sm:block hidden">Clevers' Origin Schools</span>
            <span className="font-bold text-xl sm:hidden">COS</span>
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
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/apply" className="mr-1">
              <Button size="sm" className="px-3 py-1">Apply</Button>
            </Link>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-1">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-bold text-lg">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  
                  <div className="overflow-y-auto flex-grow">
                    <nav className="flex flex-col">
                      {renderMobileSubmenu(menuItems)}
                    </nav>
                  </div>
                  
                  <div className="mt-auto p-4 border-t">
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