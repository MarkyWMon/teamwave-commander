import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import TeamOfficialForm from "./TeamOfficialForm";

interface TeamOfficialsListProps {
  form: UseFormReturn<any>;
}

const TeamOfficialsList = ({ form }: TeamOfficialsListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Team Officials</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const officials = form.getValues("officials");
            form.setValue("officials", [
              ...officials,
              { full_name: "", role: "manager", email: "", phone: "" },
            ]);
          }}
        >
          Add Official
        </Button>
      </div>

      {form.watch("officials").map((_, index) => (
        <TeamOfficialForm
          key={index}
          index={index}
          form={form}
          onRemove={() => {
            const officials = form.getValues("officials");
            form.setValue(
              "officials",
              officials.filter((_, i) => i !== index)
            );
          }}
          isRemovable={index > 0}
        />
      ))}
    </div>
  );
};

export default TeamOfficialsList;