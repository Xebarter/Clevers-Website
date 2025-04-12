// src/app/academics/page.tsx
import type { Metadata } from "next";
import AcademicsContent from "./AcademicsContent"; // Import the new Client Component

export const metadata: Metadata = {
  title: "Academics | Clevers' Origin Schools",
  description:
    "Learn about our curriculum, teaching philosophy, and academic programs at Clevers' Origin Schools.",
};

export default function AcademicsPage() {
  return <AcademicsContent />;
}