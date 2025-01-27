import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface PitchAmenitiesProps {
  form: UseFormReturn<any>;
}

const amenities = [
  { id: "changing_rooms", label: "Changing Rooms" },
  { id: "toilets", label: "Toilets" },
  { id: "refreshments", label: "Refreshments" },
];

const PitchAmenities = ({ form }: PitchAmenitiesProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Amenities & Instructions</h2>
      
      <div className="space-y-4">
        {amenities.map((amenity) => (
          <FormField
            key={amenity.id}
            control={form.control}
            name={`amenities.${amenity.id}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {amenity.label}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>

      <FormField
        control={form.control}
        name="usage_restrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usage Restrictions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe any usage restrictions..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="special_instructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Instructions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Any additional special instructions..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PitchAmenities;