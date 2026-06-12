import type { Metadata } from "next";
import CampusLayout, { CampusInfo } from "@/components/CampusLayout";
import { Activity, Cpu, Trophy, Leaf, BookOpen } from "lucide-react";
import { CampusImageCarousel } from "../ImageCarousel";
import { galleryService } from "../../../../lib/supabase/services";

export const metadata: Metadata = {
  title: "Maganjo Campus | Clevers' Origin Schools",
  description:
    "Explore Maganjo Campus — our innovation hub with modern facilities, sports, technology, and environmental education on Bombo Road.",
};

async function getMaganjoGalleryImages() {
  try {
    const images = await galleryService.getByCategory("Maganjo");
    return images.map((image) => ({
      url: image.file_url,
      alt: image.alt_text || image.title || "Maganjo Campus",
    }));
  } catch {
    return [];
  }
}

export default async function MaganjoCampusPage() {
  const galleryImages = await getMaganjoGalleryImages();

  const campusInfo: CampusInfo = {
    slug: "maganjo",
    name: "Maganjo",
    description:
      "Our newest innovation hub, committed to academic excellence and nurturing specialized learner talents from nursery through high school.",
    established: "2021",
    students: "650+",
    headshot: "🧑‍🏫",
    principal: "Mr. Nsubuga Ronald",
    principalTitle: "Campus Headteacher",
    principalMessage:
      "At Maganjo Campus, we develop well-rounded children through physical activity, technological literacy, and environmental stewardship — the foundation for 21st-century learning.",
    address: "Maganjo, Bombo Road",
    phone: "+256 753 252 716",
    email: "cleversorigin@gmail.com",
    hours: "Monday – Friday: 7:30 AM – 4:30 PM",
    features: [
      {
        title: "Sports Excellence",
        description: "Coordination, teamwork, and healthy habits through age-appropriate sports.",
        icon: <Trophy className="h-6 w-6 text-emerald-600" />,
      },
      {
        title: "Tech for Tots",
        description: "Digital literacy through interactive, screen-limited activities.",
        icon: <Cpu className="h-6 w-6 text-emerald-600" />,
      },
      {
        title: "Eco-Explorers",
        description: "Sustainability, conservation, and respect for nature.",
        icon: <Leaf className="h-6 w-6 text-emerald-600" />,
      },
      {
        title: "Active Learning",
        description: "Movement-integrated teaching for enhanced retention.",
        icon: <Activity className="h-6 w-6 text-emerald-600" />,
      },
      {
        title: "STEM Foundations",
        description: "Science and math through playful, hands-on projects.",
        icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
      },
    ],
    facilities: [
      "Modern air-conditioned classrooms with flexible seating",
      "Mini sports field with age-appropriate equipment",
      "Indoor gymnasium for all-weather activities",
      "Technology lab with child-friendly devices",
      "Nature center with gardening plots",
      "Science discovery room with interactive exhibits",
      "Eco-friendly cafeteria with healthy meals",
      "Multipurpose hall for assemblies and events",
    ],
    extracurriculars: [
      "Mini Athletics — running, jumping, and throwing",
      "Team Sports — football, netball, and cricket",
      "Coding Cubs — programming through unplugged activities",
      "Nature Explorers — outdoor education trips",
      "Little Scientists — hands-on experiments",
      "Eco Warriors — conservation projects",
      "Robotics Basics — simple machines and movement",
    ],
    galleryImages,
    imagePlaceholder: <CampusImageCarousel category="Maganjo" className="absolute inset-0" />,
  };

  return <CampusLayout campusInfo={campusInfo} />;
}
