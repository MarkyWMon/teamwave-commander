import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PitchList from "@/components/PitchList";
import PitchDialog from "@/components/PitchDialog";

const Pitches = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<any>(null);

  const { data: pitches, isLoading } = useQuery({
    queryKey: ["pitches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pitches")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Pitches</h1>
          <p className="text-lg text-foreground/60">Manage your team's pitches</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Pitch
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <PitchList 
          pitches={pitches || []} 
          onEdit={(pitch) => {
            setSelectedPitch(pitch);
            setIsDialogOpen(true);
          }}
        />
      )}

      <PitchDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        pitch={selectedPitch}
        onClose={() => {
          setSelectedPitch(null);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default Pitches;