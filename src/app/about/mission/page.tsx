import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Lightbulb, ArrowRight, Sparkles, Award, Smile, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Mission & Vision | Clevers' Origin Schools",
  description: "Discover our mission, vision, and the core values that guide Clevers' Origin Schools' approach to kindergarten education.",
};

export default function MissionPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-kinder-blue/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading heading-gradient">
              Our Mission & Vision
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-body">
              The guiding principles and aspirations that shape our approach to education
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <Card className="border-4 border-kinder-blue/30 rounded-3xl overflow-hidden shadow-lg">
              <div className="bg-kinder-blue/10 p-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-kinder-blue flex items-center justify-center">
                  <Target className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-kinder-blue text-center font-heading">Our Mission</h2>
                <p className="text-gray-700 mb-6 text-center text-lg font-body">
                  We provide quality education to all children, discover and develop their talents with much emphasis on morals, in order to make a productive and God-fearing generation.
                </p>
                <div className="border-t border-kinder-blue/20 pt-6 mt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 text-kinder-blue">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-gray-700 font-body">
                        <span className="font-semibold text-kinder-blue">Nurture curiosity</span> through play-based, child-centered learning approaches
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 text-kinder-blue">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-gray-700 font-body">
                        <span className="font-semibold text-kinder-blue">Develop character</span> by modeling and teaching compassion, responsibility, and respect
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 text-kinder-blue">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-gray-700 font-body">
                        <span className="font-semibold text-kinder-blue">Build community</span> by fostering meaningful partnerships with families and neighborhoods
                      </p>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="border-4 border-kinder-green/30 rounded-3xl overflow-hidden shadow-lg">
              <div className="bg-kinder-green/10 p-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-kinder-green flex items-center justify-center">
                  <Lightbulb className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-kinder-green text-center font-heading">Our Vision</h2>
                <p className="text-gray-700 mb-6 text-center text-lg font-body">
                  To be recognized as a leader in early childhood education, where every child feels valued, inspired, and equipped to reach their full potential.
                </p>
                <div className="border-t border-kinder-green/20 pt-6 mt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 text-kinder-green">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-gray-700 font-body">
                        <span className="font-semibold text-kinder-green">Creative thinkers</span> who approach challenges with imagination and innovation
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 text-kinder-green">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-gray-700 font-body">
                        <span className="font-semibold text-kinder-green">Confident communicators</span> who express themselves clearly and listen attentively
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 text-kinder-green">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-gray-700 font-body">
                        <span className="font-semibold text-kinder-green">Compassionate citizens</span> who contribute positively to their community
                      </p>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Philosophy */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-kinder-yellow/20 to-kinder-pink/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-kinder-purple font-heading">Our Educational Philosophy</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-purple/30">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-kinder-purple/10 flex-shrink-0 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-kinder-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 font-heading text-kinder-purple">Child-Centered Learning</h3>
                  <p className="text-gray-700 font-body">
                    We recognize that each child is unique, with individual strengths, interests, and learning styles. Our curriculum is flexible enough to engage all learners while meeting educational standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-red/30">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-kinder-red/10 flex-shrink-0 flex items-center justify-center">
                  <Smile className="h-6 w-6 text-kinder-red" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 font-heading text-kinder-red">Play-Based Approach</h3>
                  <p className="text-gray-700 font-body">
                    We believe children learn best through purposeful play. Our classrooms are designed as stimulating environments where discovery and hands-on experiences lead to deep learning.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/30">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-kinder-blue/10 flex-shrink-0 flex items-center justify-center">
                  <Award className="h-6 w-6 text-kinder-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 font-heading text-kinder-blue">Character Development</h3>
                  <p className="text-gray-700 font-body">
                    Academic skills and character development go hand in hand. We intentionally teach and model values like kindness, perseverance, and respect throughout our daily activities.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-green/30">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-kinder-green/10 flex-shrink-0 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-kinder-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 font-heading text-kinder-green">Developmental Readiness</h3>
                  <p className="text-gray-700 font-body">
                    We understand that children develop at different rates. Our educators are trained to identify each child's developmental stage and provide appropriate learning experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">Join Our School Community</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-body">
            Experience firsthand how our mission and vision create a vibrant learning environment for young children.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button variant="outline" className="gap-2 border-2">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
