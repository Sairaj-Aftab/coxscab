import { Layer, Source } from "react-map-gl";

const MapBoxRoute = (props) => {
  return (
    <Source
      type="geojson"
      data={{
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "LineString", coordinates: props.coordinates },
          },
        ],
      }}
      lineMetrics={true}
    >
      <Layer
        type="line"
        source="route"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "#f00",
            0.5,
            "#0f0",
            1,
            "#00f",
          ],
          "line-width": 4,
        }}
      />
    </Source>
  );
};

export default MapBoxRoute;
