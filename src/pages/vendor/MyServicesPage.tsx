import { PlusCircle, Clock, CheckCircle, XCircle, FileText } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVendorServices, useSubmitService } from "@/hooks/useVendorApi";
import { useToast } from "@/hooks/use-toast";

// Replace with auth context
const DEMO_VENDOR_ID = "00000000-0000-0000-0000-000000000001";

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", icon: FileText },
  pending: { label: "In Review", className: "bg-amber-100 text-amber-800", icon: Clock },
  published: { label: "Published", className: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800", icon: XCircle },
} as const;

export default function MyServicesPage() {
  const { data, isLoading } = useVendorServices(DEMO_VENDOR_ID);
  const { mutateAsync: submitService, isPending: isSubmitting } = useSubmitService();
  const { toast } = useToast();

  async function handleSubmit(serviceId: string) {
    try {
      await submitService(serviceId);
      toast({ title: "Service submitted for review" });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  }

  const services = data?.items ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">{services.length} service{services.length !== 1 ? "s" : ""} in your portfolio</p>
        </div>
        <Button asChild>
          <Link to="/vendor/new-service"><PlusCircle size={16} className="mr-1" /> New Service</Link>
        </Button>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}

      {!isLoading && services.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <PlusCircle size={48} className="text-muted-foreground/40 mb-4" />
            <p className="font-heading font-semibold text-foreground">No services yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first service to get started</p>
            <Button asChild><Link to="/vendor/new-service">Create Service</Link></Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const cfg = statusConfig[s.status as keyof typeof statusConfig] ?? statusConfig.draft;
          const Icon = cfg.icon;
          return (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold leading-snug">{s.title}</CardTitle>
                  <Badge variant="outline" className={`shrink-0 text-[10px] ${cfg.className}`}>
                    <Icon size={11} className="mr-1" /> {cfg.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.category}</span>
                  {s.price_range && <span className="font-semibold">{s.price_range}</span>}
                </div>
                {s.rejection_reason && (
                  <p className="text-xs text-destructive">Rejected: {s.rejection_reason}</p>
                )}
                {s.status === "draft" && (
                  <Button size="sm" variant="outline" className="w-full" disabled={isSubmitting}
                    onClick={() => handleSubmit(s.id)}>
                    Submit for Review
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
