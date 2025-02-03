import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface LocationMapProps {
  form: UseFormReturn<any>;
  mapboxToken: string | null;
}

const LocationMap = ({ form, mapboxToken }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const updateLocation = (lng: number, lat: number) => {
    form.setValue("longitude", lng);
    form.setValue("latitude", lat);
    form.setValue("map_url", `https://www.google.com/maps?q=${lat},${lng}`);
    
    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    }
    
    map.current?.flyTo({
      center: [lng, lat],
      zoom: 15,
      essential: true
    });
  };

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
          updateLocation(lngLat.lng, lngLat.lat);
          toast.success("Location updated");
        }
      });

      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        updateLocation(lng, lat);
        toast.success("Location updated");
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error("Failed to initialize the map");
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden" />
      <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md text-sm">
        Click anywhere on the map or drag the marker to set the location
      </div>
    </div>
  );
};

export default LocationMap;