import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import TeamForm from "./TeamForm";
import { Team } from "@/types/team";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface TeamEditDialogProps {
  team: Team;
}

const TeamEditDialog = ({ team }: TeamEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSuccess = async () => {
    setIsOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["teams"] });
    toast.success("Team updated successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <TeamForm team={team} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default TeamEditDialog;