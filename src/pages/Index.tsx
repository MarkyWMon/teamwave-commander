import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import ProfileCard from "@/components/ProfileCard";
import { useState } from "react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-lg text-foreground/60">
          Welcome to your team management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileCard />

        <Card className="p-6 space-y-4 animate-slide-up">
          <h2 className="text-xl font-semibold">Upcoming Fixtures</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-6 space-y-4 animate-slide-up [animation-delay:100ms]">
          <h2 className="text-xl font-semibold">Recent Communications</h2>
          <div className="space-y-2">
            <p className="text-sm text-foreground/60">No recent communications</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;