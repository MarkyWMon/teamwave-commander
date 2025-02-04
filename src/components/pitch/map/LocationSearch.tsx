import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LocationSearchProps {
  form: UseFormReturn<any>;
  onLocationFound?: (coords: { longitude: number; latitude: number }) => void;
}

export const LocationSearch = ({ form, onLocationFound }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token for location search');
        const { data, error } = await supabase.functions.invoke('mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          toast.error('Failed to initialize location search');
          return;
        }

        if (!data.token) {
          console.error('No token received from Edge Function');
          return;
        }

        console.log('Successfully retrieved Mapbox token for location search');
        setMapboxToken(data.token);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        toast.error('Failed to initialize location search');
      }
    };

    fetchMapboxToken();
  }, []);

  const searchLocation = async () => {
    if (!mapboxToken || !searchQuery) return;

    try {
      console.log('Searching location with query:', searchQuery);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxToken}&country=GB`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        console.log('Found locations:', data.features.length);
        setSuggestions(data.features);
      } else {
        console.log('No locations found');
        toast.error('No locations found');
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error("Failed to search location");
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const [longitude, latitude] = suggestion.center;
    
    console.log('Selected location:', suggestion.place_name);
    console.log('Coordinates:', { longitude, latitude });
    
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