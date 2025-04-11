"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Users, ArrowRight, Book, Star } from "lucide-react";

// Define campus data
const campuses = [
  {
    id: "kitintale",
    name: "Kitintale Campus",
    color: "school-red",
    address: "Plot 123, Kitintale Road, Kampala",
    phone: "+256 750 123456",
    description: "Our flagship campus with state-of-the-art facilities including a swimming pool, science labs, and a performing arts center.",
    highlightColor: "from-red-500/20 to-transparent",
    badgeColor: "bg-red-100 text-red-800",
    keyFeatures: [
      { icon: Users, label: "1,200 Students" },
      { icon: Book, label: "Nursery to High School" },
      { icon: Star, label: "STEM Excellence Program" },
    ],
  },
  {
    id: "kasokoso",
    name: "Kasokoso Campus",
    color: "school-blue",
    address: "Plot 456, Kasokoso Avenue, Kampala",
    phone: "+256 750 789012",
    description: "A modern campus with a focus on performing arts and humanities, featuring a 500-seat auditorium and art studios.",
    highlightColor: "from-blue-500/20 to-transparent",
    badgeColor: "bg-blue-100 text-blue-800",
    keyFeatures: [
      { icon: Users, label: "800 Students" },
      { icon: Book, label: "Primary to Middle School" },
      { icon: Star, label: "Arts & Humanities Focus" },
    ],
  },
  {
    id: "maganjo",
    name: "Maganjo Campus",
    color: "school-green",
    address: "Plot 789, Maganjo Road, Kampala",
    phone: "+256 750 345678",
    description: "Our newest campus with innovative learning spaces, sports facilities, and a focus on technology and entrepreneurship.",
    highlightColor: "from-green-500/20 to-transparent",
    badgeColor: "bg-green-100 text-green-800",
    keyFeatures: [
      { icon: Users, label: "650 Students" },
      { icon: Book, label: "Nursery to High School" },
      { icon: Star, label: "Innovation Hub" },
    ],
  },
];

const CampusShowcase = () => {
  const [activeTab, setActiveTab] = useState<string>(campuses[0].id);

  return (
    <Tabs defaultValue={campuses[0].id} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full mb-8 grid grid-cols-3 h-auto p-1">
        {campuses.map((campus) => (
          <TabsTrigger
            key={campus.id}
            value={campus.id}
            className={`data-[state=active]:border-b-2 data-[state=active]:border-${campus.color} py-3 px-4`}
          >
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full bg-${campus.color} mx-auto mb-2`} />
              <span className="font-semibold">{campus.name}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {campuses.map((campus) => (
        <TabsContent key={campus.id} value={campus.id} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
              {/* Placeholder for campus image - will be replaced with actual image */}
              <div className={`absolute inset-0 bg-gradient-to-b ${campus.highlightColor}`} />
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                {campus.name} Photo
              </div>
            </div>

            <Card>
              <CardHeader>
                <Badge className={campus.badgeColor}>{campus.name}</Badge>
                <CardTitle className="text-2xl mt-2">About {campus.name}</CardTitle>
                <CardDescription className="text-base">
                  {campus.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className={`h-5 w-5 mr-3 text-${campus.color} flex-shrink-0 mt-0.5`} />
                    <span>{campus.address}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className={`h-5 w-5 mr-3 text-${campus.color} flex-shrink-0 mt-0.5`} />
                    <span>{campus.phone}</span>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {campus.keyFeatures.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                          <div key={idx} className="flex items-center">
                            <Icon className={`h-5 w-5 mr-2 text-${campus.color}`} />
                            <span>{feature.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/campus/${campus.id}`}>
                  <Button className="gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CampusShowcase;
