"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  LogOut,
  HomeIcon,
  Users,
  BarChart,
  Megaphone,
  Calendar,
  FileText,
  Settings,
  Edit,
  Image,
  LayoutGrid, // Added LayoutGrid for contentItems
  GraduationCap // Added GraduationCap for userItems
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from './auth';

interface AdminNavProps {
  onLogout?: () => void;
}

export default function AdminNav({ onLogout }: AdminNavProps) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { name: 'Applications', href: '/admin/applications', icon: <ClipboardList className="h-5 w-5" /> },
    { name: 'Students', href: '/admin/students', icon: <Users className="h-5 w-5" /> },
    { name: 'Reports', href: '/admin/reports', icon: <BarChart className="h-5 w-5" /> },
    {
      name: 'Content',
      href: '/admin/content',
      icon: <Edit className="h-5 w-5" />,
      isSection: true
    },
    { name: 'Announcements', href: '/admin/content/announcements', icon: <Megaphone className="h-5 w-5" /> },
    { name: 'Events', href: '/admin/content/events', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Pages', href: '/admin/content/pages', icon: <FileText className="h-5 w-5" /> },
    { name: 'Media Library', href: '/admin/content/media', icon: <Image className="h-5 w-5" /> },
    { name: 'Settings', href: '/admin/content/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  // Updated contentItems array
  const contentItems = [
    {
      title: "Dashboard",
      href: "/admin/content",
      icon: <LayoutGrid className="h-4 w-4" />,
    },
    {
      title: "Announcements",
      href: "/admin/content/announcements",
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      title: "Events",
      href: "/admin/content/events",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Pages",
      href: "/admin/content/pages",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Media Library",
      href: "/admin/content/media",
      icon: <Image className="h-4 w-4" />,
    },
  ];

  // Admin menu items
  const userItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Applications",
      href: "/admin/applications",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Students",
      href: "/admin/students",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      title: "Content",
      href: "/admin/content",
      icon: <Edit className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart className="h-4 w-4" />,
    }
  ];

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-kinder-red" />
              <div className="h-6 w-6 rounded-full bg-kinder-blue -ml-1.5" />
              <div className="h-6 w-6 rounded-full bg-kinder-green -ml-1.5" />
            </div>
            <span className="font-bold text-xl font-heading">Admin</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isSubItem = item.href.includes('/content/') && !item.isSection;

          if (isSubItem && pathname !== item.href && !pathname.startsWith('/admin/content')) {
            return null;
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center ${isSubItem ? 'ml-6 pl-2' : 'px-4'} py-3 rounded-xl transition-all
                ${isActive ?
                  'bg-kinder-blue text-white font-medium shadow-md' :
                  'text-gray-700 hover:bg-kinder-blue/10'
                }
                ${item.isSection ? 'mt-4 font-semibold' : ''}
              `}
            >
              {item.icon}
              <span className="font-body ml-3">{item.name}</span>
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full flex items-center justify-start space-x-3 text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-body">Logout</span>
        </Button>
      </div>
    </div>
  );
}
