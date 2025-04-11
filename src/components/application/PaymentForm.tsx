"use client";

import React, { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Phone, CheckCircle2, Loader2, Sparkles, PartyPopper } from "lucide-react";

// Reusable Payment Method Option component
const PaymentMethodOption = ({ value, selectedValue, icon: Icon, title, description, color }) => (
  <div className={`border-2 rounded-xl p-4 transition-all duration-300 ${selectedValue === value ? `border-${color} bg-${color}/5` : "border-gray-200"}`}>
    <FormItem className="flex items-start space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem value={value} className="kinder-radio" />
      </FormControl>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 text-${color}`} />
        <div>
          <FormLabel className="font-heading text-base font-medium">{title}</FormLabel>
          <p className="text-sm text-gray-600 font-body">{description}</p>
        </div>
      </div>
    </FormItem>
  </div>
);

// Reusable Payment Detail Field component
const PaymentDetailField = ({ label, value, className = "" }) => (
  <div className={`flex justify-between font-body ${className}`}>
    <span className="text-gray-600">{label}:</span>
    <span className={`font-medium ${className}`}>{value}</span>
  </div>
);

// Payment Success Card component
const PaymentSuccessCard = ({ paymentMethod, reference }) => (
  <Card className="border-4 border-kinder-green/40 bg-kinder-green/10 rounded-2xl shadow-md overflow-hidden">
    <CardHeader className="pb-4 bg-kinder-green/20">
      <div className="flex items-center gap-3">
        <PartyPopper className="h-7 w-7 text-kinder-green" />
        <CardTitle className="font-heading text-kinder-blue text-xl">Payment Successful!</CardTitle>
      </div>
      <CardDescription className="font-body text-base text-gray-700">
        Hooray! Your application fee payment has been processed successfully.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3 py-3">
        <PaymentDetailField label="Amount" value="UGX 50,000" className="text-kinder-green" />
        <PaymentDetailField
          label="Payment Method"
          value={paymentMethod === "card" ? "Credit/Debit Card" :
                 paymentMethod === "mobile" ? "Mobile Money" : "Bank Transfer"}
        />
        <PaymentDetailField label="Reference" value={reference} />
        <PaymentDetailField label="Date" value={new Date().toLocaleDateString()} />
      </div>
    </CardContent>
    <CardFooter className="bg-kinder-green/20 flex justify-center pt-4">
      <p className="text-kinder-green font-medium text-center font-body">
        You can now proceed to review and submit your application! 🎉
      </p>
    </CardFooter>
  </Card>
);

// Component for Payment Action Button
const PaymentActionButton = ({ onClick, status, color, text }) => (
  <Button
    onClick={onClick}
    disabled={status === "processing"}
    className={`kinder-button bg-${color} border-${color === 'kinder-red' ? 'red' : color === 'kinder-purple' ? 'purple' : 'green'}-600 hover:bg-${color}/90 hover:border-${color === 'kinder-red' ? 'red' : color === 'kinder-purple' ? 'purple' : 'green'}-700`}
  >
    {status === "processing" ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {color === 'kinder-green' ? 'Verifying...' : 'Processing...'}
      </>
    ) : (
      text
    )}
  </Button>
);

const PaymentForm = () => {
  const { control, setValue, watch, getValues } = useFormContext<ApplicationFormValues>();
  const paymentMethod = watch("payment.method");
  const paymentStatus = watch("payment.status");
  const paymentComplete = watch("payment.paymentComplete");

  useEffect(() => {
    // Initialize reference number when first loaded
    if (!getValues("payment.reference")) {
      setValue("payment.reference", `APP-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [setValue, getValues]);

  const handlePaymentSubmit = () => {
    // Set processing state
    setValue("payment.status", "processing");

    // Simulate payment processing
    setTimeout(() => {
      // Set success state and complete flag
      setValue("payment.status", "success");
      setValue("payment.paymentComplete", true);
      setValue("payment.transactionDate", new Date().toISOString());
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-heading text-kinder-blue mb-4 flex items-center">
        <Sparkles className="mr-3 text-kinder-yellow h-7 w-7" />
        Application Fee Payment
      </h2>

      <div className="bg-kinder-yellow/20 border-2 border-kinder-yellow rounded-2xl p-6 mb-6">
        <h3 className="font-heading font-bold text-kinder-blue mb-3 flex items-center">
          <CreditCard className="mr-2 h-5 w-5 text-kinder-orange" />
          Application Fee
        </h3>
        <p className="text-gray-700 mb-2 font-body">
          A non-refundable application fee of <span className="font-bold text-kinder-red">UGX 50,000</span> is required to process your application.
        </p>
        <p className="text-sm text-gray-600 font-body">
          This fee covers administrative costs associated with processing your application. The fee is non-refundable even if the application is not accepted.
        </p>
      </div>

      {paymentStatus === "success" ? (
        <PaymentSuccessCard paymentMethod={paymentMethod} reference={getValues("payment.reference")} />
      ) : (
        <div className="space-y-6">
          <FormField
            control={control}
            name="payment.method"
            render={({ field }) => (
              <Card className="rounded-2xl border-2 border-kinder-blue/20 shadow-md overflow-hidden">
                <CardHeader className="bg-kinder-blue/10">
                  <CardTitle className="text-lg font-heading text-kinder-blue flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-kinder-blue" />
                    Select Payment Method
                  </CardTitle>
                  <CardDescription className="font-body">
                    Choose your preferred method to pay the application fee
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-4"
                  >
                    <PaymentMethodOption
                      value="mobile"
                      selectedValue={field.value}
                      icon={Phone}
                      title="Mobile Money"
                      description="MTN Mobile Money or Airtel Money"
                      color="kinder-purple"
                    />
                    <PaymentMethodOption
                      value="card"
                      selectedValue={field.value}
                      icon={CreditCard}
                      title="Credit/Debit Card"
                      description="Visa, Mastercard, or other major cards"
                      color="kinder-red"
                    />
                    <PaymentMethodOption
                      value="bank"
                      selectedValue={field.value}
                      icon={Wallet}
                      title="Bank Transfer"
                      description="Direct bank deposit or transfer"
                      color="kinder-green"
                    />
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
          />

          {/* Payment details based on selected method */}
          {paymentMethod === "mobile" && (
            <Card className="rounded-2xl border-2 border-kinder-purple/20 shadow-md overflow-hidden">
              <CardHeader className="bg-kinder-purple/10">
                <CardTitle className="text-lg font-heading text-kinder-purple flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-kinder-purple" />
                  Mobile Money Payment
                </CardTitle>
                <CardDescription className="font-body">
                  Enter your mobile money details to complete the payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <FormLabel className="font-heading text-gray-700">Mobile Money Provider</FormLabel>
                    <select className="kinder-select w-full font-body">
                      <option>MTN Mobile Money</option>
                      <option>Airtel Money</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <FormLabel className="font-heading text-gray-700">Phone Number</FormLabel>
                    <Input type="tel" placeholder="07XX XXX XXX" className="kinder-input font-body" />
                    <p className="text-xs text-gray-500 font-body">Format: 07XXXXXXXX</p>
                  </div>
                </div>

                <div className="pt-4">
                  <FormItem className="flex space-x-3">
                    <FormControl>
                      <Checkbox className="kinder-checkbox" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-body text-gray-700">
                        I confirm that I am authorized to use this mobile money account
                      </FormLabel>
                    </div>
                  </FormItem>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-5 bg-kinder-purple/5">
                <p className="text-gray-700 font-body">Amount: <span className="font-bold text-kinder-purple">UGX 50,000</span></p>
                <PaymentActionButton
                  onClick={handlePaymentSubmit}
                  status={paymentStatus}
                  color="kinder-purple"
                  text="Pay Now"
                />
              </CardFooter>
            </Card>
          )}

          {paymentMethod === "card" && (
            <Card className="rounded-2xl border-2 border-kinder-red/20 shadow-md overflow-hidden">
              <CardHeader className="bg-kinder-red/10">
                <CardTitle className="text-lg font-heading text-kinder-red flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-kinder-red" />
                  Card Payment
                </CardTitle>
                <CardDescription className="font-body">
                  Enter your card details to complete the payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-3">
                  <FormLabel className="font-heading text-gray-700">Card Number</FormLabel>
                  <Input type="text" placeholder="XXXX XXXX XXXX XXXX" className="kinder-input font-body" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <FormLabel className="font-heading text-gray-700">Expiry Date</FormLabel>
                    <Input type="text" placeholder="MM/YY" className="kinder-input font-body" />
                  </div>

                  <div className="space-y-2">
                    <FormLabel className="font-heading text-gray-700">CVC</FormLabel>
                    <Input type="text" placeholder="XXX" className="kinder-input font-body" />
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel className="font-heading text-gray-700">Cardholder Name</FormLabel>
                  <Input type="text" placeholder="Name on card" className="kinder-input font-body" />
                </div>

                <div className="pt-4">
                  <FormItem className="flex space-x-3">
                    <FormControl>
                      <Checkbox className="kinder-checkbox" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-body text-gray-700">
                        Save this card for future payments
                      </FormLabel>
                    </div>
                  </FormItem>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-5 bg-kinder-red/5">
                <p className="text-gray-700 font-body">Amount: <span className="font-bold text-kinder-red">UGX 50,000</span></p>
                <PaymentActionButton
                  onClick={handlePaymentSubmit}
                  status={paymentStatus}
                  color="kinder-red"
                  text="Pay Now"
                />
              </CardFooter>
            </Card>
          )}

          {paymentMethod === "bank" && (
            <Card className="rounded-2xl border-2 border-kinder-green/20 shadow-md overflow-hidden">
              <CardHeader className="bg-kinder-green/10">
                <CardTitle className="text-lg font-heading text-kinder-green flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-kinder-green" />
                  Bank Transfer Details
                </CardTitle>
                <CardDescription className="font-body">
                  Please transfer the application fee to the following bank account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="bg-gray-50 p-5 rounded-xl space-y-3 border border-kinder-green/20">
                  <PaymentDetailField label="Bank Name" value="Stanbic Bank Uganda" />
                  <PaymentDetailField label="Account Name" value="Clevers' Origin Schools" />
                  <PaymentDetailField label="Account Number" value="0123456789" />
                  <PaymentDetailField label="Branch" value="Main Branch, Kampala" />
                  <PaymentDetailField label="Reference" value="Application Fee - [Student Name]" />
                  <PaymentDetailField label="Amount" value="UGX 50,000" className="text-kinder-green" />
                </div>

                <div className="pt-4">
                  <FormItem className="flex space-x-3">
                    <FormControl>
                      <Checkbox className="kinder-checkbox" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-body text-gray-700">
                        I have completed the bank transfer
                      </FormLabel>
                    </div>
                  </FormItem>
                </div>

                <div className="space-y-2">
                  <FormLabel className="font-heading text-gray-700">Transaction Reference</FormLabel>
                  <Input type="text" placeholder="Enter bank transaction reference" className="kinder-input font-body" />
                  <p className="text-xs text-gray-500 font-body">Please enter the reference number from your bank transfer</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-5 bg-kinder-green/5">
                <p className="text-gray-700 font-body">Amount: <span className="font-bold text-kinder-green">UGX 50,000</span></p>
                <PaymentActionButton
                  onClick={handlePaymentSubmit}
                  status={paymentStatus}
                  color="kinder-green"
                  text="Confirm Payment"
                />
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
