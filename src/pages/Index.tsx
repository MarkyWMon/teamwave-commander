import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Clock, MapPin } from "lucide-react";
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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your team's fixtures and schedules
          </p>
        </div>
        <Button onClick={() => setIsFixtureDialogOpen(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Fixture
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-1 bg-white">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Calendar</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
            />
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2 bg-white">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Fixtures for {date ? format(date, "EEEE, MMMM d, yyyy") : "Selected Date"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {fixtures?.length || 0} fixtures
              </span>
            </div>

            <div className="space-y-4">
              {fixtures?.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-muted-foreground">No fixtures scheduled for this date</p>
                  <Button 
                    variant="outline"
                    onClick={() => setIsFixtureDialogOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule a Fixture
                  </Button>
                </div>
              ) : (
                fixtures?.map((fixture) => (
                  <Card 
                    key={fixture.id} 
                    className="p-4 hover:bg-accent/50 transition-colors bg-card shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            {fixture.home_team.name} vs {fixture.away_team.name}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground space-x-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(fixture.match_date), "h:mm a")}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {fixture.pitch.name}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {fixture.status}
                        </span>
                      </div>
                      {fixture.notes && (
                        <p className="text-sm text-muted-foreground">
                          {fixture.notes}
                        </p>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
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