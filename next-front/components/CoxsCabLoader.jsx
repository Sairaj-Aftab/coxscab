"use client";
const CoxsCabLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-full min-h-[200px]">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest flex flex-wrap justify-center">
        {"COXSCAB".split("").map((letter, index) => (
          <span
            key={index}
            className={`inline-block animate-bounce mx-1`}
            style={{
              animationDelay: `${index * 0.1}s`,
              color: `hsl(${index * 40}, 70%, 50%)`,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CoxsCabLoader;
