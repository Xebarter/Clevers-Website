import type { Metadata } from "next";
import CampusLayout, { CampusInfo } from "@/components/CampusLayout";
import { Award, BookOpen, Music, Palette, Users } from "lucide-react";
import { CampusImageCarousel } from "../ImageCarousel";
import { galleryService } from "../../../../lib/supabase/services";

export const metadata: Metadata = {
  title: "Kitintale Campus | Clevers' Origin Schools",
  description:
    "Explore our flagship Kitintale Campus — state-of-the-art facilities, performing arts, and nurturing education since 2005.",
};

async function getKitintaleGalleryImages() {
  try {
    const images = await galleryService.getByCategory("Kitintale");
    return images.map((image) => ({
      url: image.file_url,
      alt: image.alt_text || image.title || "Kitintale Campus",
    }));
  } catch {
    return [];
  }
}

export default async function KitintaleCampusPage() {
  const galleryImages = await getKitintaleGalleryImages();

  const campusInfo: CampusInfo = {
    slug: "kitintale",
    name: "Kitintale",
    description:
      "Our flagship campus featuring state-of-the-art facilities, a vibrant kindergarten play zone, and a dedicated performing arts center.",
    established: "2005",
    students: "1,500+",
    headshot: "👨‍🏫",
    principal: "Kajiri Elijah",
    principalTitle: "Campus Headteacher",
    principalMessage:
      "At Kitintale Campus, we create an environment where children feel safe to explore, question, and learn. Our approach combines academic excellence with joy and creativity.",
    address: "Kitintale, Along Kitintale–Kunya Road",
    phone: "+256 772 470 972",
    email: "cleversorigin@gmail.com",
    hours: "Monday – Friday: 7:30 AM – 4:30 PM",
    features: [
      {
        title: "Creative Arts Program",
        description: "Award-winning arts through painting, drama, music, and dance.",
        icon: <Palette className="h-6 w-6 text-red-600" />,
      },
      {
        title: "Community Garden",
        description: "Hands-on learning about nature, sustainability, and responsibility.",
        icon: <BookOpen className="h-6 w-6 text-red-600" />,
      },
      {
        title: "Leadership Development",
        description: "Collaborative projects and child-led initiatives build confidence.",
        icon: <Award className="h-6 w-6 text-red-600" />,
      },
      {
        title: "Music & Drama",
        description: "English and local languages through songs, stories, and performance.",
        icon: <Music className="h-6 w-6 text-red-600" />,
      },
      {
        title: "Personalised Learning",
        description: "Small class sizes ensure every learner receives individual attention.",
        icon: <Users className="h-6 w-6 text-red-600" />,
      },
    ],
    facilities: [
      "Spacious classrooms with modern learning resources",
      "Outdoor playground with climbing frames and play zones",
      "Indoor activity hall for music, dance, and performances",
      "Library with age-appropriate books in multiple languages",
      "Dedicated art studio with child-friendly supplies",
      "Computer corner with educational programs",
      "Dining area serving nutritious meals",
      "Garden area for growing vegetables and flowers",
    ],
    extracurriculars: [
      "Music and Movement — introduction to instruments and dance",
      "Mini-Sports — gross motor skills through games",
      "Storytelling Club — language and imagination",
      "Little Gardeners — planting and nurturing plants",
      "Drama Club — confidence through performance",
      "Cultural Days — celebrating diverse traditions",
      "Parent-Child Workshops — families join classroom activities",
    ],
    galleryImages,
    imagePlaceholder: <CampusImageCarousel category="Kitintale" className="absolute inset-0" />,
  };

  return <CampusLayout campusInfo={campusInfo} />;
}
