import {
  LayoutDashboard,
  Users,
  Briefcase,
  Trophy,
  FileText,
  MessageSquare,
  Bell,
  Calendar,
  Image,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, description: "Dashboard summary" },
  { id: "applications", label: "Applications", icon: Users, description: "Student applications" },
  { id: "job-applications", label: "Job Applications", icon: Briefcase, description: "Career submissions" },
  { id: "hall-of-fame", label: "Hall of Fame", icon: Trophy, description: "Achievement highlights" },
  { id: "resources", label: "Resources", icon: FileText, description: "Downloads & documents" },
  { id: "messages", label: "Messages", icon: MessageSquare, description: "Contact inquiries" },
  { id: "announcements", label: "Announcements", icon: Bell, description: "News & updates" },
  { id: "events", label: "Events", icon: Calendar, description: "Calendar events" },
  { id: "gallery", label: "Gallery", icon: Image, description: "Photo gallery" },
];

export function getAdminNavItem(id: string) {
  return ADMIN_NAV_ITEMS.find((item) => item.id === id);
}
