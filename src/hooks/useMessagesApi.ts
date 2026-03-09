import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface MessageDTO {
  sender_type: "client" | "vendor";
  sender_id: string;
  subject?: string;
  body: string;
  sent_at: string;
  read: boolean;
}

export interface MessageThreadResponse {
  id: string;
  vendor_id: string;
  client_id: string;
  service_id: string;
  messages: MessageDTO[];
  created_at: string;
  updated_at: string;
}

export function useVendorInbox(vendorId: string | undefined) {
  return useQuery({
    queryKey: ["vendor-inbox", vendorId],
    queryFn: () => apiFetch<MessageThreadResponse[]>(`/messages/vendor/${vendorId}`),
    enabled: !!vendorId,
    refetchInterval: 30_000,
  });
}

export function useClientInbox(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client-inbox", clientId],
    queryFn: () => apiFetch<MessageThreadResponse[]>(`/messages/client/${clientId}`),
    enabled: !!clientId,
    refetchInterval: 30_000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { vendor_id: string; service_id: string; subject: string; body: string }) =>
      apiFetch<MessageThreadResponse>("/messages/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-inbox"] }),
  });
}

export function useReplyToThread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, body }: { threadId: string; body: string }) =>
      apiFetch<MessageThreadResponse>(`/messages/${threadId}/reply`, {
        method: "POST",
        body: JSON.stringify({ body }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-inbox"] });
      qc.invalidateQueries({ queryKey: ["client-inbox"] });
    },
  });
}
