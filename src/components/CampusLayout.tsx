// src/components/CampusLayout.tsx

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  BookOpen,
  Music,
  Palette,
  ArrowRight,
  CalendarDays,
  Home
} from "lucide-react";
import Image from "next/image";

export type CampusInfo = {
  name: string;
  description: string;
  established: string;
  students: string;
  headshot: string; // URL or emoji for profile picture
  principal: string;
  principalTitle: string;
  principalMessage: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  accentColor: 'kinder-red' | 'kinder-blue' | 'kinder-green' | 'kinder-purple' | 'kinder-yellow' | 'kinder-orange' | 'kinder-pink';
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  facilities: string[];
  extracurriculars: string[];
  galleryImages: { url: string; alt: string; placeholder?: string; }[];
  imagePlaceholder?: React.ReactNode; // Add this line
};

interface CampusLayoutProps {
  campusInfo: CampusInfo;
}

// Helper to create some random positions and rotations for decorative images
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(arr: T[], count: number) {
  const copy = arr.slice();
  const picked: T[] = [];
  while (picked.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
}

const CampusLayout: React.FC<CampusLayoutProps> = ({ campusInfo }) => {
  return (
    <div className="min-h-screen relative">
      {/* Decorative scattered images covering the whole page (non-interactive) */}
      {campusInfo.galleryImages && campusInfo.galleryImages.length > 0 && (
        <div className="pointer-events-none absolute inset-0 -z-20">
          {pickRandom(campusInfo.galleryImages, Math.min(12, campusInfo.galleryImages.length)).map((img, i) => {
            const top = rand(-5, 92);
            const left = rand(-5, 95);
            const rotate = rand(-25, 25);
            const scale = rand(0.55, 1.15);
            const opacity = rand(0.12, 0.45).toFixed(2);
            const size = Math.floor(rand(70, 260));
            return (
              <img
                key={`decor-${i}-${img.url}`}
                src={img.url}
                alt={img.alt || `${campusInfo.name} decorative`}
                className={`absolute rounded-xl shadow-lg object-cover transition-transform duration-700`}
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${Math.floor(size * (3 / 4))}px`,
                  transform: `rotate(${rotate}deg) scale(${scale})`,
                  opacity: Number(opacity),
                  filter: 'saturate(0.9) contrast(0.95) blur(0px)'
                }}
              />
            );
          })}
        </div>
      )}

      {/* Hero Section */}
      <section className={`overflow-hidden py-12 md:py-16 bg-gradient-to-b from-${campusInfo.accentColor}/20 to-white`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center mb-4">
            <Link href="/campus" className="flex items-center text-gray-600 hover:text-gray-900">
              <Home className="h-4 w-4 mr-2" />
              <span className="text-sm">All Campuses</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading heading-gradient">
                {campusInfo.name} Campus
              </h1>
              <p className="text-lg text-gray-700 mb-6 font-body">
                {campusInfo.description}
              </p>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full bg-${campusInfo.accentColor}/10 flex items-center justify-center`}>
                    <CalendarDays className={`h-5 w-5 text-${campusInfo.accentColor}`} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-body">Established</div>
                    <div className="font-semibold font-body">{campusInfo.established}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full bg-${campusInfo.accentColor}/10 flex items-center justify-center`}>
                    <Users className={`h-5 w-5 text-${campusInfo.accentColor}`} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-body">Students</div>
                    <div className="font-semibold font-body">{campusInfo.students}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/apply">
                  <Button className={`gap-2 bg-${campusInfo.accentColor} border-b-4 border-${campusInfo.accentColor === 'kinder-red' ? 'red' :
                    campusInfo.accentColor === 'kinder-blue' ? 'blue' :
                      campusInfo.accentColor === 'kinder-green' ? 'green' :
                        campusInfo.accentColor === 'kinder-purple' ? 'purple' :
                          campusInfo.accentColor === 'kinder-yellow' ? 'yellow' :
                            campusInfo.accentColor === 'kinder-orange' ? 'orange' : 'pink'}-600
                      hover:bg-${campusInfo.accentColor}/90 kinder-button`}>
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className={`bg-${campusInfo.accentColor}/10 p-6 rounded-3xl border-2 border-${campusInfo.accentColor}/30 shadow-md`}>
              <div className="aspect-video relative rounded-2xl overflow-hidden border-4 border-white shadow-md">
                {/* Campus Image Placeholder - replace with actual image */}
                {campusInfo.imagePlaceholder ? (
                  campusInfo.imagePlaceholder
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🏫</div>
                      <p className="text-gray-600 font-heading">{campusInfo.name} Campus</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal Message Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className={`w-32 h-32 rounded-full bg-${campusInfo.accentColor}/10 border-4 border-${campusInfo.accentColor} flex-shrink-0 flex items-center justify-center`}>
                {/* Principal Profile Image Placeholder - replace with actual image */}
                <div className="text-4xl">{campusInfo.headshot}</div>
              </div>
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 font-heading text-${campusInfo.accentColor}`}>
                  Message from Our Principal
                </h2>
                <p className="text-gray-600 mb-4 font-body">{campusInfo.principal}, {campusInfo.principalTitle}</p>
                <p className="text-gray-700 font-body italic">
                  "{campusInfo.principalMessage}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Features */}
      <section className={`py-12 md:py-16 bg-${campusInfo.accentColor}/5`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            What Makes Us Special
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campusInfo.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl shadow-md">
                <div className="flex gap-4 items-start mb-4">
                  <div className={`w-12 h-12 rounded-full bg-${campusInfo.accentColor}/10 flex-shrink-0 flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 font-heading text-${campusInfo.accentColor}`}>{feature.title}</h3>
                    <p className="text-gray-700 font-body">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Programs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-kinder-green/30">
              <h2 className="text-2xl font-bold mb-6 font-heading text-kinder-green">Extracurricular Activities</h2>
              <ul className="space-y-3">
                {campusInfo.extracurriculars.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 text-kinder-green">
                      <div className="w-2 h-2 rounded-full bg-kinder-green"></div>
                    </div>
                    <p className="text-gray-700 font-body">{activity}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center font-heading text-kinder-blue">
            Campus Gallery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusInfo.galleryImages.map((image, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="aspect-video relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
                  <Image
                    src={image.url}
                    alt={image.alt || `${campusInfo.name} gallery`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-gray-600 font-body text-sm truncate">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/gallery">
              <Button variant="outline" className="gap-2 border-2">
                View More Photos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`bg-${campusInfo.accentColor}/5 p-6 rounded-3xl`}>
              <div className="flex flex-col space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-${campusInfo.accentColor}/20 flex-shrink-0 flex items-center justify-center`}>
                    <MapPin className={`h-5 w-5 text-${campusInfo.accentColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">Address</h3>
                    <p className="text-gray-700 font-body">{campusInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-${campusInfo.accentColor}/20 flex-shrink-0 flex items-center justify-center`}>
                    <Phone className={`h-5 w-5 text-${campusInfo.accentColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">Phone</h3>
                    <p className="text-gray-700 font-body">{campusInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-${campusInfo.accentColor}/20 flex-shrink-0 flex items-center justify-center`}>
                    <Mail className={`h-5 w-5 text-${campusInfo.accentColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">Email</h3>
                    <p className="text-gray-700 font-body">{campusInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-${campusInfo.accentColor}/20 flex-shrink-0 flex items-center justify-center`}>
                    <Clock className={`h-5 w-5 text-${campusInfo.accentColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">School Hours</h3>
                    <p className="text-gray-700 font-body">{campusInfo.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-4 font-heading text-kinder-blue">Get in Touch</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-body">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="kinder-input w-full"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-body">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="kinder-input w-full"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1 font-body">Message</label>
                  <textarea
                    id="message"
                    className="kinder-input w-full h-32"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button className="w-full kinder-button">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-12 md:py-16 bg-gradient-to-r from-${campusInfo.accentColor}/20 to-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">
            Join Our {campusInfo.name} Campus Family
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-body">
            We invite you to become part of our vibrant community where your child will grow, learn, and thrive.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button className="gap-2 kinder-button">
                Apply for Admission
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="gap-2 border-2">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampusLayout;