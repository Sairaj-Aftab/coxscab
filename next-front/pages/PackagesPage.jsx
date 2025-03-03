"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, MapPinned } from "lucide-react";

const PackagesPage = ({ data }) => {
  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [destinationFilter, setDestinationFilter] = useState("ALL");

  const vehicleTypes = [
    "ALL",
    ...new Set(data?.packages?.map((pkg) => pkg?.vehicleType?.name)),
  ];
  const destinations = [
    "ALL",
    ...new Set(data?.packages?.map((pkg) => pkg?.endAddress)),
  ];

  const filteredPackages = data?.packages?.filter(
    (pkg) =>
      (vehicleFilter === "ALL" || pkg?.vehicleType?.name === vehicleFilter) &&
      (destinationFilter === "ALL" || pkg?.endAddress === destinationFilter)
  );

  return (
    <div className="p-3">
      <h1 className="text-xl sm:text-2xl font-bold mb-3">
        Packages from Cox's Bazar
      </h1>

      <div className="flex flex-col md:flex-row gap-2 mb-3">
        <div>
          <Label htmlFor="vehicle-filter" className="mb-2 block">
            Filter by Vehicle
          </Label>
          <Select
            onValueChange={(value) => setVehicleFilter(value)}
            id="vehicle-filter"
          >
            <SelectTrigger className="min-w-[200px]">
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
            <SelectTrigger className="min-w-[250px]">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages?.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg?.vehicleType.name}</TableCell>
                <TableCell>{pkg?.endAddress}</TableCell>
                <TableCell>
                  {pkg?.duration ? pkg?.duration + " min" : "N/A"}
                </TableCell>
                <TableCell className="font-semibold">
                  &#2547; {pkg?.price}
                </TableCell>
                <TableCell>
                  <Button size="sm">Confirm</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredPackages?.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Vehicle Type:</div>
                <div>{pkg?.vehicleType.name}</div>
                <div className="text-sm font-medium">
                  <MapPinned className="w-5 h-5 text-muted-foreground" />{" "}
                  Destination:
                </div>
                <div>{pkg?.endAddress}</div>
                <div className="text-sm font-medium">
                  <Clock className="w-5 h-5 text-muted-foreground" /> Duration:
                </div>
                <div>{pkg?.duration}</div>
                <div className="text-sm font-medium">Fare:</div>
                <div className="font-semibold">&#2547; {pkg?.price}</div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" size="sm">
                Confirm
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages?.map((pkg) => (
          <PackageCard key={pkg.id} package={pkg} />
        ))}
      </div> */}
    </div>
  );
};

export default PackagesPage;
