import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FixtureDialog from "@/components/FixtureDialog";
import UpcomingFixturesList from "@/components/UpcomingFixturesList";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";

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
      return data || [];
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
      return data || [];
    },
  });

  const fixturesDates = allFixtures?.map(fixture => 
    new Date(fixture.match_date)
  ) || [];

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const hasNoManagedTeams = !profile?.managed_teams?.length;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <DashboardHeader 
        firstName={firstName}
        hasNoManagedTeams={hasNoManagedTeams}
        onAddFixture={() => setIsFixtureDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCalendar 
          date={date}
          onDateSelect={setDate}
          highlightedDates={fixturesDates}
        />

        <div className="space-y-6">
          <UpcomingFixturesList fixtures={allFixtures || []} />
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