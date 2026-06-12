"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
  Reply,
} from "lucide-react";
import {
  getMessages,
  deleteMessage,
  updateMessage,
} from "@/lib/admin/services";
import {
  AdminEmptyState,
  AdminFilterSelect,
  AdminIconButton,
  AdminLoadingState,
  AdminMobileCard,
  AdminNoResults,
  AdminPanel,
  AdminRefreshButton,
  AdminSearchInput,
  AdminStatusBadge,
  AdminTableWrapper,
  AdminToolbar,
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
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all");

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

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((msg) => {
      const matchesSearch =
        !q ||
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.subject.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q);
      const matchesRead =
        readFilter === "all" ||
        (readFilter === "unread" && !msg.read) ||
        (readFilter === "read" && msg.read);
      return matchesSearch && matchesRead;
    });
  }, [messages, search, readFilter]);

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
          if (selectedMessage?.id === id) setShowModal(false);
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
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, read: true } : prev));
      }
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-UG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-4">
      <AdminToolbar resultCount={filteredMessages.length} totalCount={messages.length}>
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, or subject..."
        />
        <AdminFilterSelect
          value={readFilter}
          onChange={setReadFilter}
          placeholder="Status"
          options={[
            { value: "all", label: "All messages" },
            { value: "unread", label: `Unread (${unreadCount})` },
            { value: "read", label: "Read" },
          ]}
        />
        <AdminRefreshButton onClick={fetchMessages} loading={loading} />
      </AdminToolbar>

      {unreadCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span>
            <strong>{unreadCount}</strong> unread {unreadCount === 1 ? "message" : "messages"} awaiting review
          </span>
        </div>
      )}

      <AdminPanel>
        <div className="p-4 sm:p-6">
          {loading ? (
            <AdminLoadingState message="Loading messages..." />
          ) : messages.length === 0 ? (
            <AdminEmptyState
              title="No messages found"
              description="Messages sent through the contact form will appear here."
              icon={MessageSquare}
            />
          ) : filteredMessages.length === 0 ? (
            <AdminNoResults
              onClear={() => {
                setSearch("");
                setReadFilter("all");
              }}
            />
          ) : (
            <>
              <div className="hidden md:block">
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
                      {filteredMessages.map((message) => (
                        <tr
                          key={message.id}
                          className={`${adminTrClassName()} ${!message.read ? "bg-amber-50/40" : ""}`}
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
                              <span className="truncate max-w-[180px]">{message.email}</span>
                            </div>
                          </td>
                          <td className={`${adminTdClassName()} max-w-xs truncate font-medium`}>
                            {message.subject}
                          </td>
                          <td className={adminTdClassName()}>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span>{formatDate(message.created_at)}</span>
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
              </div>

              <div className="space-y-3 md:hidden">
                {filteredMessages.map((message) => (
                  <AdminMobileCard
                    key={message.id}
                    title={message.name}
                    subtitle={message.subject}
                    meta={`${message.email} · ${formatDate(message.created_at)}`}
                    badge={
                      <AdminStatusBadge
                        label={message.read ? "Read" : "Unread"}
                        tone={message.read ? "success" : "warning"}
                      />
                    }
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => openMessage(message)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        disabled={deletingId === message.id}
                        className="hover:border-red-200 hover:text-red-600"
                      >
                        {deletingId === message.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                        ) : (
                          <><Trash2 className="h-4 w-4 mr-1" /> Delete</>
                        )}
                      </Button>
                    </div>
                  </AdminMobileCard>
                ))}
              </div>
            </>
          )}
        </div>
      </AdminPanel>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pr-6">Message details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <AdminStatusBadge
                  label={selectedMessage.read ? "Read" : "Unread"}
                  tone={selectedMessage.read ? "success" : "warning"}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">From</p>
                  <p className="mt-1 font-medium text-slate-900">{selectedMessage.name}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-1 font-medium text-slate-900 break-all">{selectedMessage.email}</p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</p>
                <p className="mt-1 font-medium text-slate-900">{selectedMessage.subject}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Received</p>
                <p className="mt-1 text-slate-700">
                  {new Date(selectedMessage.created_at).toLocaleString("en-UG")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Message</p>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="whitespace-pre-line leading-relaxed text-slate-700">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          {selectedMessage && (
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button asChild>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                >
                  <Reply className="mr-2 h-4 w-4" />
                  Reply via email
                </a>
              </Button>
            </DialogFooter>
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
