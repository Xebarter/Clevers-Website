"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Brain,
  Microscope,
  Heart,
  Globe,
  Compass,
  type LucideIcon
} from "lucide-react";

// Define categories of extracurricular activities
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
    description: "Physical activities that promote teamwork, discipline, and physical fitness."
  },
  {
    id: "academics",
    name: "Academic Clubs",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Clubs that focus on extending learning beyond classroom curriculum in specific subject areas."
  },
  {
    id: "stem",
    name: "STEM",
    icon: Microscope,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Activities focusing on Science, Technology, Engineering, and Mathematics."
  },
  {
    id: "community",
    name: "Community Service",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Initiatives that give back to the community and develop students' empathy and social responsibility."
  },
  {
    id: "culture",
    name: "Cultural & Language",
    icon: Globe,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Activities that celebrate cultural diversity and promote language learning."
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: Compass,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    description: "Programs that develop students' leadership skills and qualities."
  }
];

// Sample extracurricular activities data
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
  image?: string;
}

const extracurricularActivities: Record<string, Activity[]> = {
  sports: [
    {
      id: 1,
      title: "Football Club",
      description: "Students learn and practice football skills, compete in local and regional tournaments, and build teamwork.",
      category: "sports",
      schedule: "Monday & Friday, 3:30 PM - 5:30 PM",
      location: "Sports Field, All Campuses",
      ageGroups: ["Primary", "Middle School", "High School"],
      leadTeacher: "Mr. Kizza Paul",
      achievements: ["Regional Schools League Champions 2024", "National Schools Cup Quarter-Finalists"],
    },
    {
      id: 2,
      title: "Swimming Team",
      description: "Students develop swimming skills in various styles and participate in competitions.",
      category: "sports",
      schedule: "Tuesday & Thursday, 3:30 PM - 5:00 PM",
      location: "Swimming Pool, Kitintale Campus",
      ageGroups: ["Primary", "Middle School", "High School"],
      leadTeacher: "Ms. Nakato Jane",
      achievements: ["National Schools Swimming Championship - 3 Gold Medals", "East African Schools Aquatics Meet - Silver Medal"],
    },
    {
      id: 3,
      title: "Athletics Club",
      description: "Track and field activities including sprints, long-distance running, jumps, and throws.",
      category: "sports",
      schedule: "Wednesday & Friday, 3:30 PM - 5:30 PM",
      location: "Athletic Track, Maganjo Campus",
      ageGroups: ["Primary", "Middle School", "High School"],
      leadTeacher: "Mr. Okello James",
      achievements: ["National Schools Athletics Meet - 2 Gold, 3 Silver, 4 Bronze", "East African Youth Championships - 1 Gold"],
    }
  ],
  academics: [
    {
      id: 1,
      title: "Debate Club",
      description: "Students develop critical thinking, public speaking, and argumentation skills through regular debates.",
      category: "academics",
      schedule: "Tuesday, 3:30 PM - 5:00 PM",
      location: "Conference Room, All Campuses",
      ageGroups: ["Middle School", "High School"],
      leadTeacher: "Ms. Namata Peace",
      achievements: ["National Debate Championship - Finalists", "East African Schools Debate - Semi-Finalists"],
    },
    {
      id: 2,
      title: "Book Club",
      description: "Students read and discuss various books, improving literacy, critical analysis, and appreciation for literature.",
      category: "academics",
      schedule: "Thursday, 3:30 PM - 4:30 PM",
      location: "Library, All Campuses",
      ageGroups: ["Primary", "Middle School", "High School"],
      leadTeacher: "Ms. Nankya Diana",
    }
  ],
  stem: [
    {
      id: 1,
      title: "Robotics Club",
      description: "Students design, build, and program robots, participating in local and international robotics competitions.",
      category: "stem",
      schedule: "Monday & Wednesday, 3:30 PM - 5:30 PM",
      location: "Innovation Lab, Maganjo Campus",
      ageGroups: ["Middle School", "High School"],
      leadTeacher: "Mr. Muwonge Isaac",
      achievements: ["National Robotics Challenge - Winners", "First Lego League East Africa - 2nd Place"],
    },
    {
      id: 2,
      title: "Coding Academy",
      description: "Students learn programming languages and develop applications, websites, and games.",
      category: "stem",
      schedule: "Tuesday & Thursday, 3:30 PM - 5:00 PM",
      location: "Computer Lab, All Campuses",
      ageGroups: ["Middle School", "High School"],
      leadTeacher: "Mr. Ssebuggwawo Daniel",
      achievements: ["National Youth Hackathon - 1st Place", "Africa Code Week - Recognition Award"],
    }
  ],
  community: [
    {
      id: 1,
      title: "Environmental Club",
      description: "Students engage in environmental conservation activities within the school and surrounding communities.",
      category: "community",
      schedule: "Wednesday, 3:30 PM - 5:00 PM",
      location: "Various Locations",
      ageGroups: ["Primary", "Middle School", "High School"],
      leadTeacher: "Ms. Kisakye Rachel",
      achievements: ["Green Schools Initiative Award", "National Environmental Conservation Award"],
    },
    {
      id: 2,
      title: "Community Outreach Program",
      description: "Students volunteer in local community centers, hospitals, and orphanages, developing empathy and social awareness.",
      category: "community",
      schedule: "Saturday, 9:00 AM - 1:00 PM (Bi-weekly)",
      location: "Various Community Locations",
      ageGroups: ["Middle School", "High School"],
      leadTeacher: "Mr. Kasozi Joshua",
    }
  ],
  culture: [
    {
      id: 1,
      title: "Language Club",
      description: "Students learn and practice French, Kiswahili, and other international languages through conversation and cultural activities.",
      category: "culture",
      schedule: "Thursday, 3:30 PM - 5:00 PM",
      location: "Language Lab, All Campuses",
      ageGroups: ["Primary", "Middle School", "High School"],
      leadTeacher: "Ms. Batenga Christine",
      achievements: ["National Language Competition - 1st Place in French", "East African Language Festival - Recognition Award"],
    }
  ],
  leadership: [
    {
      id: 1,
      title: "Student Council",
      description: "Elected student representatives who develop leadership skills while organizing school events and advocating for student interests.",
      category: "leadership",
      schedule: "Friday, 2:30 PM - 4:00 PM",
      location: "Conference Room, All Campuses",
      ageGroups: ["Middle School", "High School"],
      leadTeacher: "Ms. Namusoke Irene",
    },
    {
      id: 2,
      title: "Young Entrepreneurs Club",
      description: "Students learn business skills, develop entrepreneurial mindsets, and create small business projects.",
      category: "leadership",
      schedule: "Monday, 3:30 PM - 5:00 PM",
      location: "Business Lab, Kasokoso Campus",
      ageGroups: ["Middle School", "High School"],
      leadTeacher: "Mr. Mugisha Patrick",
      achievements: ["National Young Entrepreneurs Competition - 1st Place", "Innovation Challenge - Finalists"],
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
            At Clevers' Origin Schools, we believe in developing well-rounded students through a wide range of extracurricular activities that complement our academic program.
          </p>
        </div>

        {/* Benefits of Extracurricular Activities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Extracurricular Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Skills Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Students develop important skills like teamwork, leadership, time management, and problem-solving that complement classroom learning.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Social Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Activities provide opportunities for students to make friends, build relationships, and develop social skills in diverse environments.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-green-500" />
                  Personal Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Students discover their passions, interests, and talents, helping them shape their personal identity and future goals.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activities Categories */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Activities</h2>
          <Tabs defaultValue="sports" className="w-full">
            <TabsList className="w-full mb-8 grid grid-cols-3 sm:grid-cols-6 h-auto">
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
                <div className="bg-gray-50 p-4 rounded-lg mb-8">
                  <p className="text-center text-gray-600">{category.description}</p>
                </div>

                {extracurricularActivities[category.id]?.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{activity.title}</CardTitle>
                        <div className="flex gap-2">
                          {activity.ageGroups.map((age, index) => (
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

                        {activity.achievements && activity.achievements.length > 0 && (
                          <div className="flex items-start">
                            <Trophy className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Recent Achievements</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {activity.achievements.map((achievement, i) => (
                                  <li key={`${activity.id}-achievement-${i}`}>{achievement}</li>
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

        {/* Join Activities CTA */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Activities</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Students can join activities at the beginning of each term. Speak to the respective lead teachers or visit the extracurricular activities office for more information.
          </p>
          <Link href="/contact">
            <Button className="gap-2">
              Contact Us For More Information <Clock className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
