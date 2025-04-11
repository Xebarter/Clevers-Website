"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "./ApplicationFormProvider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const GuardianInformationForm = () => {
  const { control } = useFormContext<ApplicationFormValues>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Parent/Guardian Information</h2>
      <p className="text-gray-500 mb-6">
        Please provide contact information for the primary parent or guardian.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="guardian.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="guardian.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormField
          control={control}
          name="guardian.relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship to Student</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mother, Father, Guardian" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormField
          control={control}
          name="guardian.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="guardian.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormField
          control={control}
          name="guardian.occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Occupation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormField
          control={control}
          name="guardian.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Address</FormLabel>
              <FormControl>
                <Input placeholder="Full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GuardianInformationForm;
