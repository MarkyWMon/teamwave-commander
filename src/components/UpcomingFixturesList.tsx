import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface UpcomingFixturesListProps {
  fixtures: any[];
}

const UpcomingFixturesList = ({ fixtures }: UpcomingFixturesListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Fixtures</h2>
        <span className="text-sm text-muted-foreground">
          Next {fixtures.length} fixtures
        </span>
      </div>

      {fixtures.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No upcoming fixtures scheduled
        </p>
      ) : (
        <div className="space-y-3">
          {fixtures.map((fixture) => (
            <Card 
              key={fixture.id} 
              className="p-4 hover:bg-accent/50 transition-colors bg-card shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">
                      {fixture.home_team.name} vs {fixture.away_team.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(fixture.match_date), "EEEE, MMMM d")}
                    </p>
                  </div>
                  <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {fixture.status}
                  </span>
                </div>
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingFixturesList;