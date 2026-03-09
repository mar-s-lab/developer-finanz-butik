import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSendMessage } from "@/hooks/useMessagesApi";
import { useToast } from "@/hooks/use-toast";
import type { ServiceResponse } from "@/hooks/useVendorApi";

const schema = z.object({
  subject: z.string().min(3).max(200),
  body: z.string().min(1).max(1000),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  service: ServiceResponse;
  onClose: () => void;
}

export function ContactVendorModal({ service, onClose }: Props) {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useSendMessage();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject: `Inquiry about: ${service.title}`, body: "" },
  });

  async function onSubmit(data: FormValues) {
    try {
      await mutateAsync({
        vendor_id: service.vendor_id,
        service_id: service.id,
        subject: data.subject,
        body: data.body,
      });
      toast({ title: "Message sent", description: "The vendor will reply within 24–48 hours." });
      onClose();
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Vendor</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">Re: <span className="font-medium text-foreground">{service.title}</span></p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="subject" render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="body" render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl><Textarea rows={5} placeholder="Describe your needs…" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Sending…" : "Send Message"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
