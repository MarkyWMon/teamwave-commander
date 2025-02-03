import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import AddressFields from "./map/AddressFields";
import LocationMap from "./map/LocationMap";
import { useState, useEffect } from "react";

interface PitchLocationProps {
  form: UseFormReturn<FormValues>;
}

const PitchLocation = ({ form }: PitchLocationProps) => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const response = await fetch('/api/mapbox-token');
        const { token } = await response.json();
        setMapboxToken(token);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };

    fetchMapboxToken();
  }, []);

  const handleLocationFound = (coords: { longitude: number; latitude: number }) => {
    if (!mapboxToken) return;
    
    form.setValue("longitude", coords.longitude);
    form.setValue("latitude", coords.latitude);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddressFields 
          form={form} 
          mapboxToken={mapboxToken}
          onLocationFound={handleLocationFound}
        />
        <LocationMap 
          form={form}
          mapboxToken={mapboxToken}
        />
      </CardContent>
    </Card>
  );
};

export default PitchLocation;