"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, HeartHandshake, CalendarDays, Trophy, Users, PlayCircle, Palette } from "lucide-react";

// Define MDD activity types
const mddTypes = [
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "text-school-red",
    bgColor: "bg-red-100",
    description: "From choir to orchestra, our music program offers various avenues for students to explore their musical talents."
  },
  {
    id: "dance",
    name: "Dance",
    icon: Users,
    color: "text-school-blue",
    bgColor: "bg-blue-100",
    description: "Our dance program covers traditional African dances, contemporary, and international dance styles."
  },
  {
    id: "drama",
    name: "Drama",
    icon: Palette,
    color: "text-school-green",
    bgColor: "bg-green-100",
    description: "Students develop acting skills, script writing, directing, and stage production through our drama program."
  }
];

// Sample MDD activities
const mddActivities = {
  music: [
    {
      id: 1,
      title: "School Choir",
      description: "Our award-winning choir performs regularly at school events, local competitions, and community gatherings.",
      achievements: ["National Choir Competition 2024 - 2nd Place", "East African Schools Choir Festival - Silver Medal"],
      schedule: "Monday & Wednesday, 3:30 PM - 5:00 PM",
      leadTeacher: "Ms. Nakabuye Maria",
      image: "/placeholder-choir.jpg" // This will be replaced with an actual image
    },
    {
      id: 2,
      title: "School Orchestra",
      description: "Students learn to play various instruments and perform as an ensemble in concerts and events.",
      achievements: ["Regional Music Festival - Gold Award", "National Schools Orchestra Competition - Finalists"],
      schedule: "Tuesday & Thursday, 3:30 PM - 5:00 PM",
      leadTeacher: "Mr. Kato Benjamin",
      image: "/placeholder-orchestra.jpg" // This will be replaced with an actual image
    },
    {
      id: 3,
      title: "Traditional Music Group",
      description: "Students learn traditional Ugandan and East African instruments and musical styles.",
      achievements: ["Cultural Heritage Festival - Best Traditional Performance", "National Cultural Competition - 1st Place"],
      schedule: "Friday, 2:00 PM - 4:00 PM",
      leadTeacher: "Mr. Ssematimba John",
      image: "/placeholder-traditional.jpg" // This will be replaced with an actual image
    }
  ],
  dance: [
    {
      id: 1,
      title: "Traditional Dance Troupe",
      description: "Students learn traditional dances from Uganda and across East Africa, performing at cultural events.",
      achievements: ["East African Schools Cultural Showcase - Best Dance Performance", "National Traditional Dance Competition - Gold Medal"],
      schedule: "Tuesday & Thursday, 4:00 PM - 5:30 PM",
      leadTeacher: "Ms. Namakula Sarah",
      image: "/placeholder-traditional-dance.jpg" // This will be replaced with an actual image
    },
    {
      id: 2,
      title: "Contemporary Dance Club",
      description: "Students explore modern dance styles including hip hop, contemporary, and jazz dance forms.",
      achievements: ["Urban Dance Challenge - First Runner Up", "School Arts Festival - Best Choreography"],
      schedule: "Monday & Wednesday, 4:00 PM - 5:30 PM",
      leadTeacher: "Mr. Mutumba Daniel",
      image: "/placeholder-contemporary.jpg" // This will be replaced with an actual image
    }
  ],
  drama: [
    {
      id: 1,
      title: "Drama Club",
      description: "Students develop acting skills and perform plays ranging from Ugandan works to international classics.",
      achievements: ["National Schools Drama Festival - Best Production", "Regional Theater Competition - Best Ensemble Cast"],
      schedule: "Monday & Friday, 3:30 PM - 5:30 PM",
      leadTeacher: "Ms. Nabatanzi Joyce",
      image: "/placeholder-drama.jpg" // This will be replaced with an actual image
    },
    {
      id: 2,
      title: "Script Writing Workshop",
      description: "Students learn the art of script writing for plays, short films, and radio dramas.",
      achievements: ["Young Writers Competition - Best Drama Script", "National Youth Playwrights Award - Finalist"],
      schedule: "Wednesday, 3:30 PM - 5:00 PM",
      leadTeacher: "Mr. Wasswa Timothy",
      image: "/placeholder-scriptwriting.jpg" // This will be replaced with an actual image
    },
    {
      id: 3,
      title: "Technical Theater Crew",
      description: "Students learn about stage design, lighting, sound, and production management for school performances.",
      achievements: ["School Arts Fest - Best Technical Production", "National Drama Competition - Technical Excellence Award"],
      schedule: "Thursday, 3:30 PM - 5:30 PM",
      leadTeacher: "Mr. Lubega Patrick",
      image: "/placeholder-technical.jpg" // This will be replaced with an actual image
    }
  ]
};

export default function ArtsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Music, Dance & Drama</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At Clevers' Origin Schools, we nurture artistic talents through our comprehensive Music, Dance, and Drama programs that help students build confidence, develop teamwork, and express creativity.
          </p>
        </div>

        {/* MDD Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {mddTypes.map((type) => (
            <Card key={type.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${type.bgColor}`} />
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${type.bgColor}`}>
                    <type.icon className={`h-6 w-6 ${type.color}`} />
                  </div>
                  <CardTitle>{type.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MDD Activities Tabs */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Activities</h2>
          <Tabs defaultValue="music" className="w-full">
            <TabsList className="w-full mb-8 grid grid-cols-3 h-auto">
              {mddTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="py-3">
                  <div className="flex items-center space-x-2">
                    <type.icon className={`h-5 w-5 ${type.color}`} />
                    <span>{type.name}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {mddTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-8">
                {mddActivities[type.id as keyof typeof mddActivities].map((activity) => (
                  <Card key={activity.id} className="overflow-hidden school-card">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative h-[200px] md:h-auto">
                        {/* Placeholder div for image */}
                        <div className={`absolute inset-0 flex items-center justify-center bg-${type.bgColor} text-${type.color}`}>
                          <PlayCircle className="h-12 w-12 opacity-50" />
                        </div>
                      </div>
                      <div className="md:col-span-2 p-6">
                        <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                        <p className="text-gray-600 mb-4">{activity.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start">
                            <Trophy className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Achievements</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {activity.achievements.map((achievement, i) => (
                                  <li key={i}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <CalendarDays className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-sm">Schedule</h4>
                                <p className="text-sm text-gray-600">{activity.schedule}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <HeartHandshake className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-sm">Lead Teacher</h4>
                                <p className="text-sm text-gray-600">{activity.leadTeacher}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Annual Showcase Section */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <Badge className="mb-2">Annual Event</Badge>
            <h2 className="text-3xl font-bold">Annual MDD Showcase</h2>
            <p className="text-gray-600 mt-2">
              Every year, our students showcase their talents in our biggest arts event of the year. Parents, community members, and special guests are invited to witness the creativity and skills of our students.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link href="/contact">
              <Button className="gap-2">
                Contact Us for More Information <CalendarDays className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
