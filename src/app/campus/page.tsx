import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight, Users, Calendar, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Campuses | Clevers' Origin Schools",
  description: "Explore our three vibrant campuses in Kitintale, Kasokoso, and Maganjo, each offering unique learning environments for kindergarten education.",
};

// Campus data
const campuses = [
  {
    name: "Kitintale Campus",
    description: "Our flagship campus established in 2005, featuring spacious classrooms, dedicated play areas, and innovative learning environments.",
    established: "2005",
    students: "200+",
    highlights: ["Creative Arts Program", "Community Garden", "Leadership Development", "Multilingual Program"],
    image: "🏫",
    color: "kinder-blue",
    slug: "kitintale"
  },
  {
    name: "Kasokoso Campus",
    description: "Known for its vibrant arts and cultural programs, providing children with a creative learning environment that celebrates diversity and expression.",
    established: "2010",
    students: "180+",
    highlights: ["Music Excellence Program", "Cultural Diversity", "Emotional Intelligence", "Literacy Through Arts"],
    image: "🎭",
    color: "kinder-red",
    slug: "kasokoso"
  },
  {
    name: "Maganjo Campus",
    description: "Our newest campus featuring modern facilities and innovative programs focused on sports, technology, and environmental education.",
    established: "2017",
    students: "150+",
    highlights: ["Sports Excellence", "Tech for Tots", "Eco-Explorers", "Active Learning"],
    image: "🏆",
    color: "kinder-green",
    slug: "maganjo"
  }
];

export default function CampusesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-kinder-yellow/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading heading-gradient">
              Our Campuses
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-body">
              Explore our three vibrant campuses, each with its own unique character while sharing our core commitment to joyful, nurturing education
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center font-heading text-kinder-blue">
            Find Us in Kampala
          </h2>

          <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/20 mb-10">
            <div className="aspect-video relative rounded-2xl overflow-hidden">
              {/* Map Placeholder - replace with actual map */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="text-6xl mb-2">🗺️</div>
                  <p className="text-gray-600 font-heading">Campus Locations Map</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campuses.map((campus) => (
              <div key={campus.slug} className={`bg-${campus.color}/10 p-4 rounded-xl flex items-center gap-3`}>
                <div className={`w-10 h-10 rounded-full bg-${campus.color} flex-shrink-0 flex items-center justify-center text-white`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-${campus.color} font-heading`}>{campus.name}</h3>
                  <p className="text-sm text-gray-700 font-body">Central Kampala District</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campuses Detail Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {campuses.map((campus) => (
              <Card key={campus.slug} className={`border-4 border-${campus.color}/30 rounded-3xl overflow-hidden shadow-lg`}>
                <div className={`bg-${campus.color}/10 p-6 flex justify-center`}>
                  <div className="aspect-video relative w-full rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                    {/* Campus Image Placeholder - replace with actual image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">{campus.image}</div>
                        <p className="text-gray-600 font-heading">{campus.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h2 className={`text-2xl font-bold mb-2 font-heading text-${campus.color}`}>
                    {campus.name}
                  </h2>
                  <p className="text-gray-700 mb-4 font-body">
                    {campus.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-${campus.color}/10 flex items-center justify-center`}>
                        <Calendar className={`h-4 w-4 text-${campus.color}`} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-body">Established</div>
                        <div className="text-sm font-semibold font-body">{campus.established}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-${campus.color}/10 flex items-center justify-center`}>
                        <Users className={`h-4 w-4 text-${campus.color}`} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-body">Students</div>
                        <div className="text-sm font-semibold font-body">{campus.students}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold mb-2 font-heading">Key Programs:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {campus.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <Sparkles className={`h-3 w-3 text-${campus.color}`} />
                          <span className="text-xs text-gray-700 font-body">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={`/campus/${campus.slug}`}>
                    <Button className={`w-full gap-2 bg-${campus.color} border-b-4 border-${campus.color === 'kinder-red' ? 'red' : campus.color === 'kinder-blue' ? 'blue' : 'green'}-600 hover:bg-${campus.color}/90 kinder-button`}>
                      Explore Campus
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            Campus Comparison
          </h2>

          <div className="bg-white p-6 rounded-3xl shadow-md overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-3 font-heading">Features</th>
                  <th className="text-center p-3 font-heading text-kinder-blue">Kitintale</th>
                  <th className="text-center p-3 font-heading text-kinder-red">Kasokoso</th>
                  <th className="text-center p-3 font-heading text-kinder-green">Maganjo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="p-3 font-body">Class Size</td>
                  <td className="text-center p-3 font-body">Max. 20 students</td>
                  <td className="text-center p-3 font-body">Max. 18 students</td>
                  <td className="text-center p-3 font-body">Max. 15 students</td>
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-3 font-body">Special Programs</td>
                  <td className="text-center p-3 font-body">Leadership & Languages</td>
                  <td className="text-center p-3 font-body">Arts & Music</td>
                  <td className="text-center p-3 font-body">Sports & Technology</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-3 font-body">Facilities</td>
                  <td className="text-center p-3 font-body">Community Garden, Library</td>
                  <td className="text-center p-3 font-body">Music Room, Art Studio</td>
                  <td className="text-center p-3 font-body">Sports Field, Tech Lab</td>
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-3 font-body">Extended Hours</td>
                  <td className="text-center p-3 font-body">Available</td>
                  <td className="text-center p-3 font-body">Available</td>
                  <td className="text-center p-3 font-body">Available</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-3 font-body">Transport Service</td>
                  <td className="text-center p-3 font-body">Available</td>
                  <td className="text-center p-3 font-body">Available</td>
                  <td className="text-center p-3 font-body">Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-kinder-blue/20 via-kinder-red/20 to-kinder-green/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">
            Visit Our Campuses
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-body">
            The best way to experience our vibrant learning environments is to schedule a visit. Come see our facilities and meet our dedicated staff.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button className="gap-2 kinder-button">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="gap-2 border-2">
                Schedule a Visit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
