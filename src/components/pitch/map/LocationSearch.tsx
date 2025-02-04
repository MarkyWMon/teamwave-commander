import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LocationSearchProps {
  form: UseFormReturn<any>;
  mapboxToken: string | null;
  onLocationFound?: (coords: { longitude: number; latitude: number }) => void;
}

export const LocationSearch = ({ form, mapboxToken, onLocationFound }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const searchLocation = async () => {
    if (!mapboxToken || !searchQuery) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxToken}&country=GB`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setSuggestions(data.features);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error("Failed to search location");
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const [longitude, latitude] = suggestion.center;
    
    // Update form values
    form.setValue("address_line1", suggestion.place_name);
    form.setValue("longitude", longitude);
    form.setValue("latitude", latitude);
    form.setValue("map_url", `https://www.google.com/maps?q=${latitude},${longitude}`);
    
    // Clear suggestions
    setSuggestions([]);
    setSearchQuery("");
    
    // Notify parent component
    onLocationFound?.({ longitude, latitude });
    
    toast.success("Location updated");
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location..."
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={searchLocation}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};