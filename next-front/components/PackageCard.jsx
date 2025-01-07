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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const imageItem = [
  "https://images.unsplash.com/photo-1517942491415-4fc176d3c2f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZlaGljbGV8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1674110997072-41f11b7d4ae7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmVoaWNsZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1668194252221-1401347c2c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y294J3MlMjBiYXphcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1626239337670-dfa76e646bfe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNveCdzJTIwYmF6YXJ8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1626239889138-a7e4f971059e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNveCdzJTIwYmF6YXJ8ZW58MHx8MHx8fDA%3D",
];

const PackageCard = ({ package: pkg }) => {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <Slider {...sliderSettings}>
          {imageItem?.map((image, index) => (
            <div key={index} className="relative h-48">
              <Image
                src={image}
                alt={`${pkg.vehicleType.name} - Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
          ))}
        </Slider>
        <CardTitle className="mt-2">{pkg?.vehicleType?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">
          {pkg?.description?.length > 50
            ? `${pkg?.description.slice(0, 50)}...`
            : pkg?.description}
        </p>
        <p className="font-semibold">Price: &#2547;{pkg?.price}</p>
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
