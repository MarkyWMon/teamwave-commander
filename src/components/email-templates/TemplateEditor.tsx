import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import TemplateFieldsList from "./TemplateFieldsList";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters"),
  description: z.string().optional(),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export type TemplateFormValues = z.infer<typeof formSchema>;

const TemplateEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: template } = useQuery({
    queryKey: ["email-template", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      content: "",
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        description: template.description || "",
        subject: template.subject,
        content: template.content,
      });
    }
  }, [template, form]);

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to save templates");
        return;
      }

      if (id) {
        const { error } = await supabase
          .from("email_templates")
          .update({
            name: values.name,
            description: values.description || null,
            subject: values.subject,
            content: values.content,
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Template updated successfully");
      } else {
        const { error } = await supabase
          .from("email_templates")
          .insert({
            name: values.name,
            description: values.description || null,
            subject: values.subject,
            content: values.content,
            created_by: user.id,
            template_type: "match_notification",
          });

        if (error) throw error;
        toast.success("Template saved successfully");
      }

      navigate("/templates");
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error(error.message || "Failed to save template");
    } finally {
      setIsSaving(false);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {id ? "Edit Template" : "Create Template"}
            </h1>
            <Button variant="outline" onClick={() => navigate("/templates")}>
              Cancel
            </Button>
          </div>

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

              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : id ? "Update Template" : "Save Template"}
              </Button>
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