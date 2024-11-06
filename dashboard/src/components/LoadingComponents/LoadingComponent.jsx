import HashLoader from "react-spinners/HashLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#0ea5e9",
};

// eslint-disable-next-line react/prop-types
const LoadingComponent = ({ loader }) => {
  return (
    <div>
      <HashLoader
        color="#0ea5e9"
        loading={loader}
        cssOverride={override}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingComponent;
