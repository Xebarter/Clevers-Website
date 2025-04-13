"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Users,
  CalendarDays,
  MapPin,
  Clock,
  Dumbbell,
  Heart,
  Globe,
  type LucideIcon
} from "lucide-react";

// Categories suitable for younger children
interface ActivityCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

const activityCategories: ActivityCategory[] = [
  {
    id: "sports",
    name: "Sports",
    icon: Dumbbell,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Fun physical activities that help young learners grow strong, active, and confident."
  },
  {
    id: "community",
    name: "Community & Care",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Gentle activities that help children learn kindness, sharing, and care for the world around them."
  },
  {
    id: "culture",
    name: "Culture & Language",
    icon: Globe,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Learning new languages, songs, and dances from around the world in a playful way."
  }
];

// Activities filtered for nursery and primary
interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  schedule: string;
  location: string;
  ageGroups: string[];
  leadTeacher: string;
  achievements?: string[];
}

const extracurricularActivities: Record<string, Activity[]> = {
  sports: [
    {
      id: 1,
      title: "Mini Football",
      description: "Fun and simple football games that help improve motor skills and teamwork.",
      category: "sports",
      schedule: "Tuesday & Friday, 3:00 PM - 4:00 PM",
      location: "Playground",
      ageGroups: ["Nursery", "Primary"],
      leadTeacher: "Coach Musa",
    },
    {
      id: 2,
      title: "Basic Swimming",
      description: "Water safety and swimming basics in a fun and supervised environment.",
      category: "sports",
      schedule: "Wednesday, 2:30 PM - 3:30 PM",
      location: "School Pool",
      ageGroups: ["Primary"],
      leadTeacher: "Ms. Aisha",
    }
  ],
  community: [
    {
      id: 1,
      title: "Little Helpers Club",
      description: "Children help care for the school garden and clean up play areas while learning about the environment.",
      category: "community",
      schedule: "Thursday, 3:00 PM - 4:00 PM",
      location: "School Garden",
      ageGroups: ["Primary"],
      leadTeacher: "Ms. Rachel",
    }
  ],
  culture: [
    {
      id: 1,
      title: "Songs & Stories Around the World",
      description: "Exploring new cultures through storytelling, traditional songs, and crafts.",
      category: "culture",
      schedule: "Monday, 3:00 PM - 4:00 PM",
      location: "Activity Room",
      ageGroups: ["Nursery", "Primary"],
      leadTeacher: "Ms. Olivia",
    }
  ]
};

export default function ActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Extracurricular Activities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At our school, we encourage play, creativity, and care through a variety of fun and safe extracurricular activities for Nursery and Primary children.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Join Activities?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Confidence & Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Children gain confidence, coordination, and creativity while learning new things in a fun setting.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Making Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Activities help children connect with others and build important social skills at a young age.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  Exploring the World
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Kids explore languages, music, nature, and storytelling to build curiosity and cultural appreciation.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Categories */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Activities</h2>
          <Tabs defaultValue="sports" className="w-full">
            <TabsList className="w-full mb-8 grid grid-cols-3 sm:grid-cols-3 h-auto">
              {activityCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="py-3 px-2">
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-2 rounded-full ${category.bgColor} mb-1`}>
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <span className="text-xs sm:text-sm">{category.name}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {activityCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-8">
                <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center">
                  <p className="text-gray-600">{category.description}</p>
                </div>

                {extracurricularActivities[category.id]?.map((activity) => (
                  <Card key={activity.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{activity.title}</CardTitle>
                        <div className="flex gap-2">
                          {activity.ageGroups.map((age) => (
                            <Badge key={`${activity.id}-${age}`} variant="outline">
                              {age}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <CardDescription>{activity.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <CalendarDays className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-sm">Schedule</h4>
                              <p className="text-sm text-gray-600">{activity.schedule}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-sm">Location</h4>
                              <p className="text-sm text-gray-600">{activity.location}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Users className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-sm">Lead Teacher</h4>
                              <p className="text-sm text-gray-600">{activity.leadTeacher}</p>
                            </div>
                          </div>
                        </div>
                        {activity.achievements?.length && (
                          <div className="flex items-start">
                            <Trophy className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Achievements</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {activity.achievements.map((achieve, i) => (
                                  <li key={`${activity.id}-ach-${i}`}>{achieve}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Get Involved!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Activities are open at the beginning of each term. Talk to a teacher or visit the activities coordinator to sign up!
          </p>
          <Link href="/contact">
            <Button className="gap-2">
              Contact Us <Clock className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
