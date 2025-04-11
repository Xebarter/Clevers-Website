import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Leadership Team | Clevers' Origin Schools",
  description: "Meet the dedicated leadership team behind Clevers' Origin Schools, guiding our vision and ensuring excellence in kindergarten education.",
};

// Array of leadership team members
const leadershipTeam = [
  {
    name: "Sarah Nantongo",
    role: "Founder & Director",
    bio: "Mrs. Nantongo founded Clevers' Origin Schools in 2005 with a vision to create joyful learning environments for young children. With over 25 years of experience in early childhood education, she remains passionate about innovative teaching methods.",
    achievements: ["National Education Leadership Award (2019)", "Early Childhood Educator of the Year (2012)"],
    education: "M.Ed in Early Childhood Education, Makerere University",
    color: "kinder-blue",
    emoji: "👩‍🏫"
  },
  {
    name: "David Okello",
    role: "Academic Director",
    bio: "Mr. Okello oversees curriculum development across all campuses. His focus on integrating play-based learning with academic rigor has significantly elevated our educational standards while keeping learning fun and engaging for our students.",
    achievements: ["Curriculum Innovation Prize (2021)", "Excellence in Teaching Award (2015)"],
    education: "Ph.D. in Educational Psychology, University of Nairobi",
    color: "kinder-green",
    emoji: "👨‍🎓"
  },
  {
    name: "Rebecca Nambi",
    role: "Operations Manager",
    bio: "Ms. Nambi ensures the smooth functioning of all three campuses, from facilities management to staff coordination. Her excellent organizational skills and warm approach have created efficient yet nurturing school environments.",
    achievements: ["Best School Administration Award (2022)", "Community Service Recognition (2018)"],
    education: "MBA, Uganda Management Institute",
    color: "kinder-purple",
    emoji: "👩‍💼"
  },
  {
    name: "Joshua Musoke",
    role: "Kitintale Campus Principal",
    bio: "Mr. Musoke has led our flagship campus since 2010. His leadership style emphasizes creating a family atmosphere where every child and staff member feels valued and supported in their learning journey.",
    achievements: ["Principal of the Year Finalist (2020)", "Community Impact Award (2019)"],
    education: "B.Ed in Early Childhood Education, Kyambogo University",
    color: "kinder-red",
    emoji: "👨‍🚀"
  },
  {
    name: "Esther Nakato",
    role: "Kasokoso Campus Principal",
    bio: "Ms. Nakato joined our team in 2011 and has been instrumental in developing our arts and music programs. Under her leadership, the Kasokoso campus has become known for its vibrant cultural activities and performances.",
    achievements: ["Arts Education Leadership Award (2018)", "Music Program Excellence (2016)"],
    education: "B.A. in Education & Music, Makerere University",
    color: "kinder-yellow",
    emoji: "👩‍🎨"
  },
  {
    name: "Daniel Kigozi",
    role: "Maganjo Campus Principal",
    bio: "Mr. Kigozi has been leading our newest campus since its opening in 2017. His background in sports education has helped develop excellent physical education programs while maintaining strong academic standards.",
    achievements: ["Physical Education Excellence Award (2021)", "Child Development Innovation (2019)"],
    education: "M.Ed in Sports Education, Uganda Christian University",
    color: "kinder-orange",
    emoji: "🧑‍🏫"
  }
];

export default function LeadershipPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-kinder-purple/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading heading-gradient">
              Our Leadership Team
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-body">
              Meet the passionate educators and administrators who guide our schools and inspire our community
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((leader, index) => (
              <Card key={index} className={`border-4 border-${leader.color}/30 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}>
                <div className={`bg-${leader.color}/10 p-6 flex justify-center`}>
                  <div className={`w-24 h-24 rounded-full bg-${leader.color}/20 border-4 border-${leader.color} flex items-center justify-center`}>
                    <div className="text-4xl">{leader.emoji}</div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className={`text-2xl font-bold mb-1 text-${leader.color} text-center font-heading`}>{leader.name}</h2>
                  <p className="text-gray-600 mb-4 text-center font-body">{leader.role}</p>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-gray-700 mb-4 font-body">{leader.bio}</p>

                    <h3 className={`text-lg font-bold mb-2 text-${leader.color} font-heading`}>Achievements</h3>
                    <ul className="list-disc pl-5 mb-4">
                      {leader.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-700 mb-1 font-body">{achievement}</li>
                      ))}
                    </ul>

                    <h3 className={`text-lg font-bold mb-2 text-${leader.color} font-heading`}>Education</h3>
                    <p className="text-gray-700 font-body">{leader.education}</p>

                    <div className="flex gap-4 mt-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-body">Email</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-body">Contact</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Leadership Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-kinder-red/10 via-kinder-green/10 to-kinder-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">Visit Our Campuses</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-body">
            Each of our three campuses is led by dedicated principals who ensure a warm, nurturing environment for all students.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button className="gap-2 bg-kinder-yellow border-yellow-600 hover:bg-kinder-yellow/90 hover:border-yellow-700 kinder-button">
                Apply Now
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

      {/* Board of Advisors */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-kinder-blue font-heading">Board of Advisors</h2>

          <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-kinder-blue/30 max-w-3xl mx-auto">
            <p className="text-gray-700 mb-6 font-body text-center">
              Clevers' Origin Schools is guided by a dedicated Board of Advisors consisting of education experts, community leaders, and parent representatives who provide strategic direction and oversight.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-kinder-blue/5">
                <h3 className="text-lg font-bold mb-2 text-kinder-blue font-heading">Education Experts</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-kinder-blue"></div>
                    <span className="text-gray-700 font-body">Prof. Jane Wasswa, Education Policy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-kinder-blue"></div>
                    <span className="text-gray-700 font-body">Dr. Robert Musisi, Child Psychology</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-kinder-blue"></div>
                    <span className="text-gray-700 font-body">Ms. Grace Ochieng, Curriculum Design</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-kinder-green/5">
                <h3 className="text-lg font-bold mb-2 text-kinder-green font-heading">Community & Parents</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-kinder-green"></div>
                    <span className="text-gray-700 font-body">Mr. James Mukasa, Community Leader</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-kinder-green"></div>
                    <span className="text-gray-700 font-body">Mrs. Sarah Mbabazi, Parent Representative</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-kinder-green"></div>
                    <span className="text-gray-700 font-body">Dr. Peter Okot, Healthcare Advisor</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
