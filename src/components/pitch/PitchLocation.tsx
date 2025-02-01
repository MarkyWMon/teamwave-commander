import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useWatch } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

interface PitchLocationProps {
  form: UseFormReturn<any>;
  mapRef: React.RefObject<HTMLDivElement>;
}

const PitchLocation = ({ form, mapRef }: PitchLocationProps) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const mapboxToken = useRef<string | null>(null);
  const { toast } = useToast();

  // Watch postal code changes
  const postalCode = useWatch({
    control: form.control,
    name: "postal_code",
  });

  // Function to update form coordinates
  const updateFormCoordinates = (lng: number, lat: number) => {
    form.setValue("longitude", lng);
    form.setValue("latitude", lat);
  };

  // Function to geocode postal code and update map
  const updateMapLocation = async (postcode: string) => {
    if (!mapboxToken.current || !postcode || !map.current || !marker.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          postcode
        )}.json?access_token=${mapboxToken.current}&country=GB`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        
        map.current.flyTo({
          center: [longitude, latitude],
          zoom: 16,
        });

        marker.current.setLngLat([longitude, latitude]);
        updateFormCoordinates(longitude, latitude);
        
        toast({
          title: "Location Updated",
          description: "Map centered on postal code. You can click anywhere on the map to adjust the exact location.",
        });
      }
    } catch (error) {
      console.error("Error geocoding postal code:", error);
      toast({
        title: "Error",
        description: "Failed to find location for this postal code",
        variant: "destructive",
      });
    }
  };

  // Watch for postal code changes
  useEffect(() => {
    if (postalCode && postalCode.length >= 5) {
      updateMapLocation(postalCode);
    }
  }, [postalCode]);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        const { data: { secret: token } } = await supabase.functions.invoke('get-secret', {
          body: { name: 'MAPBOX_PUBLIC_TOKEN' }
        });

        if (!token) {
          console.error('Mapbox token not found');
          return;
        }

        mapboxToken.current = token;
        mapboxgl.accessToken = token;
        
        map.current = new mapboxgl.Map({
          container: mapRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [form.getValues("longitude") || -0.1276, form.getValues("latitude") || 51.5074],
          zoom: 13,
        });

        marker.current = new mapboxgl.Marker({
          draggable: true,
          color: "#0ea5e9",
        })
          .setLngLat([form.getValues("longitude") || -0.1276, form.getValues("latitude") || 51.5074])
          .addTo(map.current);

        // Handle marker drag
        marker.current.on("dragend", () => {
          const lngLat = marker.current?.getLngLat();
          if (lngLat) {
            updateFormCoordinates(lngLat.lng, lngLat.lat);
          }
        });

        // Handle map click
        map.current.on("click", (e) => {
          const { lng, lat } = e.lngLat;
          marker.current?.setLngLat([lng, lat]);
          updateFormCoordinates(lng, lat);
          
          toast({
            title: "Location Updated",
            description: "Pin location has been updated based on your click.",
          });
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Initial geocoding if postal code exists
        const initialPostcode = form.getValues("postal_code");
        if (initialPostcode) {
          updateMapLocation(initialPostcode);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error",
          description: "Failed to initialize the map",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Location</h2>
      
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="relative">
        <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden" />
        <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md text-sm">
          Click anywhere on the map to set the exact location
        </div>
      </div>
    </div>
  );
};

export default PitchLocation;