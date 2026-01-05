import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  Trash2, 
  Mail, 
  User, 
  Calendar,
  MessageSquare 
} from "lucide-react";
import { 
  getMessages, 
  deleteMessage, 
  updateMessage 
} from "@/lib/admin/services";

interface Message {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
}

interface MessageModalProps {
  message: Message | null;
  open: boolean;
  onClose: () => void;
}

const MessageModal = ({ message, open, onClose }: MessageModalProps) => {
  if (!open || !message) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Message Details</h3>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">From</h4>
              <p className="font-medium">{message.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="font-medium">{message.email}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Subject</h4>
              <p className="font-medium">{message.subject}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date</h4>
              <p className="font-medium">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Message</h4>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                <p className="whitespace-pre-line">{message.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      setDeletingId(id);
      await deleteMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateMessage(id, { read: true });
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Failed to mark message as read");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : messages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">From</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Subject</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr 
                      key={message.id} 
                      className={`border-b hover:bg-gray-50 ${!message.read ? 'bg-blue-50' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{message.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{message.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">{message.subject}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{new Date(message.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            message.read 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {message.read ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {!message.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(message.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(message.id)}
                            disabled={deletingId === message.id}
                          >
                            {deletingId === message.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border border-gray-500 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No messages found
            </div>
          )}
        </CardContent>
      </Card>
      
      <MessageModal 
        message={selectedMessage} 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}