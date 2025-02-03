import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import FixtureDialog from "@/components/FixtureDialog";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UpcomingFixturesList from "@/components/UpcomingFixturesList";

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

  const { data: allFixtures } = useQuery({
    queryKey: ["all-fixtures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixtures")
        .select(`
          id,
          match_date,
          status,
          home_team:teams!fixtures_home_team_id_fkey(id, name),
          away_team:teams!fixtures_away_team_id_fkey(id, name),
          pitch:pitches(id, name)
        `)
        .gte('match_date', new Date().toISOString())
        .order('match_date')
        .limit(6);

      if (error) throw error;
      
      // Ensure we have unique fixtures based on ID
      const uniqueFixtures = data?.reduce((acc: any[], current) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []) || [];
      
      return uniqueFixtures;
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
          id,
          match_date,
          status,
          home_team:teams!fixtures_home_team_id_fkey(id, name),
          away_team:teams!fixtures_away_team_id_fkey(id, name),
          pitch:pitches(id, name)
        `)
        .gte("match_date", startOfDay.toISOString())
        .lte("match_date", endOfDay.toISOString())
        .order("match_date");

      if (error) throw error;
      
      // Ensure we have unique fixtures for the selected date
      const uniqueFixtures = data?.reduce((acc: any[], current) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []) || [];
      
      return uniqueFixtures;
    },
  });

  const fixturesDates = allFixtures?.map(fixture => 
    new Date(fixture.match_date)
  ) || [];

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const hasNoManagedTeams = !profile?.managed_teams?.length;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {hasNoManagedTeams && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You haven't selected any teams to manage yet. Visit your{" "}
            <a href="/profile" className="font-medium underline underline-offset-4">
              profile page
            </a>{" "}
            to select the teams you manage.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your team's fixtures and schedules
          </p>
        </div>
        <Button 
          onClick={() => setIsFixtureDialogOpen(true)} 
          size="lg"
          disabled={hasNoManagedTeams}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Fixture
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-white">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Calendar</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              modifiers={{
                highlighted: (date) => 
                  fixturesDates.some(
                    fixtureDate => 
                      fixtureDate.getDate() === date.getDate() &&
                      fixtureDate.getMonth() === date.getMonth() &&
                      fixtureDate.getFullYear() === date.getFullYear()
                  )
              }}
              modifiersStyles={{
                highlighted: {
                  backgroundColor: "rgb(var(--primary) / 0.1)",
                  fontWeight: "bold"
                }
              }}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <UpcomingFixturesList fixtures={allFixtures || []} />
          
          {date && fixtures && fixtures.length > 0 && (
            <Card className="p-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {format(date, "MMMM d, yyyy")}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {fixtures.length} fixtures
                  </span>
                </div>
                <div className="space-y-3">
                  {fixtures.map((fixture) => (
                    <Card 
                      key={fixture.id} 
                      className="p-4 hover:bg-accent/50 transition-colors bg-card shadow-sm"
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium">
                          {fixture.home_team.name} vs {fixture.away_team.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <span>{format(new Date(fixture.match_date), "h:mm a")}</span>
                          <span>{fixture.pitch.name}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <FixtureDialog
        open={isFixtureDialogOpen}
        onOpenChange={setIsFixtureDialogOpen}
      />
    </div>
  );
};

export default Index;