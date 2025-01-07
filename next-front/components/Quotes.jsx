import { motion } from "framer-motion";
import { BrainCog, Car, Clock, ScanEye, Star } from "lucide-react";

const Quotes = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="p-2 lg:p-6 space-y-2 md:space-y-4">
        <h2 className="text-lg font-semibold">Why CoxsCab?</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <ScanEye className="mr-2 h-4 w-4 text-blue-500" />
            <span>Full security through District Police</span>
          </div>
          <div className="flex items-center">
            <BrainCog className="mr-2 h-4 w-4 text-green-500" />
            <span>Trained driver</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4 text-yellow-400" />
            <span>Top-rated drivers</span>
          </div>
          <div className="flex items-center">
            <Car className="mr-2 h-4 w-4 text-green-500" />
            <span>Wide range of vehicles</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            <span>24/7 availability</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Quotes;
