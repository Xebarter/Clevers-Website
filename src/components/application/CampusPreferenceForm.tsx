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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

const CampusPreferenceForm = () => {
  const { control } = useFormContext<ApplicationFormValues>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Campus Preference</h2>
      <p className="text-gray-500 mb-6">
        Please select your preferred campus, admission term, and residential option.
      </p>

      <div className="mb-8">
        <FormField
          control={control}
          name="campusPreference.campus"
          render={({ field }) => (
            <FormItem className="space-y-5">
              <FormLabel>Campus</FormLabel>
              <FormDescription>
                Choose the campus you would like the student to attend.
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <Card className="border-2 border-red-200 hover:border-red-500 p-4 cursor-pointer transition-all data-[state=checked]:border-red-500 data-[state=checked]:bg-red-50">
                        <RadioGroupItem
                          value="kitintale"
                          id="kitintale"
                          className="sr-only"
                        />
                        <FormLabel
                          htmlFor="kitintale"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <span className="h-3 w-20 bg-red-500 mb-3 rounded-full"></span>
                          <span className="font-bold">Kitintale Campus</span>
                          <span className="text-xs text-gray-500 text-center mt-1">
                            Our flagship campus with comprehensive facilities
                          </span>
                        </FormLabel>
                      </Card>
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormControl>
                      <Card className="border-2 border-blue-200 hover:border-blue-500 p-4 cursor-pointer transition-all data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50">
                        <RadioGroupItem
                          value="kasokoso"
                          id="kasokoso"
                          className="sr-only"
                        />
                        <FormLabel
                          htmlFor="kasokoso"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <span className="h-3 w-20 bg-blue-500 mb-3 rounded-full"></span>
                          <span className="font-bold">Kasokoso Campus</span>
                          <span className="text-xs text-gray-500 text-center mt-1">
                            Known for arts and sports excellence
                          </span>
                        </FormLabel>
                      </Card>
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormControl>
                      <Card className="border-2 border-green-200 hover:border-green-500 p-4 cursor-pointer transition-all data-[state=checked]:border-green-500 data-[state=checked]:bg-green-50">
                        <RadioGroupItem
                          value="maganjo"
                          id="maganjo"
                          className="sr-only"
                        />
                        <FormLabel
                          htmlFor="maganjo"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <span className="h-3 w-20 bg-green-500 mb-3 rounded-full"></span>
                          <span className="font-bold">Maganjo Campus</span>
                          <span className="text-xs text-gray-500 text-center mt-1">
                            Our newest campus with focus on technology
                          </span>
                        </FormLabel>
                      </Card>
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mb-8">
        <FormField
          control={control}
          name="campusPreference.admissionTerm"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Admission Term</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="term1" />
                    </FormControl>
                    <FormLabel className="font-normal">Term 1 (January-April)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="term2" />
                    </FormControl>
                    <FormLabel className="font-normal">Term 2 (May-August)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="term3" />
                    </FormControl>
                    <FormLabel className="font-normal">Term 3 (September-December)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={control}
          name="campusPreference.residentialOption"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Residential Option</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="day" />
                    </FormControl>
                    <FormLabel className="font-normal">Day Scholar</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="boarding" />
                    </FormControl>
                    <FormLabel className="font-normal">Boarding Student</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CampusPreferenceForm;
