"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BrainCog,
  Car,
  CircleDot,
  Clock,
  MapPin,
  ScanEye,
  Search,
  SquareDot,
  Star,
} from "lucide-react";

import MapComponent from "@/components/MapComponent";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import cngVehicle from "@/public/cng.png";
import jeepVehicle from "@/public/jeep.png";
import carVehicle from "@/public/car.png";
import hiaceVehicle from "@/public/hiace.png";
import { useMapCoordinates } from "@/store/mapCoordinates";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleType = [
  {
    id: 1,
    name: "TOMTOM",
    path: cngVehicle,
  },
  {
    id: 2,
    name: "CNG",
    path: cngVehicle,
  },
  {
    id: 3,
    name: "TOURIST JEEP",
    path: jeepVehicle,
  },
  {
    id: 4,
    name: "CAR",
    path: carVehicle,
  },
  {
    id: 5,
    name: "HIACE",
    path: hiaceVehicle,
  },
  {
    id: 6,
    name: "MICRO",
    path: hiaceVehicle,
  },
];

const Home = () => {
  const { setPicupCoordinates, setDestinationCoordinates } =
    useMapCoordinates();

  const [takeVehicle, setTakeVehicle] = useState(null);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [focusedInput, setFocusedInput] = useState(null);
  const [bengali, setBengali] = useState(false);
  const bengaliRegex = /[\u0980-\u09FF]/;
  const englishRegex = /^[\u0000-\u007F]*$/;

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);

    if (e.target.value.length > 0) {
      if (bengaliRegex.test(e.target.value)) {
        setBengali(true);
      } else if (englishRegex.test(e.target.value)) {
        setBengali(false);
      } else {
        setBengali(false);
      }

      const res = await axios.get(
        `https://barikoi.xyz/v2/api/search/autocomplete/place?api_key=${process.env.NEXT_PUBLIC_MAP_ACCESS_TOKEN}&q=${e.target.value}&bangla=true`
      );

      setPickupSuggestions(res?.data?.places);
    } else {
      setPickupSuggestions([]);
    }
  };
  // const handlePickupChange = async (e) => {
  //   setPickup(e.target.value);
  //   if (e.target.value.length > 0) {
  //     const res = await axios.get(`https://photon.komoot.io/api/`, {
  //       params: {
  //         q: e.target.value,
  //         lang: "en",
  //         bbox: "88.007915,26.6358859,92.680196,20.3679092",
  //       },
  //     });

  //     setPickupSuggestions(res?.data?.features);
  //   } else {
  //     setPickupSuggestions([]);
  //   }
  // };
  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    if (e.target.value.length > 0) {
      if (bengaliRegex.test(e.target.value)) {
        setBengali(true);
      } else if (englishRegex.test(e.target.value)) {
        setBengali(false);
      } else {
        setBengali(false);
      }
      const res = await axios.get(
        `https://barikoi.xyz/v2/api/search/autocomplete/place?api_key=${process.env.NEXT_PUBLIC_MAP_ACCESS_TOKEN}&q=${e.target.value}&bangla=true`
      );

      setDestinationSuggestions(res?.data?.places);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleSetYourLocation = () => {
    setPickup("Your location");
    setFocusedInput(null);
    navigator.geolocation.getCurrentPosition(function (pos) {
      setPicupCoordinates({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        me: true,
      });
    });
  };

  const handleSuggestionClick = (
    suggestion,
    type = "pickup" | "destination"
  ) => {
    if (type === "pickup") {
      setPickup(suggestion?.address);
      setPicupCoordinates({
        latitude: suggestion?.latitude,
        longitude: suggestion?.longitude,
      });
      setPickupSuggestions([]);
    } else {
      setDestination(suggestion?.address);
      setDestinationCoordinates({
        latitude: suggestion?.latitude,
        longitude: suggestion?.longitude,
      });
      setDestinationSuggestions([]);
    }
    setFocusedInput(null);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-12 p-2 md:p-3">
      {/* Mobile Search Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden rounded-lg border-2 border-primary bg-card text-card-foreground shadow-lg"
      >
        <div className="p-2 lg:p-6 space-y-2 md:space-y-4">
          <h2 className="text-lg font-semibold text-primary">Book a ride</h2>
          <div className="space-y-4">
            <div className="relative">
              <CircleDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
              <Input
                placeholder="Pickup location"
                value={pickup}
                onChange={handlePickupChange}
                onFocus={() => setFocusedInput("pickup")}
                className="pl-10"
              />
              <AnimatePresence>
                {focusedInput === "pickup" && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full bg-background border border-input rounded-md mt-1 shadow-lg"
                  >
                    <li
                      className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                      onClick={handleSetYourLocation}
                    >
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Your location</span>
                    </li>
                    {pickupSuggestions.map((data, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                        onClick={() => handleSuggestionClick(data, "pickup")}
                      >
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        {bengali ? (
                          <span className="w-full">
                            {data?.address_bn
                              ? data?.address_bn
                              : data?.address}
                          </span>
                        ) : (
                          <span className="w-full">{data?.address}</span>
                        )}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <SquareDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
              <Input
                placeholder="Destination"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={() => setFocusedInput("destination")}
                className="pl-10"
              />
              <AnimatePresence>
                {focusedInput === "destination" &&
                  destinationSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full bg-background border border-input rounded-md mt-1 shadow-lg"
                    >
                      {destinationSuggestions?.map((data, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                          onClick={() =>
                            handleSuggestionClick(data, "destination")
                          }
                        >
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {bengali ? (
                            <span className="w-full">
                              {data?.address_bn
                                ? data?.address_bn
                                : data?.address}
                            </span>
                          ) : (
                            <span className="w-full">{data?.address}</span>
                          )}
                        </li>
                      ))}
                    </motion.ul>
                  )}
              </AnimatePresence>
            </div>
            {/* <div>
              <h3 className="text-sm font-semibold text-primary mb-1">
                Select Vehicle
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {vehicleType.map((data) => (
                  <span
                    key={data.id}
                    className={`rounded-md text-sm flex justify-center items-center cursor-pointer py-1 ${
                      takeVehicle === data.id
                        ? "border-2 border-primary text-primary font-bold"
                        : "border font-semibold text-gray-800"
                    }`}
                    onClick={() => setTakeVehicle(data.id)}
                  >
                    {data.name}
                  </span>
                ))}
              </div>
            </div> */}
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {vehicleType.map((data) => (
                    <SelectItem key={data.id} value={data.name}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full text-sm font-semibold h-10" size="lg">
            <MapPin className="w-5 h-5 mr-2" />
            Find a ride
          </Button>
        </div>
      </motion.div>
      {/* Map Components */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="md:order-last md:col-span-7"
      >
        <div className="rounded-lg overflow-hidden border-2 border-primary bg-card text-card-foreground w-full h-[350px] lg:h-[560px]">
          <MapComponent />
        </div>
      </motion.div>
      <div className="flex flex-col gap-3 md:col-span-5">
        {/* desktop search Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block rounded-lg border-2 border-primary bg-card text-card-foreground shadow-lg"
        >
          <div className="p-2 lg:p-6 space-y-2 md:space-y-4">
            <h2 className="text-lg font-semibold text-primary">Book a ride</h2>
            <div className="space-y-4">
              <div className="relative">
                <CircleDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                <Input
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={handlePickupChange}
                  onFocus={() => setFocusedInput("pickup")}
                  className="pl-10"
                />
                <AnimatePresence>
                  {focusedInput === "pickup" && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full bg-background border border-input rounded-md mt-1 shadow-lg"
                    >
                      <li
                        className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                        onClick={handleSetYourLocation}
                      >
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Your location</span>
                      </li>
                      {pickupSuggestions?.map((data, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                          onClick={() => handleSuggestionClick(data, "pickup")}
                        >
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <div className="flex flex-col gap-1">
                            {bengali ? (
                              <span className="w-full">
                                {data?.address_bn
                                  ? data?.address_bn
                                  : data?.address}
                              </span>
                            ) : (
                              <span className="w-full">{data?.address}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <SquareDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                <Input
                  placeholder="Destination"
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => setFocusedInput("destination")}
                  className="pl-10"
                />
                <AnimatePresence>
                  {focusedInput === "destination" &&
                    destinationSuggestions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full bg-background border border-input rounded-md mt-1 shadow-lg"
                      >
                        {destinationSuggestions.map((data, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                            onClick={() =>
                              handleSuggestionClick(data, "destination")
                            }
                          >
                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                            {bengali ? (
                              <span className="w-full">
                                {data?.address_bn
                                  ? data?.address_bn
                                  : data?.address}
                              </span>
                            ) : (
                              <span className="w-full">{data?.address}</span>
                            )}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                </AnimatePresence>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-1">
                  Select Vehicle
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vehicleType.map((data) => (
                    <span
                      key={data.id}
                      className={`rounded-md text-sm flex justify-center items-center cursor-pointer py-1 ${
                        takeVehicle === data.id
                          ? "border-2 border-primary text-primary font-bold"
                          : "border font-semibold text-gray-800"
                      }`}
                      onClick={() => setTakeVehicle(data.id)}
                    >
                      {data.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-full text-sm font-semibold h-10" size="lg">
              <MapPin className="w-5 h-5 mr-2" />
              Find a ride
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="p-2 lg:p-6 space-y-2 md:space-y-4">
            <h2 className="text-lg font-semibold">Popular destinations</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Sugandha Sea Beach
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Dolphin Mor
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Laboni Beach
              </Button>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="p-2 lg:p-6 space-y-2 md:space-y-4">
            <h2 className="text-lg font-semibold">Why CoxsCab?</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <ScanEye className="mr-2 h-4 w-4 text-blue-500" />
                <span>Full security through District Police</span>
              </div>
              <div className="flex items-center">
                <BrainCog className="mr-2 h-4 w-4 text-green-500" />
                <span>Trained driver</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-400" />
                <span>Top-rated drivers</span>
              </div>
              <div className="flex items-center">
                <Car className="mr-2 h-4 w-4 text-green-500" />
                <span>Wide range of vehicles</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                <span>24/7 availability</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
