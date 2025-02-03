import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { geocodeAddress } from "./geocodingUtils";

interface AddressFieldsProps {
  form: UseFormReturn<any>;
  mapboxToken: string | null;
  onLocationFound?: (coords: { longitude: number; latitude: number }) => void;
}

const AddressFields = ({ form, mapboxToken, onLocationFound }: AddressFieldsProps) => {
  const handleSearch = async () => {
    if (!mapboxToken) return;

    const address = [
      form.getValues("address_line1"),
      form.getValues("address_line2"),
      form.getValues("city"),
      form.getValues("postal_code")
    ].filter(Boolean).join(", ");

    const result = await geocodeAddress(address, mapboxToken, form);
    
    if (result) {
      onLocationFound?.(result);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address_line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="county"
          render={({ field }) => (
            <FormItem>
              <FormLabel>County</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input {...field} />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleSearch}
                    className="shrink-0"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="map_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Map URL</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressFields;