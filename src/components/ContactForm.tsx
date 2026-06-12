"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We've received your message and will get back to you soon.",
        });
        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        // Attempt to read server error details for debugging
        let errBody = null;
        try {
          errBody = await response.json();
        } catch (e) {
          // ignore json parse errors
        }
        console.error('submit-message failed', response.status, errBody);
        throw new Error(errBody?.error || 'Failed to submit message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-700">
            Your Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="h-10 border-gray-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-10 border-gray-200"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block mb-1.5 text-sm font-medium text-gray-700">
            Subject
          </label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What is this regarding?"
            required
            className="h-10 border-gray-200"
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-1.5 text-sm font-medium text-gray-700">
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
            required
            className="min-h-[120px] border-gray-200 resize-y"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 text-white mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}