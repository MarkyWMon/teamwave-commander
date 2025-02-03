import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DashboardHeaderProps {
  firstName: string;
  hasNoManagedTeams: boolean;
  onAddFixture: () => void;
}

const DashboardHeader = ({ firstName, hasNoManagedTeams, onAddFixture }: DashboardHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
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
          onClick={onAddFixture} 
          size="lg"
          disabled={hasNoManagedTeams}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Fixture
        </Button>
      </div>
    </>
  );
};

export default DashboardHeader;