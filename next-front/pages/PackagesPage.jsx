"use client";

import { useState } from "react";
import PackageCard from "@/components/PackageCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PackagesPage = ({ data }) => {
  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [destinationFilter, setDestinationFilter] = useState("ALL");

  const filteredPackages = data?.packages?.filter(
    (pkg) =>
      (vehicleFilter === "ALL" || pkg?.vehicleType?.name === vehicleFilter) &&
      (destinationFilter === "ALL" ||
        pkg?.endPoint?.some((point) =>
          point?.address?.includes(destinationFilter)
        ))
  );

  const vehicleTypes = [
    "ALL",
    ...new Set(data?.packages?.map((pkg) => pkg?.vehicleType?.name)),
  ];
  const destinations = [
    "ALL",
    ...new Set(
      data?.packages
        ?.flatMap((pkg) => pkg?.endPoint?.map((point) => point?.address))
        .filter(Boolean) // Remove undefined or null values
    ),
  ];
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Packages from Cox's Bazar</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <Label htmlFor="vehicle-filter" className="mb-2 block">
            Filter by Vehicle
          </Label>
          <Select
            onValueChange={(value) => setVehicleFilter(value)}
            id="vehicle-filter"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="destination-filter" className="mb-2 block">
            Filter by Destination
          </Label>
          <Select
            onValueChange={(value) => setDestinationFilter(value)}
            id="destination-filter"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination?.split(",")[0]?.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages?.map((pkg) => (
          <PackageCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;
