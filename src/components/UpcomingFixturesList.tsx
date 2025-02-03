import { useState } from "react";
import FixtureCard from "./fixtures/FixtureCard";
import FixtureEditDialog from "./FixtureEditDialog";

interface UpcomingFixturesListProps {
  fixtures: any[];
}

const UpcomingFixturesList = ({ fixtures }: UpcomingFixturesListProps) => {
  const [selectedFixture, setSelectedFixture] = useState<any>(null);

  // Remove duplicates based on fixture ID
  const uniqueFixtures = fixtures.filter((fixture, index) => 
    fixtures.findIndex(f => f.id === fixture.id) === index
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Fixtures</h2>
        <span className="text-sm text-muted-foreground">
          Next {uniqueFixtures.length} fixtures
        </span>
      </div>

      {uniqueFixtures.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No upcoming fixtures scheduled
        </p>
      ) : (
        <div className="space-y-3">
          {uniqueFixtures.map((fixture) => (
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