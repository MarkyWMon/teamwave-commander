import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";

const fields = {
  Fixture: [
    { name: "match_date", label: "Match Date" },
    { name: "status", label: "Match Status" },
    { name: "notes", label: "Match Notes" },
  ],
  Team: [
    { name: "home_team.name", label: "Home Team Name" },
    { name: "away_team.name", label: "Away Team Name" },
    { name: "home_team.team_color", label: "Home Team Color" },
    { name: "home_team.age_group", label: "Age Group" },
  ],
  Pitch: [
    { name: "pitch.name", label: "Pitch Name" },
    { name: "pitch.address_line1", label: "Address Line 1" },
    { name: "pitch.city", label: "City" },
    { name: "pitch.postal_code", label: "Postal Code" },
    { name: "pitch.parking_info", label: "Parking Information" },
    { name: "pitch.access_instructions", label: "Access Instructions" },
    { name: "pitch.equipment_requirements", label: "Equipment Requirements" },
  ],
};

const TemplateFieldsList = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, field: string) => {
    e.dataTransfer.setData("text/plain", field);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
      {Object.entries(fields).map(([category, categoryFields]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
          <div className="space-y-2">
            {categoryFields.map((field) => (
              <Card
                key={field.name}
                className="p-3 cursor-move flex items-center gap-2 hover:bg-accent"
                draggable
                onDragStart={(e) => handleDragStart(e, field.name)}
              >
                <DragHandleDots2Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{field.label}</span>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateFieldsList;