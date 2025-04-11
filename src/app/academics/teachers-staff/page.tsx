import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Twitter, Linkedin, Mail, Phone, Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Teachers & Staff | Clevers' Origin Schools",
  description: "Meet our dedicated teachers, leadership team, and administrative staff at Clevers' Origin Schools.",
};

export default function TeachersStaffPage() {
  const leadershipTeam = [
    {
      id: 1,
      name: "Dr. James Mukasa",
      role: "Principal",
      imageUrl: "/placeholder-person.jpg",
      bio: "Dr. Mukasa brings over 25 years of experience in education leadership. He holds a PhD in Educational Administration and is passionate about fostering a positive school culture that nurtures excellence.",
      email: "james.mukasa@cleversorigin.edu",
      phone: "+256 750 123000",
    },
    {
      id: 2,
      name: "Mrs. Sarah Nakato",
      role: "Deputy Principal, Academics",
      imageUrl: "/placeholder-person.jpg",
      bio: "Mrs. Nakato oversees the academic programs across all campuses. With her Master's in Curriculum Development, she ensures that our educational offerings meet the highest standards while remaining innovative.",
      email: "sarah.nakato@cleversorigin.edu",
      phone: "+256 750 123001",
    },
    {
      id: 3,
      name: "Mr. Paul Kigongo",
      role: "Deputy Principal, Administration",
      imageUrl: "/placeholder-person.jpg",
      bio: "Mr. Kigongo manages the school's administrative operations and facilities. He is dedicated to creating a safe and supportive environment where students can thrive.",
      email: "paul.kigongo@cleversorigin.edu",
      phone: "+256 750 123002",
    }
  ];

  const departmentHeads = [
    {
      id: 1,
      name: "Ms. Jane Akello",
      role: "Head of Sciences",
      imageUrl: "/placeholder-person.jpg",
      qualifications: "MSc. Chemistry, BSc. Education",
      bio: "Leading our science department with a focus on practical, inquiry-based learning approaches.",
    },
    {
      id: 2,
      name: "Mr. Richard Ochen",
      role: "Head of Mathematics",
      imageUrl: "/placeholder-person.jpg",
      qualifications: "MSc. Applied Mathematics, BSc. Education",
      bio: "Passionate about making mathematics accessible and engaging for all students.",
    },
    {
      id: 3,
      name: "Mrs. Grace Namugwanya",
      role: "Head of Languages",
      imageUrl: "/placeholder-person.jpg",
      qualifications: "MA English Literature, BA Education",
      bio: "Dedicated to fostering strong communication skills and a love for literature among students.",
    },
    {
      id: 4,
      name: "Mr. Daniel Mugisha",
      role: "Head of Humanities",
      imageUrl: "/placeholder-person.jpg",
      qualifications: "MA History, BA Education",
      bio: "Committed to helping students understand our world through historical and cultural contexts.",
    },
    {
      id: 5,
      name: "Ms. Esther Nakabuye",
      role: "Head of Arts & Music",
      imageUrl: "/placeholder-person.jpg",
      qualifications: "BFA, Diploma in Music Education",
      bio: "Nurturing creative expression and artistic talents through our vibrant arts program.",
    },
    {
      id: 6,
      name: "Mr. Joseph Ssemanda",
      role: "Head of Physical Education",
      imageUrl: "/placeholder-person.jpg",
      qualifications: "BSc. Sports Science, Certified Athletic Trainer",
      bio: "Promoting physical fitness, teamwork, and healthy competition through sports and physical activities.",
    }
  ];

  const teachingStaff = [
    { id: 1, name: "Christine Nantongo", role: "Biology Teacher", campus: "Kitintale", imageUrl: "/placeholder-person.jpg" },
    { id: 2, name: "Mark Okello", role: "Physics Teacher", campus: "Kitintale", imageUrl: "/placeholder-person.jpg" },
    { id: 3, name: "Phiona Namukasa", role: "Mathematics Teacher", campus: "Kitintale", imageUrl: "/placeholder-person.jpg" },
    { id: 4, name: "Bernard Kyagulanyi", role: "English Teacher", campus: "Kasokoso", imageUrl: "/placeholder-person.jpg" },
    { id: 5, name: "Rebecca Nalwanga", role: "Chemistry Teacher", campus: "Kasokoso", imageUrl: "/placeholder-person.jpg" },
    { id: 6, name: "Patrick Mugabi", role: "History Teacher", campus: "Kasokoso", imageUrl: "/placeholder-person.jpg" },
    { id: 7, name: "Alice Amanya", role: "Geography Teacher", campus: "Maganjo", imageUrl: "/placeholder-person.jpg" },
    { id: 8, name: "Simon Lutaaya", role: "Computer Studies Teacher", campus: "Maganjo", imageUrl: "/placeholder-person.jpg" },
    { id: 9, name: "Juliet Nakimuli", role: "Art & Design Teacher", campus: "Maganjo", imageUrl: "/placeholder-person.jpg" },
  ];

  const administrativeStaff = [
    { id: 1, name: "Martin Kayondo", role: "Admissions Officer", imageUrl: "/placeholder-person.jpg" },
    { id: 2, name: "Florence Nalubega", role: "Finance Manager", imageUrl: "/placeholder-person.jpg" },
    { id: 3, name: "Robert Kasozi", role: "Facilities Manager", imageUrl: "/placeholder-person.jpg" },
    { id: 4, name: "Irene Nabukalu", role: "School Counselor", imageUrl: "/placeholder-person.jpg" },
    { id: 5, name: "George Muwanga", role: "ICT Administrator", imageUrl: "/placeholder-person.jpg" },
    { id: 6, name: "Patricia Nanyonga", role: "Librarian", imageUrl: "/placeholder-person.jpg" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Teachers & Staff</h1>
            <p className="text-lg text-gray-600 mb-8">
              Meet the dedicated professionals who make Clevers' Origin Schools a center of academic excellence and holistic development.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Leadership Team</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Our school is led by experienced education professionals committed to upholding our mission and vision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((leader) => (
              <Card key={leader.id} className="border-none shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Leadership Photo Placeholder
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{leader.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {leader.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{leader.bio}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{leader.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{leader.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Department Heads Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Department Heads</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Our academic departments are led by experienced educators who ensure excellence in their respective fields.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentHeads.map((head) => (
              <Card key={head.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center p-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Photo
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{head.name}</h3>
                    <p className="text-primary text-sm font-medium">{head.role}</p>
                    <p className="text-gray-500 text-xs">{head.qualifications}</p>
                  </div>
                </div>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">{head.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Staff Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Teaching Staff</h2>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Our dedicated teachers bring expertise, passion, and commitment to the classroom every day.
          </p>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" className="px-4 py-2 text-sm font-medium text-primary bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-primary">
                All Campuses
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-primary">
                Kitintale
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-primary">
                Kasokoso
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-primary">
                Maganjo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teachingStaff.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Photo
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{teacher.name}</h3>
                  <p className="text-sm text-primary">{teacher.role}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{teacher.campus} Campus</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Administrative Staff Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Administrative Staff</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Our administrative team works diligently behind the scenes to ensure the smooth operation of all school functions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {administrativeStaff.map((staff) => (
              <div key={staff.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="h-32 w-32 bg-gray-200 rounded-full overflow-hidden mx-auto mt-6">
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Photo
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm">{staff.name}</h3>
                  <p className="text-xs text-gray-600">{staff.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
            <p className="text-gray-600 mb-8">
              We're always looking for passionate educators and staff who are committed to excellence and making a difference in the lives of young learners.
            </p>
            <Link href="/careers">
              <Button size="lg" className="gap-2">
                View Open Positions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
