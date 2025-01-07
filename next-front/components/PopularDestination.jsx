import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

const PopularDestination = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="p-2 lg:p-6 space-y-2 md:space-y-4">
        <h2 className="text-lg font-semibold">Popular destinations</h2>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <MapPin className="mr-2 h-4 w-4" />
            Sugandha Sea Beach
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MapPin className="mr-2 h-4 w-4" />
            Dolphin Mor
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MapPin className="mr-2 h-4 w-4" />
            Laboni Beach
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PopularDestination;
