// src/app/academics/page.tsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, Brain, Calculator, Beaker, Globe, Languages, Music, Palette, Trophy, Users, Presentation, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CurriculumPage() {
  // Client-side metadata workaround
  useEffect(() => {
    document.title = "Curriculum | Clevers' Origin Schools";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Explore our comprehensive curriculum at Clevers' Origin Schools, designed to nurture academic excellence and holistic development in our Nursery and Primary sections."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Explore our comprehensive curriculum at Clevers' Origin Schools, designed to nurture academic excellence and holistic development in our Nursery and Primary sections.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Curriculum</h1>
            <p className="text-lg text-gray-600 mb-8">
              At Clevers' Origin Schools, our curriculum for Nursery and Primary sections is designed to provide a balanced and comprehensive educational experience that fosters holistic development and prepares students for future success.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Philosophy */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Educational Philosophy</h2>
              <p className="text-gray-600 mb-6">
                Our curriculum for Nursery and Primary students is guided by a philosophy that values foundational learning, character development, creativity, and cultural awareness. We believe in:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Brain className="h-6 w-6 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Early Skill Development</h3>
                    <p className="text-gray-600">
                      Building foundational skills in literacy, numeracy, and social interaction to support lifelong learning.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Collaborative Learning</h3>
                    <p className="text-gray-600">
                      Encouraging teamwork and communication through group activities and play-based learning.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Cultural Awareness</h3>
                    <p className="text-gray-600">
                      Introducing students to diverse cultures and values to foster empathy and understanding.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Trophy className="h-6 w-6 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Holistic Growth</h3>
                    <p className="text-gray-600">
                      Supporting academic, emotional, and physical development through a well-rounded curriculum.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/hol1.jpg"
                alt="Educational Philosophy at Clevers' Origin Schools"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Framework */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Curriculum Framework</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Our curriculum for Nursery and Primary sections follows the Uganda National Curriculum while incorporating international best practices to ensure our students receive a strong foundation for future learning.
          </p>

          <Tabs defaultValue="nursery" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="nursery">Nursery</TabsTrigger>
              <TabsTrigger value="primary">Primary School</TabsTrigger>
            </TabsList>

            <TabsContent value="nursery" className="border rounded-lg p-6 bg-white">
              <h3 className="text-2xl font-bold mb-6">Nursery Curriculum (Baby to Top Class)</h3>

              <div>
                <p className="text-gray-600 mb-6">
                  Our Nursery curriculum focuses on play-based learning to foster early development in a nurturing environment. We emphasize social, emotional, and cognitive growth through engaging activities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-base">Early Literacy & Numeracy</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Letter recognition</li>
                        <li>• Phonics and storytelling</li>
                        <li>• Number recognition</li>
                        <li>• Counting and sorting</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-base">Creative Arts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Drawing and coloring</li>
                        <li>• Music and movement</li>
                        <li>• Drama and role-play</li>
                        <li>• Craft activities</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-base">Social & Emotional Skills</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Sharing and cooperation</li>
                        <li>• Emotional expression</li>
                        <li>• Group play</li>
                        <li>• Basic manners</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-base">Environmental Awareness</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Nature exploration</li>
                        <li>• Weather and seasons</li>
                        <li>• Basic hygiene</li>
                        <li>• Community helpers</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Music className="h-5 w-5 text-rose-500" />
                        <CardTitle className="text-base">Physical Development</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Gross motor skills</li>
                        <li>• Fine motor skills</li>
                        <li>• Outdoor play</li>
                        <li>• Coordination activities</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="primary" className="border rounded-lg p-6 bg-white">
              <h3 className="text-2xl font-bold mb-6">Primary School Curriculum (P1-P7)</h3>

              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">Lower Primary (P1-P3)</h4>
                <p className="text-gray-600 mb-6">
                  Our Lower Primary curriculum focuses on building a strong foundation in literacy, numeracy, and essential life skills, using a thematic approach to integrate subjects around central themes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-base">Language & Literacy</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• English language</li>
                        <li>• Local language literacy</li>
                        <li>• Reading skills</li>
                        <li>• Creative writing</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-base">Mathematics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Number concepts</li>
                        <li>• Basic operations</li>
                        <li>• Shape and space</li>
                        <li>• Practical math applications</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-base">Integrated Science</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Nature studies</li>
                        <li>• Basic scientific concepts</li>
                        <li>• Environmental awareness</li>
                        <li>• Health education</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Upper Primary (P4-P7)</h4>
                <p className="text-gray-600 mb-6">
                  In Upper Primary, the curriculum becomes more subject-specific while maintaining an integrated approach. Students are prepared for the Primary Leaving Examinations (PLE) through comprehensive and engaging instruction.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-violet-500" />
                        <CardTitle className="text-base">Language & Literature</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Advanced English language</li>
                        <li>• Literature appreciation</li>
                        <li>• Comprehensive reading</li>
                        <li>• Essay writing & composition</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-indigo-500" />
                        <CardTitle className="text-base">Mathematics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Advanced arithmetic</li>
                        <li>• Introductory algebra</li>
                        <li>• Geometry & measurement</li>
                        <li>• Data handling & statistics</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-teal-500" />
                        <CardTitle className="text-base">Science</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Biology fundamentals</li>
                        <li>• Basic physics concepts</li>
                        <li>• Chemistry introduction</li>
                        <li>• Agricultural science</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-base">Social Studies</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• History of Uganda & East Africa</li>
                        <li>• Geography</li>
                        <li>• Civic education</li>
                        <li>• Cultural studies</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-rose-500" />
                        <CardTitle className="text-base">Creative Arts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Visual arts</li>
                        <li>• Music, dance & drama</li>
                        <li>• Crafts</li>
                        <li>• Physical education</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-cyan-500" />
                        <CardTitle className="text-base">Technology & Life Skills</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Computer literacy</li>
                        <li>• Basic digital skills</li>
                        <li>• Life skills education</li>
                        <li>• Practical problem-solving</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Teaching Methodology</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            We employ diverse teaching methods tailored for Nursery and Primary students to accommodate different learning styles and ensure every child can reach their full potential.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Presentation className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Play-Based Learning</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600">
                  For Nursery students, we use play-based activities to make learning fun, engaging, and effective for early development.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Collaborative Activities</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600">
                  Students work together on activities that develop both subject knowledge and essential skills such as teamwork and communication.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Hands-On Learning</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600">
                  We encourage active participation through experiments, crafts, and practical tasks to foster curiosity and understanding.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Differentiated Instruction</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600">
                  Our teachers adapt methods to address the diverse learning needs of Nursery and Primary students, ensuring everyone can succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/image10.jpg"
                alt="Assessment Approach at Clevers' Origin Schools"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-red-50 opacity-20" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Assessment & Evaluation</h2>
              <p className="text-gray-600 mb-6">
                We use a comprehensive assessment approach tailored for Nursery and Primary students to monitor progress and support holistic development.
              </p>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">1</span>
                    </div>
                    Continuous Assessment
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Regular observations and activities to monitor progress and provide timely feedback for both Nursery and Primary students.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    Activity-Based Assessment
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Evaluation through play, crafts, and group tasks for Nursery, and projects for Primary students, to assess skill application.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    Standardized Testing
                  </h3>
                  <p className="text-gray-600 mt-2">
                    For Upper Primary (P4-P7), preparation for the Primary Leaving Examinations (PLE) through regular practice and mock tests.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">4</span>
                    </div>
                    Holistic Development Reports
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Comprehensive reports that include academic progress, social skills, and emotional growth for Nursery and Primary students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-school-red/10 via-school-blue/10 to-school-green/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience Our Curriculum in Action</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Visit Clevers' Origin Schools to see how our Nursery and Primary curriculum nurtures excellence and unlocks each child's potential. Schedule a tour or apply today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" className="gap-2">
                Apply Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="gap-2">
                Schedule a Visit <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
