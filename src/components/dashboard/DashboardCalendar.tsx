import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface DashboardCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  highlightedDates: Date[];
}

const DashboardCalendar = ({ date, onDateSelect, highlightedDates }: DashboardCalendarProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          className="rounded-md border shadow-sm"
          modifiers={{
            highlighted: (date) => 
              highlightedDates.some(
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
  );
};

export default DashboardCalendar;