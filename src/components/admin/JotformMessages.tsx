"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ExternalLink } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function JotformMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch messages from Jotform API
    // For now, we'll use mock data
    const fetchMessages = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockMessages: Message[] = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            subject: "Admission Inquiry",
            message: "I would like to know more about the admission process for the upcoming academic year.",
            createdAt: "2023-06-15T10:30:00Z"
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            subject: "Tuition Fees",
            message: "Could you please provide information about the tuition fees for primary school?",
            createdAt: "2023-06-14T14:45:00Z"
          },
          {
            id: "3",
            name: "Robert Johnson",
            email: "robert@example.com",
            subject: "Campus Tour",
            message: "When can we schedule a campus tour for our family?",
            createdAt: "2023-06-13T09:15:00Z"
          }
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button asChild>
          <a 
            href="https://www.jotform.com/myforms/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" /> View in Jotform
          </a>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Contact Form Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : messages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Subject</th>
                    <th className="text-left py-3 px-2">Message</th>
                    <th className="text-left py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{msg.name}</td>
                      <td className="py-3 px-2">
                        <a 
                          href={`mailto:${msg.email}`} 
                          className="text-blue-500 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </td>
                      <td className="py-3 px-2">{msg.subject}</td>
                      <td className="py-3 px-2 max-w-xs line-clamp-2">{msg.message}</td>
                      <td className="py-3 px-2">{formatDate(msg.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No messages found
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Jotform Integration</h3>
        <p className="text-sm text-blue-700">
          Messages are managed through Jotform. Click "View in Jotform" to access the full message management interface.
        </p>
      </div>
    </div>
  );
}