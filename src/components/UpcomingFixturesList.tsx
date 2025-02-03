import { useState } from "react";
import FixtureCard from "./fixtures/FixtureCard";
import FixtureEditDialog from "./FixtureEditDialog";

interface UpcomingFixturesListProps {
  fixtures: any[];
}

const UpcomingFixturesList = ({ fixtures }: UpcomingFixturesListProps) => {
  const [selectedFixture, setSelectedFixture] = useState<any>(null);

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
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              onClick={() => setSelectedFixture(fixture)}
            />
          ))}
        </div>
      )}

      {selectedFixture && (
        <FixtureEditDialog
          fixture={selectedFixture}
          open={!!selectedFixture}
          onOpenChange={(open) => !open && setSelectedFixture(null)}
        />
      )}
    </div>
  );
};

export default UpcomingFixturesList;