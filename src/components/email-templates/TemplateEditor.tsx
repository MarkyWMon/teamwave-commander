import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TemplateFieldsList from "./TemplateFieldsList";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters"),
  description: z.string().optional(),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export type TemplateFormValues = z.infer<typeof formSchema>;

const TemplateEditor = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      content: "",
    },
  });

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("email_templates").insert({
        name: values.name,
        description: values.description || null,
        subject: values.subject,
        content: values.content,
        created_by: user.id,
        template_type: "match_notification",
      });

      if (error) throw error;

      toast({
        title: "Template saved",
        description: "Your email template has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const field = e.dataTransfer.getData("text/plain");
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart;
    
    const currentContent = form.getValues("content");
    const newContent = 
      currentContent.slice(0, cursorPosition) + 
      `{{${field}}}` + 
      currentContent.slice(cursorPosition);
    
    form.setValue("content", newContent);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter template name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter template description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email subject" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className={cn(
                          "min-h-[400px] font-mono",
                          isDragging && "border-primary"
                        )}
                        placeholder="Drag and drop fields here to build your template..."
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Template</Button>
            </form>
          </Form>
        </div>

        <div>
          <TemplateFieldsList />
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;