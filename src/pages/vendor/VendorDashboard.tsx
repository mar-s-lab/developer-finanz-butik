import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, PlusCircle, UserCircle, Sparkle, ArrowRight, Clock, CheckCircle, XCircle, ChatCircle, Warning, Package, Eye, Users } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVendorServices, type VendorService, type ServiceStatus } from "@/data/mockVendor";
import { useVendorActivity } from "@/hooks/useVendorApi";

const DEMO_VENDOR_ID = "00000000-0000-0000-0000-000000000001";

const statusConfig: Record<ServiceStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending_approval: { label: "Pending Approval", className: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  active: { label: "Active", className: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

/* ─── KPI Stats ─── */
const kpiStats = [
  { label: "Messages received", icon: ChatCircle, colorClass: "text-[hsl(var(--icon-info))]", bgClass: "bg-[hsl(var(--icon-info)/0.1)]", key: "messages_received" as const, period: "Last 30 days" },
  { label: "Unread messages", icon: Warning, colorClass: "text-[hsl(var(--icon-warning))]", bgClass: "bg-[hsl(var(--icon-warning)/0.1)]", key: "messages_unread" as const, period: "Active" },
  { label: "Services published", icon: Package, colorClass: "text-[hsl(var(--icon-success))]", bgClass: "bg-[hsl(var(--icon-success)/0.1)]", key: "services_published" as const, period: "Total" },
  { label: "Unique clients", icon: Users, colorClass: "text-[hsl(var(--icon-success))]", bgClass: "bg-[hsl(var(--icon-success)/0.1)]", key: "unique_clients" as const, period: "Total" },
  { label: "Pending review", icon: Eye, colorClass: "text-[hsl(var(--icon-info))]", bgClass: "bg-[hsl(var(--icon-info)/0.1)]", key: "services_pending" as const, period: "Total" },
] as const;

const VendorDashboard = () => {
  const [services, setServices] = useState<VendorService[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data: activity } = useVendorActivity(DEMO_VENDOR_ID);

  useEffect(() => {
    setServices([...mockVendorServices]);
    const hasVisited = sessionStorage.getItem("vendor_onboarded");
    if (!hasVisited) {
      setShowOnboarding(true);
      sessionStorage.setItem("vendor_onboarded", "true");
    }
  }, []);

  const isEmpty = services.length === 0;

  if (showOnboarding) {
    return <OnboardingCarousel onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your professional services portfolio</p>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {kpiStats.map(({ label, icon: Icon, colorClass, bgClass, key, period }) => (
          <Card key={key} className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bgClass}`}>
                <Icon size={20} className={colorClass} />
              </div>
              <p className="text-2xl font-bold font-heading text-foreground">
                {activity ? activity[key] : "–"}
              </p>
              <div>
                <p className="text-xs font-medium text-foreground leading-tight">{label}</p>
                <p className="text-[10px] text-muted-foreground">{period}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={`grid gap-4 ${isEmpty ? 'sm:grid-cols-2' : 'sm:grid-cols-1 max-w-md'}`}>
        <Card className="border-dashed border-primary/30 hover:border-primary/60 transition-colors">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <UserCircle size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-foreground text-sm">Set up Vendor Profile</p>
              <p className="text-xs text-muted-foreground">Complete your professional identity</p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/vendor/profile"><ArrowRight size={16} /></Link>
            </Button>
          </CardContent>
        </Card>
        {isEmpty && (
          <Card className="border-dashed border-primary/30 hover:border-primary/60 transition-colors">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <PlusCircle size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-heading font-semibold text-foreground text-sm">Create a new service</p>
                <p className="text-xs text-muted-foreground">Publish a professional service offering</p>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <Link to="/vendor/new-service"><ArrowRight size={16} /></Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Service List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">Your Services</h2>
          <Button size="sm" asChild>
            <Link to="/vendor/new-service"><PlusCircle size={16} className="mr-1" /> New Service</Link>
          </Button>
        </div>

        {isEmpty ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase size={48} className="text-muted-foreground/40 mb-4" />
              <p className="font-heading font-semibold text-foreground">Your services portfolio is empty</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first service to get started</p>
              <Button asChild>
                <Link to="/vendor/new-service">Create Service</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const cfg = statusConfig[s.status];
              const Icon = cfg.icon;
              return (
                <Card key={s.id} className="border-0 shadow-none hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-semibold leading-snug">{s.title}</CardTitle>
                      <Badge variant="outline" className={`shrink-0 text-[10px] ${cfg.className}`}>
                        <Icon size={12} className="mr-1" /> {cfg.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{s.category} · {s.pricingModel}</span>
                      <span className="font-semibold text-foreground">${s.fee.toLocaleString()} {s.currency}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Onboarding Carousel ─── */
const onboardingSlides = [
  { icon: Briefcase, title: "Welcome to the Vendor Portal", desc: "Manage your professional services, credentials, and revenue — all in one place." },
  { icon: Sparkle, title: "Publish & Get Discovered", desc: "Create service listings that investors and developers can find when they need expert support." },
  { icon: CheckCircle, title: "Track Your Revenue", desc: "Monitor views, engagement, and income trends with built-in analytics." },
];

function OnboardingCarousel({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const slide = onboardingSlides[step];
  const Icon = slide.icon;
  const isLast = step === onboardingSlides.length - 1;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-10 pb-8 px-8 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">{slide.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{slide.desc}</p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {onboardingSlides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <Button onClick={isLast ? onFinish : () => setStep(step + 1)} className="w-full">
            {isLast ? "Get Started" : "Next"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default VendorDashboard;
