import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-lg text-foreground/60">
          Welcome to your team management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <Card className="p-6 space-y-4 animate-slide-up [animation-delay:200ms]">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-4 text-sm rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors">
              Schedule Fixture
            </button>
            <button className="p-4 text-sm rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors">
              Send Email
            </button>
            <button className="p-4 text-sm rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors">
              Add Team
            </button>
            <button className="p-4 text-sm rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors">
              View Calendar
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;