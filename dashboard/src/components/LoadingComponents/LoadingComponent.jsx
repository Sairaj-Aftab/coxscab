import HashLoader from "react-spinners/HashLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#0ea5e9",
};

const LoadingComponent = ({ loader }) => {
  return (
    <div>
      <HashLoader
        color="#0ea5e9"
        loading={loader}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingComponent;
