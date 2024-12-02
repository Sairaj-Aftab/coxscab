import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useMapCoordinates = create(
  devtools(
    (set) => ({
      userCoordinates: null,
      picupCoordinates: null,
      destinationCoordinates: null,
      directionData: null,
      error: null,
      setPicupCoordinates: (data) =>
        set(() => ({
          picupCoordinates: {
            lat: data.latitude,
            lng: data.longitude,
            me: data.me && true,
          },
        })),
      setDestinationCoordinates: (data) =>
        set(() => ({
          destinationCoordinates: { lat: data.latitude, lng: data.longitude },
        })),
      setUserCoordinates: (data) =>
        set(() => ({
          userCoordinates: { lat: data.lat, lng: data.lng },
        })),
      setDirectionData: (data) =>
        set(() => ({
          directionData: data,
        })),
    }),
    {
      name: "Map Cordinates",
    }
  )
);
