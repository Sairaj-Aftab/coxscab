"use client";
import Map, {
  FullscreenControl,
  AttributionControl,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import MapMarker from "./MapMarker";
import { useMapCoordinates } from "@/store/mapCoordinates";
import axios from "axios";
import MapBoxRoute from "./MapBoxRoute";
import MapRouteDistanceTime from "./MapRouteDistanceTime";

const mapBoxDrivingEndPointApi =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

const MapComponent = () => {
  const mapRef = useRef(null);

  const {
    userCoordinates,
    picupCoordinates,
    destinationCoordinates,
    directionData,
    setUserCoordinates,
    setDirectionData,
  } = useMapCoordinates();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      setUserCoordinates({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);
  // Fly to picup location
  useEffect(() => {
    if (userCoordinates) {
      mapRef.current?.flyTo({
        center: [userCoordinates.lng, userCoordinates.lat],
        duration: 2500,
      });
    }
  }, [userCoordinates]);
  // Fly to picup location
  useEffect(() => {
    if (picupCoordinates) {
      mapRef.current?.flyTo({
        center: [picupCoordinates.lng, picupCoordinates.lat],
        duration: 2500,
      });
    }
  }, [picupCoordinates]);
  // Fly to destination location
  useEffect(() => {
    if (destinationCoordinates) {
      mapRef.current?.flyTo({
        center: [destinationCoordinates.lng, destinationCoordinates.lat],
        duration: 2500,
      });
    }
  }, [destinationCoordinates]);
  // Make route through Picup and Destination
  useEffect(() => {
    if (picupCoordinates && destinationCoordinates) {
      getDirectionRoute();
    }
  }, [destinationCoordinates, picupCoordinates]);

  const getDirectionRoute = async () => {
    const res = await axios.get(
      `${mapBoxDrivingEndPointApi}${picupCoordinates.lng},${picupCoordinates.lat};${destinationCoordinates.lng},${destinationCoordinates.lat}?overview=full&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
    );
    setDirectionData(res.data);
  };
  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: 92.0058, // Cox's Bazar center
          latitude: 21.4272,
          zoom: 16,
        }}
        className="w-full h-full"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        attributionControl={false}
      >
        <AttributionControl customAttribution="Map design by Sairaj Aftab" />
        <FullscreenControl />
        <NavigationControl />
        {/* <ScaleControl /> */}
        <MapMarker />
        {directionData?.routes && (
          <MapBoxRoute
            coordinates={directionData?.routes[0]?.geometry?.coordinates}
          />
        )}
      </Map>
      {directionData?.routes[0]?.geometry?.coordinates && (
        <div className="absolute bottom-1 right-1 z-50">
          <MapRouteDistanceTime />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
