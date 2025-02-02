import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import AddressFields from "./map/AddressFields";
import LocationMap from "./map/LocationMap";
import { geocodePostcode } from "./map/mapUtils";
import mapboxgl from "mapbox-gl";

interface PitchLocationProps {
  form: UseFormReturn<any>;
}

const PitchLocation = ({ form }: PitchLocationProps) => {
  const mapboxToken = useRef<string | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const postalCode = useWatch({
    control: form.control,
    name: "postal_code",
  });

  useEffect(() => {
    const initializeToken = async () => {
      try {
        const { data: { secret: token } } = await supabase.functions.invoke('get-secret', {
          body: { name: 'MAPBOX_PUBLIC_TOKEN' }
        });
        mapboxToken.current = token;
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };

    initializeToken();
  }, []);

  useEffect(() => {
    if (postalCode && postalCode.length >= 5) {
      geocodePostcode(postalCode, mapboxToken.current!, map.current, marker.current, form);
    }
  }, [postalCode]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Location</h2>
      <AddressFields form={form} />
      <LocationMap form={form} mapboxToken={mapboxToken.current} />
    </div>
  );
};

export default PitchLocation;