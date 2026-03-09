import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BuildingOffice } from "@phosphor-icons/react";
import { useServiceDetail } from "@/hooks/useMarketplaceApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ContactVendorModal } from "@/components/ContactVendorModal";
import type { ServiceResponse } from "@/hooks/useVendorApi";

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data: service, isLoading } = useServiceDetail(serviceId);
  const [showContact, setShowContact] = useState(false);

  if (isLoading) return <div className="text-sm text-muted-foreground p-8">Loading…</div>;
  if (!service) return (
    <div className="p-8 text-center">
      <p className="font-heading font-semibold">Service not found</p>
      <Button variant="ghost" asChild className="mt-4"><Link to="/marketplace/services"><ArrowLeft size={16} className="mr-1" /> Back</Link></Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/marketplace/services"><ArrowLeft size={16} className="mr-1" /> All Services</Link>
      </Button>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">{service.title}</h1>
          <Badge variant="secondary" className="capitalize shrink-0">{service.category.replace("_", " ")}</Badge>
        </div>
        {service.price_range && (
          <p className="text-lg font-semibold text-primary">{service.price_range}</p>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3 text-muted-foreground text-sm">
            <BuildingOffice size={16} />
            <span>Service Description</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{service.description}</p>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={() => setShowContact(true)}>
        Contact Vendor
      </Button>

      {showContact && (
        <ContactVendorModal service={service as ServiceResponse} onClose={() => setShowContact(false)} />
      )}
    </div>
  );
}
