import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { updateFormCoordinates } from "./mapUtils";

interface LocationMapProps {
  form: UseFormReturn<any>;
  mapboxToken: string | null;
}

const LocationMap = ({ form, mapboxToken }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
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

      marker.current.on("dragend", () => {
        const lngLat = marker.current?.getLngLat();
        if (lngLat) {
          updateFormCoordinates(form, lngLat.lng, lngLat.lat);
        }
      });

      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        marker.current?.setLngLat([lng, lat]);
        updateFormCoordinates(form, lng, lat);
        
        toast({
          title: "Location Updated",
          description: "Pin location has been updated based on your click.",
        });
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize the map",
        variant: "destructive",
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden" />
      <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md text-sm">
        Click anywhere on the map to set the exact location
      </div>
    </div>
  );
};

export default LocationMap;