import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import AddressFields from "./map/AddressFields";
import LocationMap from "./map/LocationMap";

interface PitchLocationProps {
  form: UseFormReturn<FormValues>;
}

const PitchLocation = ({ form }: PitchLocationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddressFields form={form} />
        <LocationMap form={form} />
      </CardContent>
    </Card>
  );
};

export default PitchLocation;