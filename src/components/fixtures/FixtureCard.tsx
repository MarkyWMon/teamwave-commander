import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FixtureCardProps {
  fixture: any;
  onClick?: () => void;
}

const FixtureCard = ({ fixture, onClick }: FixtureCardProps) => {
  return (
    <Card 
      key={fixture.id} 
      className="p-4 hover:bg-accent/50 transition-colors bg-card shadow-sm cursor-pointer"
      onClick={onClick}
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
  );
};

export default FixtureCard;