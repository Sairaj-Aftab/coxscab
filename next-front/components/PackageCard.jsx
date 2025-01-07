import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const PackageCard = ({ package: pkg }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        {/* <Image
          src={pkg?.image || ""}
          alt={pkg?.vehicleType?.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        /> */}
        <CardTitle className="mt-2">{pkg?.vehicleType?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{pkg?.description}</p>
        <p className="font-semibold">Price: ${pkg?.price}</p>
        {pkg?.duration && (
          <p className="text-sm mb-2">Duration: {pkg?.duration}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {pkg?.endPoint?.map((destination, index) => (
            <Badge key={index} variant="secondary">
              {destination?.address?.split(",")[0].trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Book Now</Button>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
