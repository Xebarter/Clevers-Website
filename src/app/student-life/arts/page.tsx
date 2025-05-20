"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, HeartHandshake, CalendarDays, Trophy, Users, PlayCircle, Palette, ExternalLink } from "lucide-react";

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

// YouTube video links and thumbnail URLs
const youtubeVideos = [
  {
    id: "_Sza63XNOa4",
    url: "https://youtu.be/_Sza63XNOa4?si=ZeIz1O1j2yjZSlFF",
    thumbnail: "https://img.youtube.com/vi/_Sza63XNOa4/maxresdefault.jpg"
  },
  {
    id: "7QF3EWq06pQ",
    url: "https://youtu.be/7QF3EWq06pQ?si=IXbUC4ddVjxd1b60",
    thumbnail: "https://img.youtube.com/vi/7QF3EWq06pQ/maxresdefault.jpg"
  },
  {
    id: "-ZXVbT3oD6k",
    url: "https://youtu.be/-ZXVbT3oD6k?si=-jvwPIe6Y3vm29Vr",
    thumbnail: "https://img.youtube.com/vi/-ZXVbT3oD6k/maxresdefault.jpg"
  },
  {
    id: "aqJoXbW1oVw",
    url: "https://youtu.be/aqJoXbW1oVw?si=buIRqtP-K4hBRey6",
    thumbnail: "https://img.youtube.com/vi/aqJoXbW1oVw/maxresdefault.jpg"
  },
  {
    id: "78fqO_zwuMA",
    url: "https://youtu.be/78fqO_zwuMA?si=SeJXbmP1zYrVFT7p",
    thumbnail: "https://img.youtube.com/vi/78fqO_zwuMA/maxresdefault.jpg"
  }
];

// Sample MDD activities with YouTube videos
const mddActivities = {
  music: [
    {
      id: 1,
      title: "School Choir",
      description: "Our award-winning choir performs regularly at school events, local competitions, and community gatherings.",
      achievements: ["National Choir Competition 2024 - 2nd Place", "East African Schools Choir Festival - Silver Medal"],
      schedule: "Monday & Wednesday, 3:30 PM - 5:00 PM",
      leadTeacher: "Ms. Nakabuye Maria",
      video: youtubeVideos[0]
    },
    {
      id: 2,
      title: "School Orchestra",
      description: "Students learn to play various instruments and perform as an ensemble in concerts and events.",
      achievements: ["Regional Music Festival - Gold Award", "National Schools Orchestra Competition - Finalists"],
      schedule: "Tuesday & Thursday, 3:30 PM - 5:00 PM",
      leadTeacher: "Mr. Kato Benjamin",
      video: youtubeVideos[1]
    },
    {
      id: 3,
      title: "Traditional Music Group",
      description: "Students learn traditional Ugandan and East African instruments and musical styles.",
      achievements: ["Cultural Heritage Festival - Best Traditional Performance", "National Cultural Competition - 1st Place"],
      schedule: "Friday, 2:00 PM - 4:00 PM",
      leadTeacher: "Mr. Ssematimba John",
      video: youtubeVideos[2]
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
      video: youtubeVideos[3]
    },
    {
      id: 2,
      title: "Contemporary Dance Club",
      description: "Students explore modern dance styles including hip hop, contemporary, and jazz dance forms.",
      achievements: ["Urban Dance Challenge - First Runner Up", "School Arts Festival - Best Choreography"],
      schedule: "Monday & Wednesday, 4:00 PM - 5:30 PM",
      leadTeacher: "Mr. Mutumba Daniel",
      video: youtubeVideos[4]
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
      video: youtubeVideos[0]
    },
    {
      id: 2,
      title: "Script Writing Workshop",
      description: "Students learn the art of script writing for plays, short films, and radio dramas.",
      achievements: ["Young Writers Competition - Best Drama Script", "National Youth Playwrights Award - Finalist"],
      schedule: "Wednesday, 3:30 PM - 5:00 PM",
      leadTeacher: "Mr. Wasswa Timothy",
      video: youtubeVideos[1]
    },
    {
      id: 3,
      title: "Technical Theater Crew",
      description: "Students learn about stage design, lighting, sound, and production management for school performances.",
      achievements: ["School Arts Fest - Best Technical Production", "National Drama Competition - Technical Excellence Award"],
      schedule: "Thursday, 3:30 PM - 5:30 PM",
      leadTeacher: "Mr. Lubega Patrick",
      video: youtubeVideos[2]
    }
  ]
};

// Video Modal Component
const VideoModal = ({ isOpen, onClose, videoId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg w-full max-w-4xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            className="w-full h-[500px]"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default function ArtsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  const openVideoModal = (videoId) => {
    setCurrentVideo(videoId);
    setModalOpen(true);
  };

  const closeVideoModal = () => {
    setModalOpen(false);
    setCurrentVideo("");
  };

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
                {mddActivities[type.id].map((activity) => (
                  <Card key={activity.id} className="overflow-hidden school-card">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative h-[200px] md:h-auto cursor-pointer" onClick={() => openVideoModal(activity.video.id)}>
                        {/* YouTube thumbnail */}
                        <div className="relative w-full h-full">
                          <Image 
                            src={activity.video.thumbnail} 
                            alt={activity.title}
                            fill
                            className="object-cover absolute inset-0"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity hover:bg-opacity-10">
                            <PlayCircle className="h-16 w-16 text-white" />
                          </div>
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
                        
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2 mt-4"
                          onClick={() => openVideoModal(activity.video.id)}
                        >
                          <PlayCircle className="h-4 w-4" /> Watch Video
                        </Button>
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

      {/* Video Modal */}
      <VideoModal 
        isOpen={modalOpen}
        onClose={closeVideoModal}
        videoId={currentVideo}
      />
    </div>
  );
}