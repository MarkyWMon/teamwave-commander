import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface PitchBasicInfoProps {
  form: UseFormReturn<any>;
}

const PitchBasicInfo = ({ form }: PitchBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Basic Information</h2>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pitch Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PitchBasicInfo;