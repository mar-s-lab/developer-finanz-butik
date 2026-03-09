import { ChatCircle, Clock } from "@phosphor-icons/react";
import { useClientInbox, useReplyToThread, type MessageThreadResponse } from "@/hooks/useMessagesApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Replace with auth context client id
const DEMO_CLIENT_ID = "demo-client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ThreadCard({ thread }: { thread: MessageThreadResponse }) {
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { mutateAsync: reply, isPending } = useReplyToThread();
  const { toast } = useToast();

  const unread = thread.messages.filter((m) => m.sender_type === "vendor" && !m.read).length;
  const lastMsg = thread.messages[thread.messages.length - 1];

  async function sendReply() {
    if (!replyText.trim()) return;
    try {
      await reply({ threadId: thread.id, body: replyText });
      setReplyText("");
      toast({ title: "Reply sent" });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold">{lastMsg?.subject ?? "Thread"}</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {unread > 0 && <Badge className="text-[10px]">{unread} new</Badge>}
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock size={11} />{formatDate(thread.updated_at)}
            </span>
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-3">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {thread.messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender_type === "client" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[80%] text-xs ${
                  m.sender_type === "client"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  <p>{m.body}</p>
                  <p className="mt-1 opacity-60 text-[10px]">{formatDate(m.sent_at)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea rows={2} placeholder="Reply…" value={replyText}
              onChange={(e) => setReplyText(e.target.value)} className="text-xs" />
            <Button size="sm" onClick={sendReply} disabled={isPending || !replyText.trim()}>Send</Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function ClientInboxPage() {
  const { data: threads, isLoading } = useClientInbox(DEMO_CLIENT_ID);

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">My Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Conversations with vendors — refreshes every 30 seconds</p>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}

      {!isLoading && (!threads || threads.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <ChatCircle size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-heading font-semibold">No conversations yet</p>
          <p className="text-sm mt-1">Browse the marketplace and contact a vendor to get started</p>
        </div>
      )}

      <div className="space-y-3">
        {threads?.map((t) => <ThreadCard key={t.id} thread={t} />)}
      </div>
    </div>
  );
}
