const HowItWork = () => {
  return (
    <section className="w-full py-5 lg:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Download the App",
              description: "Get our free app from the App Store or Google Play",
            },
            {
              step: "2",
              title: "Book Your Ride",
              description: "Enter your destination and choose your ride type",
            },
            {
              step: "3",
              title: "Enjoy Your Trip",
              description:
                "Track your driver in real-time and ride safely to your destination",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-xl">
                {step.step}
              </div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
