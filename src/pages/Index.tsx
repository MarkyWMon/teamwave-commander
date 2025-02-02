import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FixtureDialog from "@/components/FixtureDialog";
import { format } from "date-fns";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFixtureDialogOpen, setIsFixtureDialogOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: fixtures } = useQuery({
    queryKey: ["fixtures", date],
    queryFn: async () => {
      if (!date) return [];
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("fixtures")
        .select(`
          *,
          home_team:teams!fixtures_home_team_id_fkey(*),
          away_team:teams!fixtures_away_team_id_fkey(*),
          pitch:pitches(*)
        `)
        .gte("match_date", startOfDay.toISOString())
        .lte("match_date", endOfDay.toISOString())
        .order("match_date");

      if (error) throw error;
      return data;
    },
  });

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-lg text-foreground/60">
            Welcome to your team management dashboard
          </p>
        </div>
        <Button onClick={() => setIsFixtureDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Fixture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 animate-slide-up">
          <h2 className="text-xl font-semibold">Fixtures Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-6 space-y-4 animate-slide-up [animation-delay:100ms] md:col-span-2">
          <h2 className="text-xl font-semibold">
            Fixtures for {date ? format(date, "PPP") : "Selected Date"}
          </h2>
          <div className="space-y-4">
            {fixtures?.length === 0 ? (
              <p className="text-sm text-foreground/60">No fixtures scheduled for this date</p>
            ) : (
              fixtures?.map((fixture) => (
                <div
                  key={fixture.id}
                  className="p-4 rounded-lg border bg-card/50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {fixture.home_team.name} vs {fixture.away_team.name}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {fixture.pitch.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {format(new Date(fixture.match_date), "p")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <FixtureDialog
        open={isFixtureDialogOpen}
        onOpenChange={setIsFixtureDialogOpen}
      />
    </div>
  );
};

export default Index;