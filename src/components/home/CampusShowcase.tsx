"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Phone,
  Mail,
  Users,
  ArrowRight,
  Book,
  Star,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  galleryService,
  type GalleryImage,
} from "../../../lib/supabase/services"

/* ---------------------------------------------
   Theme Map (JIT-safe Tailwind classes)
---------------------------------------------- */
type CampusTheme = {
  border: string
  text: string
  bg: string
  ring: string
}

const campusThemes: Record<string, CampusTheme> = {
  kitintale: {
    border: "border-red-500",
    text: "text-red-600",
    bg: "bg-red-500",
    ring: "ring-red-100",
  },
  kasokoso: {
    border: "border-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-500",
    ring: "ring-blue-100",
  },
  maganjo: {
    border: "border-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-500",
    ring: "ring-emerald-100",
  },
}

/* ---------------------------------------------
   Campus Metadata
---------------------------------------------- */
const campuses = [
  {
    id: "kitintale",
    name: "Kitintale Campus",
    shortName: "Kitintale",
    address: "Kitintale, Along Kitintale–Kunya Road",
    phone: "+256 772 470 972",
    email: "cleversorigin@gmail.com",
    description:
      "Our flagship campus featuring state-of-the-art facilities, a vibrant kindergarten play zone, and a dedicated performing arts center.",
    keyFeatures: [
      { icon: Users, label: "1,500 Pupils" },
      { icon: GraduationCap, label: "Nursery & Primary" },
      { icon: Star, label: "Day & Boarding" },
    ],
  },
  {
    id: "kasokoso",
    name: "Kasokoso Campus",
    shortName: "Kasokoso",
    address: "Kasokoso, Kireka",
    phone: "+256 750 054 361",
    email: "cleversorigin@gmail.com",
    description:
      "A distinguished urban institution known for academic rigor and an exclusive day-school environment.",
    keyFeatures: [
      { icon: Users, label: "800 Students" },
      { icon: GraduationCap, label: "Nursery & Primary" },
      { icon: Star, label: "Day School Only" },
    ],
  },
  {
    id: "maganjo",
    name: "Maganjo Campus",
    shortName: "Maganjo",
    address: "Maganjo, Bombo Road",
    phone: "+256 753 252 716",
    email: "cleversorigin@gmail.com",
    description:
      "Our newest innovation hub, committed to academic excellence and nurturing specialized learner talents.",
    keyFeatures: [
      { icon: Users, label: "650 Students" },
      { icon: GraduationCap, label: "Nursery to High School" },
      { icon: Star, label: "Innovation Hub" },
    ],
  },
] as const

type CampusId = (typeof campuses)[number]["id"]

/* ---------------------------------------------
   Component
---------------------------------------------- */
const CampusShowcase = () => {
  const [activeTab, setActiveTab] = useState<CampusId>(campuses[0].id)
  const [imagesByCampus, setImagesByCampus] = useState<
    Record<CampusId, GalleryImage[]>
  >({} as Record<CampusId, GalleryImage[]>)

  const [imageIndex, setImageIndex] = useState<Record<CampusId, number>>({
    kitintale: 0,
    kasokoso: 0,
    maganjo: 0,
  })

  const [loading, setLoading] = useState(true)

  /* ---------------------------------------------
     Fetch Images
  ---------------------------------------------- */
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true)
        const allImages = await galleryService.getAll()

        const grouped = {} as Record<CampusId, GalleryImage[]>

        campuses.forEach((campus) => {
          const filtered = allImages.filter((img) =>
            img.category?.toLowerCase().includes(campus.id)
          )

          grouped[campus.id] =
            filtered.length > 0
              ? filtered
              : [
                {
                  id: `fallback-${campus.id}`,
                  file_url: `/images/campuses/${campus.id}-default.jpg`,
                  alt_text: campus.name,
                } as GalleryImage,
              ]
        })

        setImagesByCampus(grouped)
      } catch (error) {
        console.error("Failed to load gallery images:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  /* ---------------------------------------------
     Helpers
  ---------------------------------------------- */
  const activeImages = imagesByCampus[activeTab] || []
  const activeIndex = imageIndex[activeTab] || 0

  const handleNavigate = (direction: number) => {
    if (!activeImages.length) return

    setImageIndex((prev) => ({
      ...prev,
      [activeTab]:
        (prev[activeTab] + direction + activeImages.length) %
        activeImages.length,
    }))
  }

  /* ---------------------------------------------
     Render
  ---------------------------------------------- */
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as CampusId)}
        className="space-y-10"
      >
        {/* Tabs */}
        <div className="flex justify-center">
          <TabsList className="bg-muted/50 p-1 rounded-full border shadow-sm">
            {campuses.map((campus) => {
              const theme = campusThemes[campus.id]
              const isActive = activeTab === campus.id

              return (
                <TabsTrigger
                  key={campus.id}
                  value={campus.id}
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${isActive ? theme.bg : "bg-gray-300"
                        }`}
                    />
                    <span className="font-bold text-sm">
                      {campus.shortName}
                    </span>
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {campuses.map((campus) => {
          const theme = campusThemes[campus.id]
          const images = imagesByCampus[campus.id] || []
          const idx = imageIndex[campus.id] || 0
          const current = images[idx]

          return (
            <TabsContent key={campus.id} value={campus.id}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative group">
                  <div
                    className={`absolute -inset-4 rounded-[2rem] opacity-20 blur-2xl ${theme.bg}`}
                  />

                  <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
                    <AnimatePresence mode="wait">
                      {!loading && current ? (
                        <motion.div
                          key={current.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={current.file_url}
                            alt={current.alt_text || campus.name}
                            fill
                            priority
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                          <Book className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {images.length > 1 && (
                      <div className="absolute inset-x-4 bottom-6 flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => handleNavigate(-1)}
                            className="rounded-full bg-white/90"
                          >
                            <ChevronLeft />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => handleNavigate(1)}
                            className="rounded-full bg-white/90"
                          >
                            <ChevronRight />
                          </Button>
                        </div>
                        <span className="text-xs text-white bg-black/40 px-3 py-1 rounded-full">
                          {idx + 1} / {images.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Badge
                      variant="outline"
                      className={`${theme.text} ${theme.border} px-4 py-1 uppercase text-xs tracking-widest font-bold`}
                    >
                      Campus Discovery
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                      {campus.name}
                    </h2>

                    <p className="text-lg text-slate-600 max-w-xl">
                      {campus.description}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4 border-y py-6">
                    <InfoRow
                      icon={MapPin}
                      label="Location"
                      value={campus.address}
                      theme={theme}
                    />
                    <div className="flex flex-wrap gap-6">
                      <InfoRow
                        icon={Phone}
                        label="Contact"
                        value={campus.phone}
                        theme={theme}
                      />
                      <InfoRow
                        icon={Mail}
                        label="Email"
                        value={campus.email}
                        theme={theme}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {campus.keyFeatures.map((f, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-4 rounded-2xl border flex flex-col items-center gap-2 hover:shadow-md transition"
                      >
                        <f.icon className={`h-6 w-6 ${theme.text}`} />
                        <span className="text-xs font-bold">
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className={`${theme.bg} rounded-full px-8 shadow-lg`}
                  >
                    <Link href={`/campus/${campus.id}`}>
                      View Full Campus Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </section>
  )
}

/* ---------------------------------------------
   Reusable Info Row
---------------------------------------------- */
const InfoRow = ({
  icon: Icon,
  label,
  value,
  theme,
}: {
  icon: any
  label: string
  value: string
  theme: CampusTheme
}) => (
  <div className="flex items-start gap-4">
    <div className={`p-2 rounded-lg ring-4 ${theme.ring} bg-white`}>
      <Icon className={`h-5 w-5 ${theme.text}`} />
    </div>
    <div>
      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  </div>
)

export default CampusShowcase
