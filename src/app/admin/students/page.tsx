"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, UserPlus, School, GraduationCap, User, Calendar } from "lucide-react";
import { useApplications, Application } from '../applicationService';

// Student interface (derived from application data)
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  campus: string;
  grade: string;
  enrollmentDate: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
}

export default function StudentsPage() {
  const { applications, isLoading } = useApplications();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState<string>('all');

  // Transform approved applications into students
  useEffect(() => {
    if (!applications) return;

    // Only include approved applications
    const approvedApplications = applications.filter(app => app.status === 'approved');

    // Transform applications into students
    const transformedStudents = approvedApplications.map(app => {
      return {
        id: app.id,
        firstName: app.student.firstName,
        lastName: app.student.lastName,
        dateOfBirth: app.student.dateOfBirth,
        gender: app.student.gender,
        campus: app.campusPreference.campus,
        grade: app.academic.appliedGrade,
        enrollmentDate: app.reviewedAt || app.submittedAt,
        guardianName: `${app.guardian.firstName} ${app.guardian.lastName}`,
        guardianEmail: app.guardian.email,
        guardianPhone: app.guardian.phone
      };
    });

    setStudents(transformedStudents);
    setFilteredStudents(transformedStudents);
  }, [applications]);

  // Filter students based on search term and campus filter
  useEffect(() => {
    if (!students.length) return;

    let filtered = [...students];

    // Apply campus filter
    if (campusFilter !== 'all') {
      filtered = filtered.filter(student => student.campus === campusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.guardianName.toLowerCase().includes(term) ||
        student.grade.toLowerCase().includes(term)
      );
    }

    // Sort by name
    filtered.sort((a, b) => {
      if (a.lastName < b.lastName) return -1;
      if (a.lastName > b.lastName) return 1;
      return a.firstName.localeCompare(b.firstName);
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, campusFilter]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get campus badge
  const getCampusBadge = (campus: string) => {
    switch (campus) {
      case 'kitintale':
        return <Badge className="bg-kinder-blue/10 text-kinder-blue border border-kinder-blue/30">
          Kitintale
        </Badge>;
      case 'kasokoso':
        return <Badge className="bg-kinder-red/10 text-kinder-red border border-kinder-red/30">
          Kasokoso
        </Badge>;
      case 'maganjo':
        return <Badge className="bg-kinder-green/10 text-kinder-green border border-kinder-green/30">
          Maganjo
        </Badge>;
      default:
        return <Badge variant="outline">{campus}</Badge>;
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
          <Users className="mr-2 h-6 w-6" />
          Student Management
        </h1>
        <p className="text-gray-600 font-body">
          View and manage enrolled students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-kinder-blue/5 border-kinder-blue/20">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Total Students</p>
              <p className="text-2xl font-bold font-heading text-kinder-blue">{students.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-kinder-blue/20 flex items-center justify-center text-kinder-blue">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-kinder-green/5 border-kinder-green/20">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Campuses</p>
              <p className="text-2xl font-bold font-heading text-kinder-green">3</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-kinder-green/20 flex items-center justify-center text-kinder-green">
              <School className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-kinder-purple/5 border-kinder-purple/20">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Grade Levels</p>
              <p className="text-2xl font-bold font-heading text-kinder-purple">Kindergarten</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-kinder-purple/20 flex items-center justify-center text-kinder-purple">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by name, grade, or guardian..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={campusFilter === 'all' ? 'default' : 'outline'}
            className="gap-2 whitespace-nowrap"
            onClick={() => setCampusFilter('all')}
          >
            All Campuses
          </Button>
          <Button
            variant={campusFilter === 'kitintale' ? 'default' : 'outline'}
            className="gap-2 whitespace-nowrap"
            onClick={() => setCampusFilter('kitintale')}
          >
            Kitintale
          </Button>
          <Button
            variant={campusFilter === 'kasokoso' ? 'default' : 'outline'}
            className="gap-2 whitespace-nowrap"
            onClick={() => setCampusFilter('kasokoso')}
          >
            Kasokoso
          </Button>
          <Button
            variant={campusFilter === 'maganjo' ? 'default' : 'outline'}
            className="gap-2 whitespace-nowrap"
            onClick={() => setCampusFilter('maganjo')}
          >
            Maganjo
          </Button>
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200">
        {filteredStudents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div>
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 font-heading mb-1">No students found</h3>
              <p className="text-gray-500 font-body">
                {searchTerm || campusFilter !== 'all' ?
                  'Try adjusting your search or filters' :
                  'There are no enrolled students yet'}
              </p>
              {students.length === 0 && (
                <Button className="mt-4 gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add First Student
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Campus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Guardian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Enrollment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-kinder-blue/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-kinder-blue" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-heading">{student.firstName} {student.lastName}</div>
                          <div className="text-xs text-gray-500 font-body capitalize">{student.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium font-body">{calculateAge(student.dateOfBirth)} years</div>
                      <div className="text-xs text-gray-500 font-body">{formatDate(student.dateOfBirth)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCampusBadge(student.campus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium font-body">{student.grade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-body">{student.guardianName}</div>
                      <div className="text-xs text-kinder-blue font-body">{student.guardianEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-body flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(student.enrollmentDate)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
