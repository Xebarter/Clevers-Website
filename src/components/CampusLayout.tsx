"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  CalendarDays,
  ArrowRight,
  ChevronRight,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CampusSlug = "kitintale" | "kasokoso" | "maganjo";

type CampusTheme = {
  accent: string;
  accentBg: string;
  accentBgSoft: string;
  accentBorder: string;
  accentRing: string;
  button: string;
  dot: string;
  heroGradient: string;
  sectionGradient: string;
};

const campusThemes: Record<CampusSlug, CampusTheme> = {
  kitintale: {
    accent: "text-red-600",
    accentBg: "bg-red-500",
    accentBgSoft: "bg-red-50",
    accentBorder: "border-red-100",
    accentRing: "ring-red-100",
    button: "bg-red-500 hover:bg-red-600 shadow-red-200/50",
    dot: "bg-red-500",
    heroGradient: "from-red-50/90 via-white to-pink-50/40",
    sectionGradient: "from-red-50/50 via-white to-yellow-50/30",
  },
  kasokoso: {
    accent: "text-blue-600",
    accentBg: "bg-blue-500",
    accentBgSoft: "bg-blue-50",
    accentBorder: "border-blue-100",
    accentRing: "ring-blue-100",
    button: "bg-blue-500 hover:bg-blue-600 shadow-blue-200/50",
    dot: "bg-blue-500",
    heroGradient: "from-blue-50/90 via-white to-green-50/40",
    sectionGradient: "from-blue-50/50 via-white to-pink-50/30",
  },
  maganjo: {
    accent: "text-emerald-600",
    accentBg: "bg-emerald-500",
    accentBgSoft: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    accentRing: "ring-emerald-100",
    button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/50",
    dot: "bg-emerald-500",
    heroGradient: "from-emerald-50/90 via-white to-yellow-50/40",
    sectionGradient: "from-emerald-50/50 via-white to-green-50/30",
  },
};

const allCampuses: { slug: CampusSlug; name: string; tagline: string }[] = [
  { slug: "kitintale", name: "Kitintale", tagline: "Flagship campus" },
  { slug: "kasokoso", name: "Kasokoso", tagline: "Urban excellence" },
  { slug: "maganjo", name: "Maganjo", tagline: "Innovation hub" },
];

export type CampusInfo = {
  slug: CampusSlug;
  name: string;
  description: string;
  established: string;
  students: string;
  headshot: string;
  principal: string;
  principalTitle: string;
  principalMessage: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  facilities: string[];
  extracurriculars: string[];
  galleryImages: { url: string; alt: string }[];
  imagePlaceholder?: React.ReactNode;
};

function SectionHeader({
  eyebrow,
  title,
  description,
  theme,
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  theme: CampusTheme;
  centered?: boolean;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", centered && "mx-auto text-center")}>
      {eyebrow && (
        <p className={cn("text-xs font-semibold uppercase tracking-[0.2em] mb-3", theme.accent)}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{title}</h2>
      {description && (
        <p className="mt-3 text-gray-600 text-base sm:text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
}

const CampusLayout: React.FC<{ campusInfo: CampusInfo }> = ({ campusInfo }) => {
  const theme = campusThemes[campusInfo.slug];
  const otherCampuses = allCampuses.filter((c) => c.slug !== campusInfo.slug);
  const phoneHref = campusInfo.phone.replace(/\s/g, "");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className={cn("relative overflow-hidden py-16 sm:py-20 bg-gradient-to-b", theme.heroGradient)}>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/40 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/campus" className="hover:text-gray-900 transition-colors">Campuses</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-gray-900">{campusInfo.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
                <span className={cn("h-2 w-2 rounded-full", theme.dot)} />
                {campusInfo.name} Campus
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Where every child{" "}
                <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                  thrives
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">{campusInfo.description}</p>

              <div className="flex flex-wrap gap-4">
                <div className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 bg-white/70", theme.accentBorder)}>
                  <div className={cn("p-2 rounded-lg", theme.accentBgSoft)}>
                    <CalendarDays className={cn("h-5 w-5", theme.accent)} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Established</p>
                    <p className="font-semibold text-gray-900">{campusInfo.established}</p>
                  </div>
                </div>
                <div className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 bg-white/70", theme.accentBorder)}>
                  <div className={cn("p-2 rounded-lg", theme.accentBgSoft)}>
                    <Users className={cn("h-5 w-5", theme.accent)} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Students</p>
                    <p className="font-semibold text-gray-900">{campusInfo.students}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/apply">
                  <Button className={cn("rounded-lg text-white shadow-lg px-6", theme.button)}>
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="rounded-lg border-gray-200">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className={cn("absolute -inset-3 rounded-3xl opacity-30 blur-2xl", theme.accentBg)} />
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/80 bg-gray-100">
                {campusInfo.imagePlaceholder ?? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Building2 className="h-16 w-16 opacity-40" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Headteacher message */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={cn("rounded-2xl border p-6 sm:p-10 bg-gradient-to-br to-white", theme.accentBorder, theme.accentBgSoft)}>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                <div
                  className={cn(
                    "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-4xl ring-4 bg-white",
                    theme.accentRing
                  )}
                >
                  {campusInfo.headshot}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-xs font-semibold uppercase tracking-widest mb-2", theme.accent)}>
                    Message from the Headteacher
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {campusInfo.principal}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">{campusInfo.principalTitle}</p>
                  <blockquote className="text-gray-700 leading-relaxed italic border-l-4 border-gray-200 pl-4">
                    &ldquo;{campusInfo.principalMessage}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={cn("py-16 sm:py-20 bg-gradient-to-b", theme.sectionGradient)}>
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Campus Highlights"
            title="What Makes Us Special"
            description="Programs and approaches that set our campus apart."
            theme={theme}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusInfo.features.map((feature, index) => (
              <article
                key={index}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={cn("inline-flex p-3 rounded-xl mb-4", theme.accentBgSoft)}>{feature.icon}</div>
                <h3 className={cn("text-lg font-bold mb-2", theme.accent)}>{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Activities */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className={cn("text-xl font-bold mb-6 flex items-center gap-2", theme.accent)}>
                <Building2 className="h-5 w-5" />
                Facilities
              </h3>
              <ul className="space-y-3">
                {campusInfo.facilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", theme.dot)} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn("rounded-2xl border p-6 sm:p-8", theme.accentBorder, theme.accentBgSoft)}>
              <h3 className={cn("text-xl font-bold mb-6", theme.accent)}>Extracurricular Activities</h3>
              <ul className="space-y-3">
                {campusInfo.extracurriculars.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", theme.dot)} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {campusInfo.galleryImages.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50/80">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader eyebrow="Campus Life" title="Photo Gallery" theme={theme} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {campusInfo.galleryImages.slice(0, 8).map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-black/5",
                    index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${campusInfo.name} campus`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/gallery">
                <Button variant="outline" className="rounded-lg gap-2">
                  View full gallery <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Visit Us"
            title="Contact Information"
            description="We welcome enquiries and campus visits."
            theme={theme}
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className={cn("rounded-2xl border p-6 sm:p-8 space-y-6", theme.accentBorder, theme.accentBgSoft)}>
              {[
                { icon: MapPin, label: "Address", value: campusInfo.address },
                { icon: Phone, label: "Phone", value: campusInfo.phone, href: `tel:${phoneHref}` },
                { icon: Mail, label: "Email", value: campusInfo.email, href: `mailto:${campusInfo.email}` },
                { icon: Clock, label: "School Hours", value: campusInfo.hours },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className={cn("p-2.5 rounded-xl bg-white ring-4", theme.accentRing)}>
                    <Icon className={cn("h-5 w-5", theme.accent)} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="font-medium text-gray-900 hover:underline">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-gray-900">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-center text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to learn more?</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Reach out with questions about admissions, programs, or scheduling a campus tour.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/contact">
                  <Button className={cn("w-full rounded-lg text-white", theme.button)}>
                    Send a message
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button variant="outline" className="w-full rounded-lg">
                    Start application
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other campuses */}
      <section className="py-12 border-t border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-6">
            Explore our other campuses
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {otherCampuses.map((campus) => {
              const t = campusThemes[campus.slug];
              return (
                <Link
                  key={campus.slug}
                  href={`/campus/${campus.slug}`}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("h-2.5 w-2.5 rounded-full", t.dot)} />
                    <div>
                      <p className="font-semibold text-gray-900">{campus.name}</p>
                      <p className="text-xs text-gray-500">{campus.tagline}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={cn("py-16 sm:py-20 bg-gradient-to-r text-center", theme.sectionGradient)}>
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join the {campusInfo.name} Campus Family
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Take the first step toward a bright future for your child at Clevers&apos; Origin Schools.
          </p>
          <Link href="/apply">
            <Button size="lg" className={cn("rounded-lg text-white shadow-lg px-8", theme.button)}>
              Apply for Admission <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CampusLayout;
