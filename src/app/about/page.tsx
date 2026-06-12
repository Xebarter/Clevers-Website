"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Book, Star, Users, Calendar, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { galleryService, GalleryImage } from "../../../lib/supabase/services";
import { cn } from "@/lib/utils";

const defaultImageList = ["/COJS1.jpg", "/kitintale2.jpg", "/COJS2.jpg", "/maganjo3.jpg"];

const DEFAULT_BLUR =
  "data:image/svg+xml;base64," +
  btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="30"><rect width="40" height="30" fill="#fdf2f8"/><circle cx="20" cy="15" r="8" fill="#f9a8d4" opacity="0.5"/></svg>`);

const milestones = [
  {
    year: "2005",
    title: "Kitintale Founded",
    text: "Clevers' Origin Schools began with one classroom and 15 learners in Kitintale, Kampala.",
    border: "border-red-100",
    icon: "text-red-600",
    yearColor: "text-red-600",
    href: "/campus/kitintale",
  },
  {
    year: "2019",
    title: "Kasokoso Campus",
    text: "Our second campus opened in Kireka, extending our mission to a wider community.",
    border: "border-blue-100",
    icon: "text-blue-600",
    yearColor: "text-blue-600",
    href: "/campus/kasokoso",
  },
  {
    year: "2021",
    title: "Maganjo Campus",
    text: "A modern innovation hub launched on Bombo Road with expanded programs.",
    border: "border-emerald-100",
    icon: "text-emerald-600",
    yearColor: "text-emerald-600",
    href: "/campus/maganjo",
  },
];

const values = [
  {
    icon: Heart,
    title: "Compassion",
    color: "text-pink-600 bg-pink-50 border-pink-100",
    text: "We nurture kindness, empathy, and respect in every child.",
  },
  {
    icon: Book,
    title: "Learning",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    text: "We inspire curiosity and a lifelong love for knowledge.",
  },
  {
    icon: Star,
    title: "Excellence",
    color: "text-green-600 bg-green-50 border-green-100",
    text: "We pursue high standards while honouring each child's pace.",
  },
  {
    icon: Users,
    title: "Community",
    color: "text-yellow-700 bg-yellow-50 border-yellow-100",
    text: "We build strong partnerships with families and educators.",
  },
];

export default function AboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  useEffect(() => {
    galleryService
      .getAll()
      .then(setGalleryImages)
      .catch(() => setGalleryImages([]))
      .finally(() => setLoading(false));
  }, []);

  const imagesToDisplay: { file_url: string; alt_text?: string; title?: string; id?: string; blur_url?: string }[] =
    galleryImages.length > 0
      ? galleryImages
      : defaultImageList.map((url) => ({
          file_url: url,
          title: "School life",
          alt_text: "Clevers' Origin Schools",
          id: url,
        }));

  useEffect(() => {
    if (imagesToDisplay.length <= 1) return;
    const interval = setInterval(
      () => setCurrentImageIndex((i) => (i + 1) % imagesToDisplay.length),
      5000
    );
    return () => clearInterval(interval);
  }, [imagesToDisplay.length]);

  useEffect(() => {
    setHeroImageLoaded(false);
  }, [imagesToDisplay]);

  const showHeroSpinner = loading || (imagesToDisplay.length > 0 && !heroImageLoaded);

  const markHeroLoaded = useCallback(() => setHeroImageLoaded(true), []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-br from-pink-50 via-yellow-50/80 to-green-50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-pink-100 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Est. 2005 · Kampala, Uganda</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            Our{" "}
            <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
              Story
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            A journey of nurturing young minds and building a community of joyful learners across three vibrant campuses.
          </p>
        </div>
      </section>

      {/* Hero image strip */}
      <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden bg-gradient-to-br from-green-50 to-white">
        {showHeroSpinner && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/95 via-green-50/95 to-white/95">
            <div className="hero-spinner" role="status" aria-label="Loading images" />
          </div>
        )}
        {!loading &&
          imagesToDisplay.map((img, index) => (
            <div
              key={img.id || index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <Image
                src={img.file_url}
                alt={img.alt_text || img.title || "About Clevers' Origin Schools"}
                fill
                sizes="100vw"
                className={cn("object-cover", index === currentImageIndex && "hero-ken-burns")}
                priority={index <= 1}
                placeholder="blur"
                blurDataURL={img.blur_url || DEFAULT_BLUR}
                onLoad={() => {
                  if (index === 0) markHeroLoaded();
                }}
                onError={() => {
                  if (index === 0) markHeroLoaded();
                }}
              />
            </div>
          ))}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
        {imagesToDisplay.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {imagesToDisplay.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Slide ${index + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === currentImageIndex ? "w-6 bg-white shadow" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Origin */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 mb-3">Our beginnings</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-6">
                Humble roots, lasting impact
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Clevers&apos; Origin Schools was founded in{" "}
                <strong className="text-gray-900">2005</strong> in Kitintale, Kampala, by Mr. Mugwanya Christopher — a
                visionary educator who believed education should be joyful, disciplined, and child-centred.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                What began with one classroom and 15 learners has grown into a trusted institution grounded in care,
                academic rigor, and strong community values.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {["05", "19", "21", "26"].map((label, i) => (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-pink-500 to-green-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {label}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 font-medium">
                        {["2005", "2019", "2021", "Today"][i]}
                      </span>
                    </div>
                    {i < 3 && <div className="h-px w-6 sm:w-10 bg-gradient-to-r from-pink-300 to-green-300 mb-4" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-100 bg-gray-100">
              <Image
                src={imagesToDisplay[currentImageIndex]?.file_url || defaultImageList[0]}
                alt="Clevers' Origin Schools"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Growth journey */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-green-50/50 via-white to-yellow-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 mb-3">Our expansion</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Growth Journey</h2>
            <p className="text-gray-600 mt-3 leading-relaxed">
              Three campuses united by one commitment to nurturing every learner.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {milestones.map((item) => (
              <Link
                key={item.year}
                href={item.href}
                className={cn(
                  "group rounded-2xl border p-6 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                  item.border
                )}
              >
                <Calendar className={cn("h-8 w-8 mb-4", item.icon)} />
                <p className={cn("text-2xl font-bold mb-1", item.yearColor)}>{item.year}</p>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.text}</p>
                <span className="inline-flex items-center text-sm font-semibold text-gray-700 group-hover:gap-2 transition-all">
                  Visit campus <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 mb-3">What we stand for</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((v) => (
              <article
                key={v.title}
                className={cn("rounded-2xl border p-6 text-center transition-shadow hover:shadow-md", v.color)}
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/80 flex items-center justify-center mb-4 shadow-sm">
                  <v.icon className={cn("h-6 w-6", v.color.split(" ")[0])} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-pink-100/60 via-yellow-50 to-green-100/60">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl">
          <MapPin className="h-8 w-8 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn More About Us</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Discover our mission, vision, and the leadership shaping the future of Clevers&apos; Origin Schools.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/about/mission">
              <Button size="lg" className="rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg">
                Mission & Vision <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/campus">
              <Button size="lg" variant="outline" className="rounded-lg border-gray-200">
                Our Campuses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
