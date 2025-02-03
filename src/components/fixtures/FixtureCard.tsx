import { format } from "date-fns";
import { Clock, MapPin, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MatchEmailPreview from "./MatchEmailPreview";

interface FixtureCardProps {
  fixture: any;
  onClick?: () => void;
}

const FixtureCard = ({ fixture, onClick }: FixtureCardProps) => {
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  return (
    <>
      <Card 
        key={fixture.id} 
        className="p-4 hover:bg-accent/50 transition-colors bg-card shadow-sm"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="cursor-pointer" onClick={onClick}>
              <h3 className="font-medium">
                {fixture.home_team.name} vs {fixture.away_team.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(fixture.match_date), "EEEE, MMMM d")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmailPreviewOpen(true)}
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {fixture.status}
              </span>
            </div>
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

      <MatchEmailPreview
        fixture={fixture}
        open={isEmailPreviewOpen}
        onOpenChange={setIsEmailPreviewOpen}
      />
    </>
  );
};

export default FixtureCard;