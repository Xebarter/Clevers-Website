import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  galleryImages: {url: string; alt: string; placeholder?: string;}[];
};

interface CampusLayoutProps {
  campusInfo: CampusInfo;
}

const CampusLayout: React.FC<CampusLayoutProps> = ({ campusInfo }) => {
  // Helper function to get color classes based on accent color
  const getColorClasses = (type: string, opacity?: string) => {
    const opacityValue = opacity || '';

    switch (type) {
      case 'bg':
        return {
          [`bg-kinder-red${opacityValue}`]: campusInfo.accentColor === 'kinder-red',
          [`bg-kinder-blue${opacityValue}`]: campusInfo.accentColor === 'kinder-blue',
          [`bg-kinder-green${opacityValue}`]: campusInfo.accentColor === 'kinder-green',
          [`bg-kinder-purple${opacityValue}`]: campusInfo.accentColor === 'kinder-purple',
          [`bg-kinder-yellow${opacityValue}`]: campusInfo.accentColor === 'kinder-yellow',
          [`bg-kinder-orange${opacityValue}`]: campusInfo.accentColor === 'kinder-orange',
          [`bg-kinder-pink${opacityValue}`]: campusInfo.accentColor === 'kinder-pink',
        };
      case 'text':
        return {
          "text-kinder-red": campusInfo.accentColor === 'kinder-red',
          "text-kinder-blue": campusInfo.accentColor === 'kinder-blue',
          "text-kinder-green": campusInfo.accentColor === 'kinder-green',
          "text-kinder-purple": campusInfo.accentColor === 'kinder-purple',
          "text-kinder-yellow": campusInfo.accentColor === 'kinder-yellow',
          "text-kinder-orange": campusInfo.accentColor === 'kinder-orange',
          "text-kinder-pink": campusInfo.accentColor === 'kinder-pink',
        };
      case 'border':
        return {
          [`border-kinder-red${opacityValue}`]: campusInfo.accentColor === 'kinder-red',
          [`border-kinder-blue${opacityValue}`]: campusInfo.accentColor === 'kinder-blue',
          [`border-kinder-green${opacityValue}`]: campusInfo.accentColor === 'kinder-green',
          [`border-kinder-purple${opacityValue}`]: campusInfo.accentColor === 'kinder-purple',
          [`border-kinder-yellow${opacityValue}`]: campusInfo.accentColor === 'kinder-yellow',
          [`border-kinder-orange${opacityValue}`]: campusInfo.accentColor === 'kinder-orange',
          [`border-kinder-pink${opacityValue}`]: campusInfo.accentColor === 'kinder-pink',
        };
      case 'from':
        return {
          "from-kinder-red/20": campusInfo.accentColor === 'kinder-red',
          "from-kinder-blue/20": campusInfo.accentColor === 'kinder-blue',
          "from-kinder-green/20": campusInfo.accentColor === 'kinder-green',
          "from-kinder-purple/20": campusInfo.accentColor === 'kinder-purple',
          "from-kinder-yellow/20": campusInfo.accentColor === 'kinder-yellow',
          "from-kinder-orange/20": campusInfo.accentColor === 'kinder-orange',
          "from-kinder-pink/20": campusInfo.accentColor === 'kinder-pink',
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={cn("py-12 md:py-16 bg-gradient-to-b to-white", getColorClasses('from'))}>
        <div className="container mx-auto px-4">
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
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", getColorClasses('bg', '/10'))}>
                    <CalendarDays className={cn("h-5 w-5", getColorClasses('text'))} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-body">Established</div>
                    <div className="font-semibold font-body">{campusInfo.established}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", getColorClasses('bg', '/10'))}>
                    <Users className={cn("h-5 w-5", getColorClasses('text'))} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-body">Students</div>
                    <div className="font-semibold font-body">{campusInfo.students}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/apply">
                  <Button className={cn("gap-2 kinder-button", getColorClasses('bg'), {
                    "border-b-4 border-red-600 hover:bg-kinder-red/90": campusInfo.accentColor === 'kinder-red',
                    "border-b-4 border-blue-600 hover:bg-kinder-blue/90": campusInfo.accentColor === 'kinder-blue',
                    "border-b-4 border-green-600 hover:bg-kinder-green/90": campusInfo.accentColor === 'kinder-green',
                    "border-b-4 border-purple-600 hover:bg-kinder-purple/90": campusInfo.accentColor === 'kinder-purple',
                    "border-b-4 border-yellow-600 hover:bg-kinder-yellow/90": campusInfo.accentColor === 'kinder-yellow',
                    "border-b-4 border-orange-600 hover:bg-kinder-orange/90": campusInfo.accentColor === 'kinder-orange',
                    "border-b-4 border-pink-600 hover:bg-kinder-pink/90": campusInfo.accentColor === 'kinder-pink',
                  })}>
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2 border-2">
                  Schedule a Visit
                </Button>
              </div>
            </div>
            <div className={cn("p-6 rounded-3xl shadow-md",
                             getColorClasses('bg', '/10'),
                             getColorClasses('border', '/30'))}>
              <div className="aspect-video relative rounded-2xl overflow-hidden border-4 border-white shadow-md">
                {/* Campus Image Placeholder - replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🏫</div>
                    <p className="text-gray-600 font-heading">{campusInfo.name} Campus</p>
                  </div>
                </div>
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
              <div className={cn("w-32 h-32 rounded-full flex-shrink-0 flex items-center justify-center",
                               getColorClasses('bg', '/10'),
                               getColorClasses('border'))}>
                {/* Principal Profile Image Placeholder - replace with actual image */}
                <div className="text-4xl">{campusInfo.headshot}</div>
              </div>
              <div>
                <h2 className={cn("text-2xl md:text-3xl font-bold mb-2 font-heading", getColorClasses('text'))}>
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
      <section className={cn("py-12 md:py-16", getColorClasses('bg', '/5'))}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            What Makes Us Special
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campusInfo.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl shadow-md">
                <div className="flex gap-4 items-start mb-4">
                  <div className={cn("w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center",
                                   getColorClasses('bg', '/10'))}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className={cn("text-xl font-bold mb-2 font-heading", getColorClasses('text'))}>{feature.title}</h3>
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
            <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-kinder-blue/30">
              <h2 className="text-2xl font-bold mb-6 font-heading text-kinder-blue">Our Facilities</h2>
              <ul className="space-y-3">
                {campusInfo.facilities.map((facility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 text-kinder-blue">
                      <div className="w-2 h-2 rounded-full bg-kinder-blue"></div>
                    </div>
                    <p className="text-gray-700 font-body">{facility}</p>
                  </li>
                ))}
              </ul>
            </div>

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
                <div className="aspect-video relative">
                  {/* Image placeholder - replace with actual images */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{image.placeholder || '📸'}</div>
                      <p className="text-gray-600 font-body text-sm">{image.alt}</p>
                    </div>
                  </div>
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
            <div className={cn("p-6 rounded-3xl", getColorClasses('bg', '/5'))}>
              <div className="flex flex-col space-y-6">
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                                   getColorClasses('bg', '/20'))}>
                    <MapPin className={cn("h-5 w-5", getColorClasses('text'))} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">Address</h3>
                    <p className="text-gray-700 font-body">{campusInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                                   getColorClasses('bg', '/20'))}>
                    <Phone className={cn("h-5 w-5", getColorClasses('text'))} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">Phone</h3>
                    <p className="text-gray-700 font-body">{campusInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                                   getColorClasses('bg', '/20'))}>
                    <Mail className={cn("h-5 w-5", getColorClasses('text'))} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">Email</h3>
                    <p className="text-gray-700 font-body">{campusInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                                   getColorClasses('bg', '/20'))}>
                    <Clock className={cn("h-5 w-5", getColorClasses('text'))} />
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
      <section className={cn("py-12 md:py-16 bg-gradient-to-r to-white", getColorClasses('from'))}>
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
