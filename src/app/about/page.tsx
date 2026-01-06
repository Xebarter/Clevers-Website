"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  Book,
  Star,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react"
import {
  galleryService,
  type GalleryImage,
} from "../../../lib/supabase/services"

const fallbackImages = [
  "/COJS1.jpg",
  "/kitintale2.jpg",
  "/COJS2.jpg",
  "/maganjo3.jpg",
]

export default function AboutPage() {
  const [images, setImages] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  /* ---------------------------------------------
     Load Gallery Images
  ---------------------------------------------- */
  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await galleryService.getAll()
        const urls = data.map((img) => img.file_url)
        setImages(urls.length ? urls : fallbackImages)
      } catch {
        setImages(fallbackImages)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  /* ---------------------------------------------
     Auto Rotate Images (calm, professional pace)
  ---------------------------------------------- */
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [images])

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO ================= */}
      <section className="py-16 bg-gradient-to-b from-kinder-yellow/20 to-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold heading-gradient mb-4">
            Our Story
          </h1>
          <p className="text-lg text-gray-700 font-body">
            A journey of nurturing young minds, strong values, and a lifelong
            love for learning.
          </p>
        </div>
      </section>

      {/* ================= ORIGIN ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-kinder-blue mb-6">
              Our Humble Beginnings
            </h2>

            <p className="text-gray-700 font-body mb-4 leading-relaxed">
              Clevers’ Origin Schools was founded in{" "}
              <span className="font-semibold text-kinder-blue">2005</span> in
              Kitintale, Kampala, by Mr. Mugwanya Christopher—a visionary
              educator who believed that education should be joyful,
              disciplined, and child-centered.
            </p>

            <p className="text-gray-700 font-body mb-6 leading-relaxed">
              What began with one classroom and 15 learners has grown into a
              trusted institution grounded in care, academic rigor, and strong
              community values.
            </p>

            {/* Timeline */}
            <div className="flex items-center gap-3 flex-wrap">
              {["2005", "2019", "2021", "2026"].map((year, i) => (
                <React.Fragment key={year}>
                  <div className="h-9 w-9 rounded-full bg-kinder-blue text-white flex items-center justify-center font-heading font-bold shadow-sm">
                    {year.slice(2)}
                  </div>
                  {i < 3 && (
                    <div className="h-1 w-10 bg-gradient-to-r from-kinder-blue to-kinder-green" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative rounded-3xl border border-kinder-pink/30 shadow-lg overflow-hidden aspect-video bg-gray-100">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-kinder-blue border-t-transparent animate-spin" />
              </div>
            ) : (
              <Image
                key={images[index]}
                src={images[index]}
                alt="Clevers' Origin Schools"
                fill
                className="object-cover transition-opacity duration-700"
                priority
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= GROWTH ================= */}
      <section className="py-16 bg-gradient-to-r from-kinder-green/10 to-kinder-blue/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center text-kinder-blue mb-12">
            Our Growth Journey
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: "2005",
                color: "text-kinder-blue",
                text:
                  "Kitintale Campus was established, laying the foundation for our educational philosophy.",
              },
              {
                year: "2019",
                color: "text-kinder-red",
                text:
                  "Kasokoso Campus opened, extending our mission to a wider community.",
              },
              {
                year: "2021",
                color: "text-kinder-purple",
                text:
                  "Maganjo Campus launched with a focus on innovation and modern learning spaces.",
              },
            ].map((item) => (
              <Card
                key={item.year}
                className="border-none shadow-md bg-white"
              >
                <CardContent className="pt-6 text-center">
                  <Calendar className={`h-10 w-10 mx-auto ${item.color}`} />
                  <h3 className={`text-xl font-heading font-bold mt-4 ${item.color}`}>
                    {item.year}
                  </h3>
                  <p className="text-gray-700 font-body mt-3">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center text-kinder-blue mb-12">
            Our Core Values
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Compassion",
                color: "text-kinder-red",
                text:
                  "We nurture kindness, empathy, and respect in every child.",
              },
              {
                icon: Book,
                title: "Learning",
                color: "text-kinder-blue",
                text:
                  "We inspire curiosity and a lifelong love for knowledge.",
              },
              {
                icon: Star,
                title: "Excellence",
                color: "text-kinder-green",
                text:
                  "We pursue high standards while honoring each child’s pace.",
              },
              {
                icon: Users,
                title: "Community",
                color: "text-kinder-purple",
                text:
                  "We build strong partnerships with families and educators.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white p-6 rounded-3xl shadow-md border text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <v.icon className={`h-7 w-7 ${v.color}`} />
                </div>
                <h3 className={`text-xl font-heading font-bold mb-2 ${v.color}`}>
                  {v.title}
                </h3>
                <p className="text-gray-700 font-body">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 bg-gradient-to-r from-kinder-yellow/20 via-kinder-pink/20 to-kinder-blue/20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-heading font-bold text-kinder-blue mb-4">
            Learn More About Us
          </h2>
          <p className="text-gray-700 font-body mb-8">
            Discover our mission, vision, and leadership team shaping the future
            of Clevers’ Origin Schools.
          </p>

          <Link href="/about/mission">
            <Button className="kinder-button bg-kinder-green hover:bg-kinder-green/90">
              Our Mission & Vision
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
