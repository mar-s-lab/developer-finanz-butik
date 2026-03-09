import { Clock, CheckCircle, XCircle, ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVendor } from "@/hooks/useVendorApi";

// For demo: replace with real vendor id from auth context
const DEMO_VENDOR_ID = "00000000-0000-0000-0000-000000000001";

const statusUi = {
  pending: { icon: Clock, label: "Under Review", color: "bg-amber-100 text-amber-800", description: "Your application is being reviewed by our team. This typically takes 2–3 business days." },
  approved: { icon: CheckCircle, label: "Approved", color: "bg-emerald-100 text-emerald-800", description: "Congratulations! Your vendor account is active. You can now publish services." },
  rejected: { icon: XCircle, label: "Not Approved", color: "bg-red-100 text-red-800", description: "Unfortunately your application was not approved at this time." },
};

export default function VendorStatusPage() {
  const { data: vendor, isLoading } = useVendor(DEMO_VENDOR_ID);

  if (isLoading) return <div className="text-muted-foreground text-sm">Loading…</div>;
  if (!vendor) return <div className="text-muted-foreground text-sm">No application found.</div>;

  const ui = statusUi[vendor.status];
  const Icon = ui.icon;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Application Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your vendor registration</p>
      </div>

      <Card>
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${ui.color}`}>
            <Icon size={32} />
          </div>
          <Badge variant="outline" className={`${ui.color} text-sm px-3`}>{ui.label}</Badge>
          <div>
            <p className="font-heading font-semibold text-foreground">{vendor.company_name}</p>
            <p className="text-sm text-muted-foreground mt-1">{ui.description}</p>
          </div>
          {vendor.rejection_reason && (
            <div className="w-full rounded-md bg-destructive/10 border border-destructive/20 p-3 text-left">
              <p className="text-xs font-medium text-destructive">Reason:</p>
              <p className="text-xs text-destructive/80 mt-1">{vendor.rejection_reason}</p>
            </div>
          )}
          {vendor.status === "approved" && (
            <Button asChild className="w-full">
              <Link to="/vendor">Go to Dashboard <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
