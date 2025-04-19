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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdditionalInformationForm = () => {
  const { control, watch } = useFormContext<ApplicationFormValues>();
  const specialNeeds = watch("additional.specialNeeds");
  const healthConditions = watch("additional.healthConditions");

  const referralOptions = [
    { value: "website", label: "School Website" },
    { value: "social", label: "Social Media" },
    { value: "friend", label: "Friend/Family Referral" },
    { value: "newspaper", label: "Newspaper" },
    { value: "radio", label: "Radio" },
    { value: "event", label: "School Event/Open Day" },
    { value: "other", label: "Other" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
      <p className="text-gray-500 mb-6">
        Please provide any additional information that will help us better understand the student's needs.
      </p>

      <div className="mb-6">
        <FormField
          control={control}
          name="additional.specialNeeds"
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
                  Special Educational Needs
                </FormLabel>
                <FormDescription>
                  Does the student have any special educational needs or require specific learning support?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {specialNeeds && (
        <div className="mb-6 ml-6 p-4 border-l-2 border-gray-200">
          <FormField
            control={control}
            name="additional.specialNeedsDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Needs Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide details about the student's special educational needs"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="mb-6">
        <FormField
          control={control}
          name="additional.healthConditions"
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
                  Health Conditions
                </FormLabel>
                <FormDescription>
                  Does the student have any health conditions, allergies, or medications that the school should be aware of?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {healthConditions && (
        <div className="mb-6 ml-6 p-4 border-l-2 border-gray-200">
          <FormField
            control={control}
            name="additional.healthConditionsDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Conditions Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide details about the student's health conditions, allergies, or medications"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="mb-6">
        <FormField
          control={control}
          name="additional.howDidYouHear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How Did You Hear About Us?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {referralOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={control}
          name="additional.additionalComments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information you would like to share"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AdditionalInformationForm;