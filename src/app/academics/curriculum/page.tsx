import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, Brain, Calculator, Beaker, Globe, Languages, Music, Palette, Trophy, Users, Atom, Code, Presentation, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Curriculum | Clevers' Origin Schools",
  description: "Explore our comprehensive curriculum at Clevers' Origin Schools, designed to nurture academic excellence and holistic development.",
};

export default function CurriculumPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Curriculum</h1>
            <p className="text-lg text-gray-600 mb-8">
              At Clevers' Origin Schools, our curriculum is designed to provide a balanced and comprehensive educational experience that prepares students for success in an ever-changing world.
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
                Our curriculum is guided by a philosophy that values academic rigor, character development, creativity, and cultural awareness. We believe in:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Brain className="h-6 w-6 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Critical Thinking</h3>
                    <p className="text-gray-600">
                      Developing analytical skills and encouraging students to question, evaluate, and form independent judgments.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Collaborative Learning</h3>
                    <p className="text-gray-600">
                      Fostering teamwork, communication, and interpersonal skills through group projects and activities.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Global Perspective</h3>
                    <p className="text-gray-600">
                      Providing a multicultural education that prepares students to be informed and responsible global citizens.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Trophy className="h-6 w-6 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Excellence in All Areas</h3>
                    <p className="text-gray-600">
                      Striving for high standards in academics, arts, sports, and character development.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              {/* Placeholder for educational approach image */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-medium">
                Educational Philosophy Image Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Framework */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Curriculum Framework</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Our curriculum follows the Uganda National Curriculum while incorporating international best practices to ensure our students receive a globally competitive education.
          </p>

          <Tabs defaultValue="primary" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="primary">Primary School</TabsTrigger>
              <TabsTrigger value="secondary">Secondary School</TabsTrigger>
            </TabsList>

            <TabsContent value="primary" className="border rounded-lg p-6 bg-white">
              <h3 className="text-2xl font-bold mb-6">Primary School Curriculum (P1-P7)</h3>

              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">Lower Primary (P1-P3)</h4>
                <p className="text-gray-600 mb-6">
                  Our lower primary curriculum focuses on building a strong foundation in literacy, numeracy, and essential life skills. We use a thematic approach to learning that integrates subjects around central themes.
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
                  In upper primary, the curriculum becomes more subject-specific while maintaining an integrated approach. Students are prepared for the Primary Leaving Examinations (PLE) through comprehensive and engaging instruction.
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
                        <Code className="h-5 w-5 text-cyan-500" />
                        <CardTitle className="text-base">Technology</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Computer literacy</li>
                        <li>• Basic coding concepts</li>
                        <li>• Digital citizenship</li>
                        <li>• Practical technology skills</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="secondary" className="border rounded-lg p-6 bg-white">
              <h3 className="text-2xl font-bold mb-6">Secondary School Curriculum (S1-S6)</h3>

              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">O-Level (S1-S4)</h4>
                <p className="text-gray-600 mb-6">
                  Our O-Level curriculum prepares students for the Uganda Certificate of Education (UCE) examinations while also developing critical thinking, problem-solving, and practical skills.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">Languages</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• English language & literature</li>
                        <li>• Kiswahili</li>
                        <li>• French (optional)</li>
                        <li>• Local language studies</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-base">Mathematics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Algebra & arithmetic</li>
                        <li>• Geometry & trigonometry</li>
                        <li>• Statistics & probability</li>
                        <li>• Sets, functions & matrices</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Atom className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base">Sciences</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Biology</li>
                        <li>• Chemistry</li>
                        <li>• Physics</li>
                        <li>• Agricultural science</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-amber-600" />
                        <CardTitle className="text-base">Humanities</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• History</li>
                        <li>• Geography</li>
                        <li>• Religious education</li>
                        <li>• Social studies</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-base">Technology</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Computer studies</li>
                        <li>• Information technology</li>
                        <li>• Technical drawing</li>
                        <li>• Entrepreneurship</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-rose-600" />
                        <CardTitle className="text-base">Arts & Physical Education</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Fine art</li>
                        <li>• Music</li>
                        <li>• Physical education</li>
                        <li>• Sports & games</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">A-Level (S5-S6)</h4>
                <p className="text-gray-600 mb-6">
                  Our A-Level curriculum offers specialized study paths in preparation for the Uganda Advanced Certificate of Education (UACE) examinations and higher education opportunities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="bg-blue-50">
                      <CardTitle>Science Combination</CardTitle>
                      <CardDescription>PCB, PCM, BCM</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Physics</li>
                        <li>• Chemistry</li>
                        <li>• Biology</li>
                        <li>• Mathematics</li>
                        <li>• Computer Science (subsidiary)</li>
                        <li>• General Paper</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="bg-green-50">
                      <CardTitle>Arts Combination</CardTitle>
                      <CardDescription>HEG, HEL, HGL, LEG</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• History</li>
                        <li>• Economics</li>
                        <li>• Geography</li>
                        <li>• Literature</li>
                        <li>• Divinity (subsidiary)</li>
                        <li>• General Paper</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="bg-purple-50">
                      <CardTitle>Technology Combination</CardTitle>
                      <CardDescription>Technical & Business Studies</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Computer Science</li>
                        <li>• Mathematics</li>
                        <li>• Economics</li>
                        <li>• Entrepreneurship</li>
                        <li>• Technical Drawing (subsidiary)</li>
                        <li>• General Paper</li>
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
            We employ diverse teaching methods to accommodate different learning styles and ensure every student can reach their full potential.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Presentation className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600">
                  Our classrooms are dynamic environments where students actively participate in the learning process through discussions, question-and-answer sessions, and hands-on activities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Collaborative Projects</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600">
                  Students work together on projects that develop both subject knowledge and essential life skills such as teamwork, leadership, and communication.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Inquiry-Based Learning</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600">
                  We encourage students to ask questions, investigate problems, and discover solutions, fostering critical thinking and analytical skills.
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
                  Our teachers adapt their teaching methods to address the diverse learning needs and abilities of each student, ensuring everyone can succeed.
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
              {/* Placeholder for assessment image */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-red-50" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-medium">
                Assessment Approach Image Placeholder
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Assessment & Evaluation</h2>
              <p className="text-gray-600 mb-6">
                We believe in a comprehensive assessment approach that goes beyond traditional testing to provide a true picture of student learning and development.
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
                    Regular formative assessments to monitor progress and provide timely feedback.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    Project-Based Assessment
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Evaluation through practical projects that demonstrate application of knowledge and skills.
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
                    Preparation for national examinations (PLE, UCE, UACE) through regular practice and mock tests.
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
                    Comprehensive reports that include academic progress, social skills, character development, and extracurricular achievements.
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
            Visit Clevers' Origin Schools to see how our curriculum nurtures excellence and unlocks each student's potential. Schedule a tour or apply today.
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
