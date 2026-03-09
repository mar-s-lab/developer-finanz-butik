import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VendorResponse {
  id: string;
  company_name: string;
  contact_email: string;
  description: string;
  service_category: string;
  status: "pending" | "approved" | "rejected";
  logo_url?: string;
  website?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceResponse {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  category: string;
  status: "draft" | "pending" | "published" | "rejected";
  price_range?: string;
  images: string[];
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceListResponse {
  items: ServiceResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface VendorActivitySummary {
  vendor_id: string;
  services_published: number;
  services_pending: number;
  messages_received: number;
  messages_unread: number;
  unique_clients: number;
}

export interface RegisterVendorPayload {
  company_name: string;
  contact_email: string;
  description: string;
  service_category: string;
  terms_accepted: boolean;
  website?: string;
}

export interface CreateServicePayload {
  vendor_id: string;
  title: string;
  description: string;
  category: string;
  price_range?: string;
}

// ─── Vendor ──────────────────────────────────────────────────────────────────

export function useRegisterVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterVendorPayload) =>
      apiFetch<VendorResponse>("/vendors/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor"] }),
  });
}

export function useVendor(vendorId: string | undefined) {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => apiFetch<VendorResponse>(`/vendors/${vendorId}`),
    enabled: !!vendorId,
  });
}

export function useVendorActivity(vendorId: string | undefined) {
  return useQuery({
    queryKey: ["vendor-activity", vendorId],
    queryFn: () => apiFetch<VendorActivitySummary>(`/vendors/${vendorId}/activity/summary`),
    enabled: !!vendorId,
    refetchInterval: 60_000,
  });
}

// ─── Services ────────────────────────────────────────────────────────────────

export function useVendorServices(vendorId: string | undefined) {
  return useQuery({
    queryKey: ["vendor-services", vendorId],
    queryFn: () => apiFetch<ServiceListResponse>(`/services/by-vendor/${vendorId}`),
    enabled: !!vendorId,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateServicePayload) =>
      apiFetch<ServiceResponse>("/services/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => qc.invalidateQueries({ queryKey: ["vendor-services", data.vendor_id] }),
  });
}

export function useSubmitService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: string) =>
      apiFetch<ServiceResponse>(`/services/${serviceId}/submit`, { method: "POST" }),
    onSuccess: (data) => qc.invalidateQueries({ queryKey: ["vendor-services", data.vendor_id] }),
  });
}
