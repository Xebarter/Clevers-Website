"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Clock
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const phoneNumber = "+256772470972";
  const emailAddress = "admissions@cleversorigin.edu";

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="flex items-center mr-2">
                <div className="h-4 w-4 rounded-full bg-school-red" />
                <div className="h-4 w-4 rounded-full bg-school-blue -ml-1" />
                <div className="h-4 w-4 rounded-full bg-school-green -ml-1" />
              </div>
              Clevers' Origin Schools
            </h3>
            <p className="text-gray-300 mb-4">
              Nurturing young minds with creativity, knowledge, and values
              across our three vibrant campuses in Kitintale, Kasokoso, and Maganjo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/academics/programs" className="text-gray-300 hover:text-white">
                  Academic Programs
                </Link>
              </li>
              <li>
                <Link href="/student-life/activities" className="text-gray-300 hover:text-white">
                  Student Activities
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-gray-300 hover:text-white">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Campuses */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Campuses</h3>
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-2 text-school-red">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Kitintale Campus</p>
                  <p className="text-gray-300">Plot 123, Kitintale Road, Kampala</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2 text-school-blue">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Kasokoso Campus</p>
                  <p className="text-gray-300">Plot 456, Kasokoso Avenue, Kampala</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2 text-school-green">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Maganjo Campus</p>
                  <p className="text-gray-300">Plot 789, Maganjo Road, Kampala</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <a href={`tel:${phoneNumber}`} className="text-white hover:text-gray-300">
                  {phoneNumber}
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${emailAddress}`} className="text-white hover:text-gray-300">
                  {emailAddress}
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Office Hours:</p>
                  <p className="text-gray-300">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p className="text-gray-300">Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Clevers' Origin Schools. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/sitemap" className="text-gray-300 hover:text-white text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;