import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MatchEmailPreviewProps {
  fixture: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MatchEmailPreview = ({ fixture, open, onOpenChange }: MatchEmailPreviewProps) => {
  const { toast } = useToast();
  const [emailContent, setEmailContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailContent);
      toast({
        title: "Copied to clipboard",
        description: "Email content has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the text manually",
        variant: "destructive",
      });
    }
  };

  // Fetch the email content when the dialog opens
  const loadEmailContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('match-email', {
        body: { fixture },
      });
      
      if (error) throw error;
      
      setEmailContent(data);
    } catch (error: any) {
      console.error('Error loading email content:', error);
      toast({
        title: "Error",
        description: "Failed to generate email content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load content when dialog opens
  if (open && !emailContent && !isLoading) {
    loadEmailContent();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match Communication Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={copyToClipboard}>
                  Copy to Clipboard
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchEmailPreview;