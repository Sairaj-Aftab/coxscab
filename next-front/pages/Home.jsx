import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  Star,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection title="Your Ride, Your Way" />
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Convenient Pickup",
                  description: "Get picked up right where you are",
                },
                {
                  icon: Clock,
                  title: "Fast & Reliable",
                  description: "Count on us to be there on time",
                },
                {
                  icon: CreditCard,
                  title: "Affordable Rates",
                  description: "Enjoy competitive and transparent pricing",
                },
                {
                  icon: Smartphone,
                  title: "Easy to Use",
                  description: "Book your ride with just a few taps",
                },
              ].map((feature, index) => (
                <Card key={index}>
                  <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                    <feature.icon className="h-12 w-12 text-primary" />
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Download the App",
                  description:
                    "Get our free app from the App Store or Google Play",
                },
                {
                  step: "2",
                  title: "Book Your Ride",
                  description:
                    "Enter your destination and choose your ride type",
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              What Our Riders Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex",
                  comment: "Fast and reliable. My go-to ride service!",
                },
                {
                  name: "Sarah",
                  comment:
                    "Great drivers and always on time. Highly recommend!",
                },
                {
                  name: "Mike",
                  comment: "The app is so easy to use. Love the experience!",
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      "{testimonial.comment}"
                    </p>
                    <p className="font-bold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
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
                  className="flex items-center justify-center"
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
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 RideShare. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
