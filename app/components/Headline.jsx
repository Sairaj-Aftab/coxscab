const Headline = () => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "2px 0",
      }}
    >
      <div className="container">
        <marquee
          style={{ fontSize: "1rem", fontWeight: "500", color: "#010101" }}
        >
          "Coxscab is dedicated to fostering a secure and tourism-friendly
          traffic environment in Cox's Bazar, ensuring a harmonious blend of
          safety and hospitality for all visitors."
        </marquee>
      </div>
    </div>
  );
};

export default Headline;
