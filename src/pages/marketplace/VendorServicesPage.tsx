import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMarketplaceServices } from "@/hooks/useMarketplaceApi";
import { ServiceCard } from "@/components/ServiceCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ContactVendorModal } from "@/components/ContactVendorModal";
import type { ServiceResponse } from "@/hooks/useVendorApi";

export default function VendorServicesPage() {
  const [category, setCategory] = useState("");
  const [contactService, setContactService] = useState<ServiceResponse | null>(null);
  const { data, isLoading } = useMarketplaceServices(category || undefined);

  const services = data?.items ?? [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Vendor Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">Find professional services for your investment projects</p>
      </div>

      <CategoryFilter value={category} onChange={setCategory} />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MagnifyingGlass size={16} className="animate-spin" /> Loading services…
        </div>
      )}

      {!isLoading && services.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <MagnifyingGlass size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-heading font-semibold">No services found</p>
          <p className="text-sm mt-1">Try a different category filter</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            showContactButton
            onContact={setContactService}
          />
        ))}
      </div>

      {contactService && (
        <ContactVendorModal
          service={contactService}
          onClose={() => setContactService(null)}
        />
      )}
    </div>
  );
}
