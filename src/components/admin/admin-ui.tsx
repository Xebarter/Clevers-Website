"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  loading?: boolean;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="rounded-lg bg-slate-100 p-2">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold text-slate-900">{value}</div>
        )}
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function AdminLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-white p-3 shadow-sm">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
      )}
      <h3 className="text-base font-medium text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AdminTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function adminTableClassName() {
  return "w-full text-sm";
}

export function AdminTableHead() {
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50/80">
        {/* cells styled via th below */}
      </tr>
    </thead>
  );
}

export function adminThClassName() {
  return "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
}

export function adminTdClassName() {
  return "px-4 py-3 align-middle text-slate-700";
}

export function adminTrClassName() {
  return "border-b border-slate-100 transition-colors hover:bg-slate-50/80";
}

export function AdminStatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "success" | "warning" | "danger" | "info" | "neutral" | "purple";
}) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
    danger: "bg-red-50 text-red-700 ring-red-600/20",
    info: "bg-blue-50 text-blue-700 ring-blue-600/20",
    purple: "bg-violet-50 text-violet-700 ring-violet-600/20",
    neutral: "bg-slate-100 text-slate-700 ring-slate-600/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize",
        tones[tone]
      )}
    >
      {label}
    </span>
  );
}

export function AdminIconButton({
  label,
  onClick,
  disabled,
  children,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "h-8 w-8",
        variant === "danger" && "hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      )}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {children}
    </Button>
  );
}
