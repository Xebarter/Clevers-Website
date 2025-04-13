// src/app/sports/page.tsx
import type { Metadata } from "next";
import SportsPage from "./sports-client"; // Adjust the path if needed

export const metadata: Metadata = {
  title: "Sports Program | Clevers' Origin Schools",
  description:
    "Explore our kindergarten sports program designed to develop motor skills, teamwork, and a lifelong love of physical activity through fun, age-appropriate activities.",
};

export default function Page() {
  return <SportsPage />;
}