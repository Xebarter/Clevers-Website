"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "./ApplicationFormProvider";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const AcademicInformationForm = () => {
  const { control } = useFormContext<ApplicationFormValues>();

  const gradeOptions = [
    { value: "p1", label: "Primary 1" },
    { value: "p2", label: "Primary 2" },
    { value: "p3", label: "Primary 3" },
    { value: "p4", label: "Primary 4" },
    { value: "p5", label: "Primary 5" },
    { value: "p6", label: "Primary 6" },
    { value: "p7", label: "Primary 7" },
    { value: "s1", label: "Secondary 1" },
    { value: "s2", label: "Secondary 2" },
    { value: "s3", label: "Secondary 3" },
    { value: "s4", label: "Secondary 4" },
    { value: "s5", label: "Secondary 5" },
    { value: "s6", label: "Secondary 6" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Academic Information</h2>
      <p className="text-gray-500 mb-6">
        Please provide details about the student's academic background and the grade applying for.
      </p>

      <div className="mb-6">
        <FormField
          control={control}
          name="academic.appliedGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Applying For</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gradeOptions.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the grade the student will be joining.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="academic.previousSchool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous School (if any)</FormLabel>
              <FormControl>
                <Input placeholder="Previous school name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="academic.previousGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Grade (if any)</FormLabel>
              <FormControl>
                <Input placeholder="Previous grade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormField
          control={control}
          name="academic.academicRecords"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Academic Records Available
                </FormLabel>
                <FormDescription>
                  Check this if you have the student's previous academic records and transcripts available for submission.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AcademicInformationForm;
