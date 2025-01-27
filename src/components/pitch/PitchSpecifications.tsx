import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface PitchSpecificationsProps {
  form: UseFormReturn<any>;
}

const surfaceTypes = [
  "grass",
  "artificial_grass",
  "hybrid",
  "3g",
  "4g",
  "5g",
  "astroturf",
  "other",
];

const lightingTypes = ["none", "floodlights", "natural_only", "partial"];

const PitchSpecifications = ({ form }: PitchSpecificationsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Specifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="surface_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surface Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select surface type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {surfaceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lighting_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lighting</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select lighting type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lightingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="parking_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parking Information</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe parking facilities and any important information..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="access_instructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access Instructions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe walking routes from parking and any access details..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="equipment_requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipment Requirements</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="List any required equipment or footwear..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PitchSpecifications;
