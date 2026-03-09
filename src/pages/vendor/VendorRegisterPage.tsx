import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { BuildingOffice } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRegisterVendor } from "@/hooks/useVendorApi";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  company_name: z.string().min(2).max(150),
  contact_email: z.string().email(),
  description: z.string().min(10).max(500),
  service_category: z.string().min(1, "Select a category"),
  website: z.string().url().optional().or(z.literal("")),
  terms_accepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

type FormValues = z.infer<typeof schema>;

const SERVICE_CATEGORIES = [
  "legal", "accounting", "consulting", "marketing",
  "technology", "construction", "real_estate", "other",
];

export default function VendorRegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutateAsync, isPending } = useRegisterVendor();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { company_name: "", contact_email: "", description: "", service_category: "", website: "" },
  });

  async function onSubmit(data: FormValues) {
    try {
      await mutateAsync({ ...data, terms_accepted: true });
      toast({ title: "Registration submitted", description: "We'll review your application and notify you by email." });
      navigate("/vendor/status");
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Become a Vendor</h1>
        <p className="mt-1 text-sm text-muted-foreground">Register your business to offer services on Finanz Butik</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BuildingOffice size={20} className="text-primary" /> Business Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="company_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl><Input placeholder="Acme Legal & Co." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="contact_email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl><Input type="email" placeholder="hello@acme.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="service_category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="Describe what your business offers..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (optional)</FormLabel>
                  <FormControl><Input placeholder="https://acme.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Submitting…" : "Submit Application"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
