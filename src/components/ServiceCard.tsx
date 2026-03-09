import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ServiceResponse } from "@/hooks/useVendorApi";

interface Props {
  service: ServiceResponse;
  showContactButton?: boolean;
  onContact?: (service: ServiceResponse) => void;
}

export function ServiceCard({ service, showContactButton, onContact }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-snug">{service.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-[10px] capitalize">
            {service.category.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-3">{service.description}</p>
        {service.price_range && (
          <p className="text-sm font-semibold text-foreground">{service.price_range}</p>
        )}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link to={`/marketplace/services/${service.id}`}>Details <ArrowRight size={13} className="ml-1" /></Link>
          </Button>
          {showContactButton && onContact && (
            <Button size="sm" className="flex-1" onClick={() => onContact(service)}>Contact</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
