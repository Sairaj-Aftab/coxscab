import { Car } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="z-10 flex flex-col items-center">
        <Car className="w-16 h-16 text-white animate-bounce mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">CoxsCab</h1>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
        <p className="text-gray-200 mt-4">
          Finding the perfect ride for you...
        </p>
      </div>
      <div className="absolute bottom-0 w-full h-24">
        {/* Road */}
        <div className="absolute bottom-0 w-full h-20 bg-gray-800">
          {/* Road markings */}
          <div className="relative h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-2 w-16 bg-yellow-400"
                style={{
                  left: `${i * 25}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  animation: "moveLeft 2s linear infinite",
                }}
              />
            ))}
          </div>
        </div>

        {/* Cars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-8 w-12 h-6 bg-white rounded-md shadow-lg"
            style={{
              left: `${i * 40}%`,
              animation: `moveCar ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div className="absolute top-0 w-8 h-3 bg-white rounded-t-md mx-2" />
            <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-700 rounded-full" />
            <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-700 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
