"use client"

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Phone,
  Mail,
  Users,
  ArrowRight,
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
  bgSoft: string
  ring: string
  gradient: string
  dot: string
}

const campusThemes: Record<string, CampusTheme> = {
  kitintale: {
    border: "border-red-200",
    text: "text-red-600",
    bg: "bg-red-500",
    bgSoft: "bg-red-50",
    ring: "ring-red-100",
    gradient: "from-red-500/20 via-red-300/10 to-transparent",
    dot: "bg-red-500",
  },
  kasokoso: {
    border: "border-blue-200",
    text: "text-blue-600",
    bg: "bg-blue-500",
    bgSoft: "bg-blue-50",
    ring: "ring-blue-100",
    gradient: "from-blue-500/20 via-blue-300/10 to-transparent",
    dot: "bg-blue-500",
  },
  maganjo: {
    border: "border-emerald-200",
    text: "text-emerald-600",
    bg: "bg-emerald-500",
    bgSoft: "bg-emerald-50",
    ring: "ring-emerald-100",
    gradient: "from-emerald-500/20 via-emerald-300/10 to-transparent",
    dot: "bg-emerald-500",
  },
}

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

const DEFAULT_BLUR =
  "data:image/svg+xml;base64," +
  btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 40 30">
      <rect width="40" height="30" fill="#ecfdf5"/>
      <circle cx="20" cy="15" r="8" fill="#86efac" opacity="0.6"/>
    </svg>
  `)

function imageKey(campusId: string, image: GalleryImage, index: number) {
  return `${campusId}-${image.id ?? index}`
}

/* ---------------------------------------------
   Campus Image Viewer
---------------------------------------------- */
function CampusImageViewer({
  campusId,
  campusName,
  images,
  currentIndex,
  theme,
  metadataLoading,
  loadedKeys,
  onImageLoaded,
  onNavigate,
  onDotSelect,
}: {
  campusId: CampusId
  campusName: string
  images: GalleryImage[]
  currentIndex: number
  theme: CampusTheme
  metadataLoading: boolean
  loadedKeys: Set<string>
  onImageLoaded: (key: string) => void
  onNavigate: (direction: number) => void
  onDotSelect: (index: number) => void
}) {
  const current = images[currentIndex]
  const currentKey = current ? imageKey(campusId, current, currentIndex) : ""
  const showSpinner = metadataLoading || (current && !loadedKeys.has(currentKey))

  return (
    <div className="relative group">
      <div
        className={`absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br ${theme.gradient} blur-xl opacity-80`}
      />

      <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 shadow-xl shadow-green-900/5 ring-1 ring-black/5">
        {showSpinner && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/95 via-green-50/95 to-white/95 backdrop-blur-[2px]"
            aria-busy="true"
            aria-label="Loading campus image"
          >
            <div className="hero-spinner" role="status" />
            <p className="text-xs font-medium text-green-700/70 tracking-wide uppercase">
              Loading photo
            </p>
          </div>
        )}

        {!metadataLoading && images.length > 0 && (
          <>
            {images.map((img, index) => {
              const key = imageKey(campusId, img, index)
              const isCurrent = index === currentIndex
              const isAdjacent =
                index === (currentIndex + 1) % images.length ||
                index === (currentIndex - 1 + images.length) % images.length
              const blurData = img.blur_url || DEFAULT_BLUR

              return (
                <div
                  key={key}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                  aria-hidden={!isCurrent}
                >
                  <Image
                    src={img.file_url}
                    alt={img.alt_text || img.title || campusName}
                    fill
                    priority={isCurrent}
                    loading={isCurrent || isAdjacent ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL={blurData}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    onLoad={() => onImageLoaded(key)}
                    onError={() => onImageLoaded(key)}
                  />
                </div>
              )
            })}

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent z-20 pointer-events-none" />

            <div className="absolute bottom-0 inset-x-0 z-20 p-5 sm:p-6 pointer-events-none">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                {campusName}
              </p>
              {current?.title && (
                <p className="text-white text-sm font-medium line-clamp-1">
                  {current.title}
                </p>
              )}
            </div>

            {images.length > 1 && (
              <>
                <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium tabular-nums">
                  {currentIndex + 1} / {images.length}
                </div>

                <div className="absolute inset-x-4 bottom-20 sm:bottom-24 z-20 flex justify-between items-center">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => onNavigate(-1)}
                    className="rounded-full h-9 w-9 bg-white/90 hover:bg-white shadow-md pointer-events-auto"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => onNavigate(1)}
                    className="rounded-full h-9 w-9 bg-white/90 hover:bg-white shadow-md pointer-events-auto"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-auto">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => onDotSelect(index)}
                      aria-label={`Go to photo ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {!metadataLoading && images.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            No photos available
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------
   Component
---------------------------------------------- */
const CampusShowcase = () => {
  const [activeTab, setActiveTab] = useState<CampusId>(campuses[0].id)
  const [imagesByCampus, setImagesByCampus] = useState<
    Partial<Record<CampusId, GalleryImage[]>>
  >({})
  const [imageIndex, setImageIndex] = useState<Record<CampusId, number>>({
    kitintale: 0,
    kasokoso: 0,
    maganjo: 0,
  })
  const [metadataLoading, setMetadataLoading] = useState(true)
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set())

  const markImageLoaded = useCallback((key: string) => {
    setLoadedKeys((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }, [])

  useEffect(() => {
    const loadImages = async () => {
      try {
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
        setMetadataLoading(false)
      }
    }

    loadImages()
  }, [])

  const activeImages = imagesByCampus[activeTab] || []
  const activeIndex = imageIndex[activeTab] || 0

  // Preload the next slide in the active campus carousel
  useEffect(() => {
    if (!activeImages.length) return
    const nextIdx = (activeIndex + 1) % activeImages.length
    const next = activeImages[nextIdx]
    if (next?.file_url) {
      const preload = new window.Image()
      preload.src = next.file_url
    }
  }, [activeTab, activeIndex, activeImages])

  const handleNavigate = (campusId: CampusId, direction: number) => {
    const images = imagesByCampus[campusId] || []
    if (!images.length) return

    setImageIndex((prev) => ({
      ...prev,
      [campusId]:
        (prev[campusId] + direction + images.length) % images.length,
    }))
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as CampusId)}
        className="space-y-8 lg:space-y-10"
      >
        <div className="flex justify-center">
          <TabsList className="h-auto bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-green-100 shadow-sm gap-1">
            {campuses.map((campus) => {
              const theme = campusThemes[campus.id]
              const isActive = activeTab === campus.id

              return (
                <TabsTrigger
                  key={campus.id}
                  value={campus.id}
                  className={`rounded-xl px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold transition-all data-[state=active]:shadow-md data-[state=active]:bg-white ${
                    isActive ? theme.text : "text-gray-500"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isActive ? theme.dot : "bg-gray-300"
                      }`}
                    />
                    {campus.shortName}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {campuses.map((campus) => {
          const theme = campusThemes[campus.id]
          const images = imagesByCampus[campus.id] || []
          const idx = imageIndex[campus.id] || 0

          return (
            <TabsContent
              key={campus.id}
              value={campus.id}
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                <CampusImageViewer
                  campusId={campus.id}
                  campusName={campus.name}
                  images={images}
                  currentIndex={idx}
                  theme={theme}
                  metadataLoading={metadataLoading}
                  loadedKeys={loadedKeys}
                  onImageLoaded={markImageLoaded}
                  onNavigate={(dir) => handleNavigate(campus.id, dir)}
                  onDotSelect={(index) =>
                    setImageIndex((prev) => ({ ...prev, [campus.id]: index }))
                  }
                />

                <div className="space-y-7 lg:pl-2">
                  <div className="space-y-4">
                    <Badge
                      variant="outline"
                      className={`${theme.text} ${theme.border} ${theme.bgSoft} px-3 py-1 uppercase text-[10px] sm:text-xs tracking-[0.2em] font-bold border`}
                    >
                      Campus Profile
                    </Badge>

                    <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                      {campus.name}
                    </h3>

                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                      {campus.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur-sm divide-y divide-gray-100 shadow-sm">
                    <InfoRow
                      icon={MapPin}
                      label="Location"
                      value={campus.address}
                      theme={theme}
                    />
                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                      <InfoRow
                        icon={Phone}
                        label="Contact"
                        value={campus.phone}
                        theme={theme}
                        compact
                      />
                      <InfoRow
                        icon={Mail}
                        label="Email"
                        value={campus.email}
                        theme={theme}
                        compact
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {campus.keyFeatures.map((feature, i) => (
                      <div
                        key={i}
                        className={`${theme.bgSoft} p-3 sm:p-4 rounded-xl border ${theme.border} flex flex-col items-center gap-2 text-center transition-shadow hover:shadow-md`}
                      >
                        <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${theme.text}`} />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-700 leading-snug">
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className={`${theme.bg} hover:opacity-90 text-white rounded-xl px-8 h-12 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5`}
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
    </div>
  )
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
  theme,
  compact = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  theme: CampusTheme
  compact?: boolean
}) => (
  <div className={`flex items-start gap-3 sm:gap-4 ${compact ? "p-4" : "p-4 sm:p-5"}`}>
    <div className={`p-2 rounded-lg ring-4 ${theme.ring} bg-white shrink-0`}>
      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${theme.text}`} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
    </div>
  </div>
)

export default CampusShowcase
