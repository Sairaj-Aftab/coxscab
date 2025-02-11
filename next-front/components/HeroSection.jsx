"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position, title }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>{title}</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function HeroSection({ subTitle, title, description }) {
  // Handle the case where title is undefined
  const words = title ? title.split(" ") : [];

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center overflow-hidden bg-white dark:from-blue-900 dark:to-purple-900">
      <div className="absolute inset-0">
        <FloatingPaths position={1} title={title || ""} />
        <FloatingPaths position={-1} title={title || ""} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          {subTitle && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-6 inline-block"
            >
              <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary dark:text-blue-300 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
                {subTitle}
              </h4>
            </motion.div>
          )}

          {title && (
            <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold mb-3 tracking-tighter">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text 
                                 bg-gradient-to-r from-primary to-black 
                                 dark:from-blue-300 dark:to-purple-300"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
          )}

          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="mb-12"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-100 backdrop-blur-sm rounded-3xl p-3 shadow-lg inline-block">
                {description}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Button
              variant="default"
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-white"
            >
              Get it on Google Play
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
