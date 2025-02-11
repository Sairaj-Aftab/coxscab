import Image from "next/image";

import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import WhyYouChoose from "@/components/WhyYouChoose";
import HowItWork from "@/components/HowItWork";
import ReviewSection from "@/components/ReviewSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection
        subTitle="CoxsCab is an initiative by Cox’s Bazar District Police"
        title="Safe & Symphonic"
        description={`COXSCAB is a "National Award Winner Innovation" and it aims to fostering a secure and tourism-friendly traffic management in tourist area, as well as to ensure a harmonious blend of safety and hospitality for all tourists.`}
      />
      <WhyYouChoose />
      <HowItWork />
      <ReviewSection />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to Ride?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
              Download our app now and experience the future of ridesharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* <Button className="flex items-center justify-center">
                  <Apple className="mr-2 h-5 w-5" /> Download for iOS
                </Button> */}
              <Button
                variant="outline"
                className="flex items-center justify-center text-black "
              >
                <Image
                  src="/google-play-logo.png"
                  alt="Google Play"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Get it on Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
