import mapboxgl from "mapbox-gl";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

export const initializeMapbox = async () => {
  try {
    const response = await fetch('/api/mapbox-token');
    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error fetching Mapbox token:', error);
    return null;
  }
};

export const updateFormCoordinates = (
  form: UseFormReturn<any>,
  lng: number,
  lat: number
) => {
  form.setValue("longitude", lng);
  form.setValue("latitude", lat);
};

export const geocodePostcode = async (
  postcode: string,
  token: string,
  map: mapboxgl.Map | null,
  marker: mapboxgl.Marker | null,
  form: UseFormReturn<any>
) => {
  if (!token || !postcode || !map || !marker) return;

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        postcode
      )}.json?access_token=${token}&country=GB`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      
      map.flyTo({
        center: [longitude, latitude],
        zoom: 16,
      });

      marker.setLngLat([longitude, latitude]);
      updateFormCoordinates(form, longitude, latitude);
      
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