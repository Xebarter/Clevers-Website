"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronRight, RefreshCw, Search, type LucideIcon } from "lucide-react";

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

const statAccents = {
  slate: { icon: "bg-slate-100 text-slate-600", ring: "hover:ring-slate-200" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", ring: "hover:ring-emerald-200" },
  blue: { icon: "bg-blue-50 text-blue-600", ring: "hover:ring-blue-200" },
  amber: { icon: "bg-amber-50 text-amber-600", ring: "hover:ring-amber-200" },
  violet: { icon: "bg-violet-50 text-violet-600", ring: "hover:ring-violet-200" },
  rose: { icon: "bg-rose-50 text-rose-600", ring: "hover:ring-rose-200" },
} as const;

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
  accent = "slate",
  onClick,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  loading?: boolean;
  accent?: keyof typeof statAccents;
  onClick?: () => void;
}) {
  const styles = statAccents[accent];

  return (
    <Card
      className={cn(
        "border-slate-200 shadow-sm transition-all text-left w-full",
        onClick && "cursor-pointer hover:shadow-md hover:ring-2 ring-transparent",
        onClick && styles.ring
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={cn("rounded-lg p-2", styles.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="text-left">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold tabular-nums text-slate-900">{value}</div>
        )}
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function AdminLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="hero-spinner scale-90" role="status" aria-label={message} />
      <p className="text-sm font-medium text-slate-500">{message}</p>
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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AdminPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-slate-200 shadow-sm", className)}>
      <CardContent className="p-0 sm:p-0">{children}</CardContent>
    </Card>
  );
}

export function AdminTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function adminThClassName() {
  return "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap";
}

export function adminTdClassName() {
  return "px-4 py-3 align-middle text-slate-700";
}

export function adminTrClassName() {
  return "border-b border-slate-100 transition-colors hover:bg-slate-50/80 last:border-0";
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
        "h-8 w-8 shrink-0",
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

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-[200px] flex-1 sm:max-w-xs", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 border-slate-200 bg-white pl-9"
      />
    </div>
  );
}

export function AdminFilterSelect({
  value,
  onChange,
  placeholder,
  options,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("h-9 w-full border-slate-200 bg-white sm:w-[160px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AdminToolbar({
  children,
  resultCount,
  totalCount,
}: {
  children: React.ReactNode;
  resultCount?: number;
  totalCount?: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
        {children}
      </div>
      {resultCount !== undefined && totalCount !== undefined && (
        <p className="text-xs text-slate-500">
          Showing {resultCount} of {totalCount} {totalCount === 1 ? "item" : "items"}
        </p>
      )}
    </div>
  );
}

export function AdminRefreshButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className="h-9 shrink-0 border-slate-200"
    >
      <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
      Refresh
    </Button>
  );
}

export function AdminOverviewSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function AdminOverviewRow({
  primary,
  secondary,
  meta,
  badge,
  onClick,
}: {
  primary: string;
  secondary?: string;
  meta?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left last:border-0 last:pb-0",
        onClick && "rounded-lg transition-colors hover:bg-slate-50 -mx-2 px-2"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{primary}</p>
        {secondary && <p className="truncate text-sm text-slate-500">{secondary}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {badge}
        {meta && <span className="text-xs text-slate-400 whitespace-nowrap">{meta}</span>}
        {onClick && <ChevronRight className="h-4 w-4 text-slate-300" />}
      </div>
    </Wrapper>
  );
}

export function AdminQuickAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow"
    >
      <Icon className="h-4 w-4 text-amber-600" />
      {label}
    </button>
  );
}

export function AdminMobileCard({
  title,
  subtitle,
  badge,
  meta,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {badge}
      </div>
      {meta && <p className="mb-3 text-xs text-slate-400">{meta}</p>}
      {children}
    </div>
  );
}

export function AdminNoResults({ onClear }: { onClear?: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm font-medium text-slate-700">No results match your filters</p>
      {onClear && (
        <Button variant="link" size="sm" onClick={onClear} className="mt-1 text-amber-700">
          Clear filters
        </Button>
      )}
    </div>
  );
}
