import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MessageList } from "@/components/dashboard/message-list";
import { requireSession } from "@/lib/auth";
import { getThreadsForUserServer } from "@/lib/server-repository";

export default async function MessagesDashboardPage() {
  const session = await requireSession();
  const messages = (await getThreadsForUserServer(session.userId)).map((thread) => ({
    id: thread.id,
    subject: thread.subject,
    counterpart: thread.property?.title || "Marketplace thread",
    preview: thread.messages.at(-1)?.body || "No messages yet.",
    createdAt: thread.createdAt,
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Message threads are grouped around the property and keep discovery, inquiry, and follow-up connected."
        eyebrow="Conversations"
        title="Messages"
      />
      <MessageList items={messages} />
    </div>
  );
}
