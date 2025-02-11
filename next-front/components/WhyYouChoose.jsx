import {
  ShieldCheck,
  BadgeCheck,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

const WhyYouChoose = () => {
  return (
    <section className="w-full py-5 lg:py-10 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6">
          Why You Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "Management by District Police",
              description:
                "Ensuring a safe and secure journey with police supervision.",
            },
            {
              icon: BadgeCheck,
              title: "Verified drivers",
              description:
                "All our drivers are background-checked for your safety.",
            },
            {
              icon: GraduationCap,
              title: "Drivers are trained by UNDP, ILO and BRTA",
              description:
                "Our drivers receive professional training for better service.",
            },
            {
              icon: MessageSquare,
              title: 'We take care of "Passengers Review"',
              description:
                "We value your feedback to enhance our service quality.",
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                <feature.icon className="h-12 w-12 text-primary" />
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyYouChoose;
