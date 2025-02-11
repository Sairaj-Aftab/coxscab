import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const ReviewSection = () => {
  return (
    <section className="w-full py-5 lg:py-10 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6">
          What Our Riders Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Alex",
              comment: "Fast and reliable. My go-to ride service!",
            },
            {
              name: "Sarah",
              comment: "Great drivers and always on time. Highly recommend!",
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
                <p className="text-sm text-gray-500">"{testimonial.comment}"</p>
                <p className="font-bold">- {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
