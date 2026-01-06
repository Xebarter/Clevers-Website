"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Video,
  Mic
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const phoneNumber = "+256 772470972";
  const telNumber = "+256772470972";
  const emailAddress = "cleversorigin@gmail.com";

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
              {/* Official WhatsApp Icon */}
              <a href="https://wa.me/256762494822" className="text-gray-300 hover:text-white" title="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
              {/* Official TikTok Icon */}
              <a href="https://www.tiktok.com/@cleversorigin?is_from_webapp=1&sender_device=pc" className="text-gray-300 hover:text-white" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.9-.23-2.74.12-1.17.44-2.01 1.5-2.14 2.76-.12 1.25.47 2.48 1.46 3.19.85.64 1.95.83 2.99.52 1.36-.36 2.31-1.63 2.39-3.03.01-4.63.01-9.26 0-13.88z" />
                </svg>
              </a>
              {/* Official Instagram Icon */}
              <a href="https://www.instagram.com/cleversorigin?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-gray-300 hover:text-white" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Official YouTube Icon */}
              <a href="https://www.youtube.com/@CLEVERS5" className="text-gray-300 hover:text-white" title="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
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
                <Link href="/campus/kitintale" className="text-gray-300 hover:text-white">
                  Kitintale Campus
                </Link>
              </li>
              <li>
                <Link href="/campus/kasokoso" className="text-gray-300 hover:text-white">
                  Kasokoso Campus
                </Link>
              </li>
              <li>
                <Link href="/campus/maganjo" className="text-gray-300 hover:text-white">
                  Maganjo Campus
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
                  <p className="text-gray-300">Along Kunya Road, Nakawa, Kampala</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2 text-school-blue">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Kasokoso Campus</p>
                  <p className="text-gray-300">Kireka, Kasokoso, Wakiso District</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2 text-school-green">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Maganjo Campus</p>
                  <p className="text-gray-300">Maganjo, Along Bombo Road</p>
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
                <a href={`tel:${telNumber}`} className="text-white hover:text-gray-300">
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