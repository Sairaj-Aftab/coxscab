"use client";
import { Triangle } from "react-loader-spinner";
const Loading = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Triangle
        visible={true}
        height="100"
        width="100"
        color="#00a653"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loading;
