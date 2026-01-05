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
    <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/20">
      <h3 className="text-xl font-bold mb-6 font-heading text-kinder-blue">
        Send Us a Message
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 font-body text-gray-700">
            Your Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="kinder-input w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-body text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="kinder-input w-full"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block mb-2 font-body text-gray-700">
            Subject
          </label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What is this regarding?"
            required
            className="kinder-input w-full"
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-2 font-body text-gray-700">
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
            required
            className="kinder-input w-full h-32"
          />
        </div>

        <Button
          type="submit"
          className="w-full kinder-button mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}