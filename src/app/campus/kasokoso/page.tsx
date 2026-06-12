import type { Metadata } from "next";
import CampusLayout, { CampusInfo } from "@/components/CampusLayout";
import { Music, Heart, BookOpen, Globe, Users } from "lucide-react";
import { CampusImageCarousel } from "../ImageCarousel";
import { galleryService } from "../../../../lib/supabase/services";

export const metadata: Metadata = {
  title: "Kasokoso Campus | Clevers' Origin Schools",
  description:
    "Discover Kasokoso Campus — academic rigor, vibrant arts programs, and an exclusive day-school environment in Kireka.",
};

async function getKasokosoGalleryImages() {
  try {
    const images = await galleryService.getByCategory("Kasokoso");
    return images.map((image) => ({
      url: image.file_url,
      alt: image.alt_text || image.title || "Kasokoso Campus",
    }));
  } catch {
    return [];
  }
}

export default async function KasokosoCampusPage() {
  const galleryImages = await getKasokosoGalleryImages();

  const campusInfo: CampusInfo = {
    slug: "kasokoso",
    name: "Kasokoso",
    description:
      "A distinguished urban institution known for academic rigor and an exclusive day-school environment in the heart of Kireka.",
    established: "2019",
    students: "800+",
    headshot: "👩‍🏫",
    principal: "Sekitoleko Wilberforce",
    principalTitle: "Campus Headteacher",
    principalMessage:
      "We believe every child is born with unique talents. At Kasokoso Campus, we nurture these gifts through music, arts, and play-based learning in a colourful, inclusive environment.",
    address: "Kasokoso, Kireka",
    phone: "+256 750 054 361",
    email: "cleversorigin@gmail.com",
    hours: "Monday – Friday: 7:30 AM – 4:30 PM",
    features: [
      {
        title: "Music Excellence",
        description: "Vocal training, instruments, and performance opportunities.",
        icon: <Music className="h-6 w-6 text-blue-600" />,
      },
      {
        title: "Cultural Diversity",
        description: "Traditional songs, dances, and customs from around the world.",
        icon: <Globe className="h-6 w-6 text-blue-600" />,
      },
      {
        title: "Emotional Intelligence",
        description: "Helping children recognise and express emotions healthily.",
        icon: <Heart className="h-6 w-6 text-blue-600" />,
      },
      {
        title: "Literacy Through Arts",
        description: "Storytelling combined with artistic expression.",
        icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      },
      {
        title: "Inclusive Learning",
        description: "Support for every learning style and ability.",
        icon: <Users className="h-6 w-6 text-blue-600" />,
      },
    ],
    facilities: [
      "Well-equipped classrooms with flexible learning spaces",
      "Music room with drums, xylophones, and recorders",
      "Art studio with child-sized easels and supplies",
      "Outdoor playground with sensory play areas",
      "Mini-amphitheater for performances",
      "Reading garden with comfortable seating",
      "Dining hall serving nutritious meals",
      "Library with books in multiple languages",
    ],
    extracurriculars: [
      "Children's Choir — vocal skills and harmony",
      "Traditional Dance — Ugandan cultural forms",
      "Drumming Circle — rhythm and coordination",
      "Young Artists Club — exploring art mediums",
      "Storytelling and Drama — building confidence",
      "Mini-Olympics — friendly physical competitions",
      "Cultural Exchange Days — global traditions",
    ],
    galleryImages,
    imagePlaceholder: <CampusImageCarousel category="Kasokoso" className="absolute inset-0" />,
  };

  return <CampusLayout campusInfo={campusInfo} />;
}
