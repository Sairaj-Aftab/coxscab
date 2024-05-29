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
          style={{ fontSize: "1rem", fontWeight: "400", color: "#010101" }}
        >
          'কক্স-ক্যাব' জাতীয় পর্যায়ে "স্মার্ট বাংলাদেশ পুরস্কার" প্রাপ্ত
          কক্সবাজার জেলা পুলিশের একটি পর্যটন-বান্ধব ইনোভেশন ******** পর্যটন নগরী
          কক্সবাজারে নিরাপদ ও স্বাচ্ছন্দ্যময় ভ্রমণের জন্য 'কক্স-ক্যাব' এর
          সহযোগিতা নিন
        </marquee>
      </div>
    </div>
  );
};

export default Headline;
