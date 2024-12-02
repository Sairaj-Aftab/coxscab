"use client";
import React, { useState } from "react";
import { Popup } from "react-map-gl";

const MapPopup = ({ lat, lng }) => {
  const [showPopup, setShowPopup] = useState(true);
  return (
    <>
      {showPopup && (
        <Popup
          longitude={lng}
          latitude={lat}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
          style={{
            fontWeight: "bold",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          You are here
        </Popup>
      )}
    </>
  );
};

export default MapPopup;
