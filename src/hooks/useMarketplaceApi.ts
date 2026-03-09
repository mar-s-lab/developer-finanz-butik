import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ServiceListResponse, ServiceResponse } from "./useVendorApi";

export function useMarketplaceServices(category?: string, skip = 0, limit = 50) {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (category) params.set("category", category);
  return useQuery({
    queryKey: ["marketplace-services", category, skip, limit],
    queryFn: () => apiFetch<ServiceListResponse>(`/services/marketplace?${params}`),
  });
}

export function useServiceDetail(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => apiFetch<ServiceResponse>(`/services/${serviceId}`),
    enabled: !!serviceId,
  });
}
