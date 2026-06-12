"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Trash2,
  Mail,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import {
  getMessages,
  deleteMessage,
  updateMessage,
} from "@/lib/admin/services";
import {
  AdminEmptyState,
  AdminIconButton,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatusBadge,
  AdminTableWrapper,
  adminTdClassName,
  adminThClassName,
  adminTrClassName,
} from "@/components/admin/admin-ui";
import AdminConfirmDialog, { type AdminConfirmState } from "@/components/admin/AdminConfirmDialog";
import { adminToast } from "@/lib/admin/notify";

interface Message {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<AdminConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      adminToast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete message",
      description: "This message will be permanently removed from your inbox.",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          setDeletingId(id);
          await deleteMessage(id);
          setMessages((prev) => prev.filter((msg) => msg.id !== id));
          adminToast.success("Message deleted");
        } catch (error) {
          console.error("Error deleting message:", error);
          adminToast.error("Failed to delete message");
        } finally {
          setDeletingId(null);
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleMarkAsRead = async (id: string, silent = false) => {
    try {
      await updateMessage(id, { read: true });
      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)));
      if (!silent) adminToast.success("Marked as read");
    } catch (error) {
      console.error("Error updating message:", error);
      adminToast.error("Failed to mark message as read");
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    setShowModal(true);
    if (!message.read) {
      handleMarkAsRead(message.id, true);
    }
  };

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Messages"
        description="Review contact form submissions from the website."
      />

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          {loading ? (
            <AdminLoadingState message="Loading messages..." />
          ) : messages.length > 0 ? (
            <AdminTableWrapper>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className={adminThClassName()}>From</th>
                    <th className={adminThClassName()}>Email</th>
                    <th className={adminThClassName()}>Subject</th>
                    <th className={adminThClassName()}>Date</th>
                    <th className={adminThClassName()}>Status</th>
                    <th className={adminThClassName()}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className={`${adminTrClassName()} ${!message.read ? "bg-amber-50/50" : ""}`}
                    >
                      <td className={adminTdClassName()}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{message.name}</span>
                        </div>
                      </td>
                      <td className={adminTdClassName()}>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span>{message.email}</span>
                        </div>
                      </td>
                      <td className={`${adminTdClassName()} max-w-xs truncate`}>{message.subject}</td>
                      <td className={adminTdClassName()}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{new Date(message.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className={adminTdClassName()}>
                        <AdminStatusBadge
                          label={message.read ? "Read" : "Unread"}
                          tone={message.read ? "success" : "warning"}
                        />
                      </td>
                      <td className={adminTdClassName()}>
                        <div className="flex gap-1">
                          <AdminIconButton label="View message" onClick={() => openMessage(message)}>
                            <Eye className="h-4 w-4" />
                          </AdminIconButton>
                          <AdminIconButton
                            label="Delete message"
                            variant="danger"
                            disabled={deletingId === message.id}
                            onClick={() => handleDelete(message.id)}
                          >
                            {deletingId === message.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </AdminIconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrapper>
          ) : (
            <AdminEmptyState
              title="No messages found"
              description="Messages sent through the contact form will appear here."
              icon={MessageSquare}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">From</p>
                  <p className="mt-1 font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-1 font-medium">{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject</p>
                <p className="mt-1 font-medium">{selectedMessage.subject}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Received</p>
                <p className="mt-1">{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Message</p>
                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="whitespace-pre-line text-slate-700">{selectedMessage.message}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        state={confirmDialog}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
        isLoading={confirmLoading}
      />
    </div>
  );
}
