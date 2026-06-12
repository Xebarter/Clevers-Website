"use client"

import Link from "next/link"
import { Music, Medal, Book, ChevronRight, type LucideIcon } from "lucide-react"

type FeatureTheme = {
  iconBg: string
  iconText: string
  border: string
  accent: string
  link: string
  glow: string
}

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  href: string
  theme: FeatureTheme
}

const features: Feature[] = [
  {
    icon: Music,
    title: "Music, Dance & Drama",
    description:
      "Our award-winning MDD program nurtures artistic talents and builds confidence through performances and competitions.",
    href: "/student-life/arts",
    theme: {
      iconBg: "bg-pink-50",
      iconText: "text-pink-600",
      border: "border-pink-100",
      accent: "bg-pink-500",
      link: "text-pink-600 hover:text-pink-700",
      glow: "from-pink-500/10 via-pink-300/5 to-transparent",
    },
  },
  {
    icon: Medal,
    title: "Extracurricular Activities",
    description:
      "From football to swimming, we offer diverse programs to develop well-rounded students.",
    href: "/student-life/activities",
    theme: {
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      border: "border-blue-100",
      accent: "bg-blue-500",
      link: "text-blue-600 hover:text-blue-700",
      glow: "from-blue-500/10 via-blue-300/5 to-transparent",
    },
  },
  {
    icon: Book,
    title: "Academic Excellence",
    description:
      "A rigorous academic program designed to prepare students for lifelong success.",
    href: "/academics/curriculum",
    theme: {
      iconBg: "bg-green-50",
      iconText: "text-green-600",
      border: "border-green-100",
      accent: "bg-green-500",
      link: "text-green-600 hover:text-green-700",
      glow: "from-green-500/10 via-green-300/5 to-transparent",
    },
  },
]

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon
  const { theme } = feature

  return (
    <article
      className={`group relative flex flex-col h-full rounded-2xl border ${theme.border} bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${theme.accent}`} />
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative p-6 sm:p-7 flex flex-col flex-1">
        <div
          className={`w-12 h-12 rounded-xl ${theme.iconBg} ring-1 ring-black/5 flex items-center justify-center mb-5`}
        >
          <Icon className={`w-6 h-6 ${theme.iconText}`} />
        </div>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
          {feature.title}
        </h3>

        <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-1">
          {feature.description}
        </p>

        <Link
          href={feature.href}
          className={`inline-flex items-center gap-1 mt-6 text-sm font-semibold ${theme.link} transition-colors`}
        >
          Learn more
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

export default function WhyChooseUs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {features.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  )
}
