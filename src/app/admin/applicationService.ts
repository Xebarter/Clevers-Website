"use client";

import { useState, useEffect } from 'react';
import type { ApplicationFormValues } from '@/components/application/ApplicationFormProvider';

// Define the extended application with additional metadata
export interface Application extends ApplicationFormValues {
  id: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

// Sample mock data for applications
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'APP-001',
    submittedAt: '2024-03-15T09:30:00Z',
    status: 'pending',
    student: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2018-05-12',
      gender: 'male',
      nationality: 'Ugandan',
      religion: 'Christian',
    },
    guardian: {
      firstName: 'Jane',
      lastName: 'Doe',
      relationship: 'Mother',
      email: 'jane.doe@example.com',
      phone: '+256701234567',
      occupation: 'Doctor',
      address: '123 Main St, Kampala',
    },
    academic: {
      appliedGrade: 'Kindergarten',
      previousSchool: 'Little Stars Preschool',
      previousGrade: 'Preschool',
      academicRecords: true,
    },
    campusPreference: {
      campus: 'kitintale',
      admissionTerm: 'term1',
      residentialOption: 'day',
    },
    additional: {
      specialNeeds: false,
      specialNeedsDetails: '',
      healthConditions: false,
      healthConditionsDetails: '',
      howDidYouHear: 'Friend',
      additionalComments: 'Looking forward to joining',
    },
    payment: {
      method: 'mobile',
      status: 'success',
      reference: 'TRX-12345',
      transactionDate: '2024-03-15T09:25:00Z',
      paymentComplete: true,
    },
    termsAccepted: true,
  },
  {
    id: 'APP-002',
    submittedAt: '2024-03-16T14:45:00Z',
    status: 'approved',
    reviewedBy: 'admin',
    reviewedAt: '2024-03-17T10:30:00Z',
    notes: 'Excellent academic background',
    student: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '2019-02-28',
      gender: 'female',
      nationality: 'Ugandan',
      religion: 'Muslim',
    },
    guardian: {
      firstName: 'Robert',
      lastName: 'Johnson',
      relationship: 'Father',
      email: 'robert.johnson@example.com',
      phone: '+256702345678',
      occupation: 'Engineer',
      address: '456 Oak Street, Kampala',
    },
    academic: {
      appliedGrade: 'Kindergarten',
      previousSchool: 'ABC Daycare',
      previousGrade: 'Preschool',
      academicRecords: true,
    },
    campusPreference: {
      campus: 'maganjo',
      admissionTerm: 'term2',
      residentialOption: 'day',
    },
    additional: {
      specialNeeds: false,
      specialNeedsDetails: '',
      healthConditions: true,
      healthConditionsDetails: 'Mild asthma, has an inhaler',
      howDidYouHear: 'Website',
      additionalComments: '',
    },
    payment: {
      method: 'card',
      status: 'success',
      reference: 'TRX-23456',
      transactionDate: '2024-03-16T14:40:00Z',
      paymentComplete: true,
    },
    termsAccepted: true,
  },
  {
    id: 'APP-003',
    submittedAt: '2024-03-18T11:20:00Z',
    status: 'waitlisted',
    reviewedBy: 'admin',
    reviewedAt: '2024-03-19T09:15:00Z',
    notes: 'Class is currently full, waitlisted for next opening',
    student: {
      firstName: 'Michael',
      lastName: 'Okello',
      dateOfBirth: '2018-11-05',
      gender: 'male',
      nationality: 'Ugandan',
      religion: 'Christian',
    },
    guardian: {
      firstName: 'Grace',
      lastName: 'Okello',
      relationship: 'Mother',
      email: 'grace.okello@example.com',
      phone: '+256703456789',
      occupation: 'Teacher',
      address: '789 Pine Avenue, Kampala',
    },
    academic: {
      appliedGrade: 'Kindergarten',
      previousSchool: 'Sunshine Preschool',
      previousGrade: 'Preschool',
      academicRecords: true,
    },
    campusPreference: {
      campus: 'kasokoso',
      admissionTerm: 'term1',
      residentialOption: 'day',
    },
    additional: {
      specialNeeds: false,
      specialNeedsDetails: '',
      healthConditions: false,
      healthConditionsDetails: '',
      howDidYouHear: 'Social Media',
      additionalComments: '',
    },
    payment: {
      method: 'bank',
      status: 'success',
      reference: 'TRX-34567',
      transactionDate: '2024-03-18T11:10:00Z',
      paymentComplete: true,
    },
    termsAccepted: true,
  },
  {
    id: 'APP-004',
    submittedAt: '2024-03-20T13:10:00Z',
    status: 'rejected',
    reviewedBy: 'admin',
    reviewedAt: '2024-03-21T15:45:00Z',
    notes: 'Child does not meet age requirements',
    student: {
      firstName: 'Rebecca',
      lastName: 'Nakato',
      dateOfBirth: '2020-04-18',
      gender: 'female',
      nationality: 'Ugandan',
      religion: 'Christian',
    },
    guardian: {
      firstName: 'Paul',
      lastName: 'Nakato',
      relationship: 'Father',
      email: 'paul.nakato@example.com',
      phone: '+256704567890',
      occupation: 'Accountant',
      address: '101 Cedar Road, Kampala',
    },
    academic: {
      appliedGrade: 'Kindergarten',
      previousSchool: '',
      previousGrade: '',
      academicRecords: false,
    },
    campusPreference: {
      campus: 'kitintale',
      admissionTerm: 'term3',
      residentialOption: 'day',
    },
    additional: {
      specialNeeds: false,
      specialNeedsDetails: '',
      healthConditions: false,
      healthConditionsDetails: '',
      howDidYouHear: 'Newspaper',
      additionalComments: '',
    },
    payment: {
      method: 'mobile',
      status: 'success',
      reference: 'TRX-45678',
      transactionDate: '2024-03-20T13:05:00Z',
      paymentComplete: true,
    },
    termsAccepted: true,
  },
  {
    id: 'APP-005',
    submittedAt: '2024-03-22T10:05:00Z',
    status: 'pending',
    student: {
      firstName: 'David',
      lastName: 'Muzito',
      dateOfBirth: '2018-08-30',
      gender: 'male',
      nationality: 'Ugandan',
      religion: 'Christian',
    },
    guardian: {
      firstName: 'Elizabeth',
      lastName: 'Muzito',
      relationship: 'Mother',
      email: 'elizabeth.muzito@example.com',
      phone: '+256705678901',
      occupation: 'Business Owner',
      address: '202 Maple Lane, Kampala',
    },
    academic: {
      appliedGrade: 'Kindergarten',
      previousSchool: 'Happy Kids Daycare',
      previousGrade: 'Preschool',
      academicRecords: true,
    },
    campusPreference: {
      campus: 'maganjo',
      admissionTerm: 'term1',
      residentialOption: 'day',
    },
    additional: {
      specialNeeds: true,
      specialNeedsDetails: 'Mild speech delay, currently in therapy',
      healthConditions: false,
      healthConditionsDetails: '',
      howDidYouHear: 'Friend',
      additionalComments: 'Would need speech therapy support',
    },
    payment: {
      method: 'bank',
      status: 'success',
      reference: 'TRX-56789',
      transactionDate: '2024-03-22T10:00:00Z',
      paymentComplete: true,
    },
    termsAccepted: true,
  }
];

// Hook to manage applications data
export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const loadApplications = () => {
      // Check if we have stored applications in localStorage
      const storedApps = localStorage.getItem('applications');
      if (storedApps) {
        try {
          setApplications(JSON.parse(storedApps));
        } catch (e) {
          console.error("Error parsing stored applications", e);
          // Fallback to mock data
          setApplications(MOCK_APPLICATIONS);
          localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
        }
      } else {
        // Initialize with mock data
        setApplications(MOCK_APPLICATIONS);
        localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
      }
      setIsLoading(false);
    };

    loadApplications();
  }, []);

  // Function to update application status
  const updateApplicationStatus = (id: string, status: Application['status'], notes?: string) => {
    const updatedApplications = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status,
          reviewedBy: 'admin', // Using fixed value for simplicity
          reviewedAt: new Date().toISOString(),
          notes: notes || app.notes
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    return true;
  };

  // Function to add notes to an application
  const addApplicationNotes = (id: string, notes: string) => {
    const updatedApplications = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          notes
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    return true;
  };

  // Function to delete an application
  const deleteApplication = (id: string) => {
    const updatedApplications = applications.filter(app => app.id !== id);
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    return true;
  };

  return {
    applications,
    isLoading,
    updateApplicationStatus,
    addApplicationNotes,
    deleteApplication
  };
}
