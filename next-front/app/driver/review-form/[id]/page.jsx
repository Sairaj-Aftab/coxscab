"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Navigation2, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";

const ReviewForm = ({ driverName = "John Doe" }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [aspects, setAspects] = useState({
    friendliness: false,
    timeliness: false,
    navigation: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the review data to your backend
    console.log({ rating, comment, aspects });
    // Reset form after submission
    setRating(0);
    setComment("");
    setAspects({ friendliness: false, timeliness: false, navigation: false });
  };

  return (
    <Card className="w-[93%] max-w-lg mx-auto my-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rate Your Trip</CardTitle>
        <CardDescription>How was your ride with {driverName}?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Overall Rating
              </Label>
              <div className="flex items-center" id="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Comments
              </Label>
              <Textarea
                id="comment"
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                What went well?
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={aspects.friendliness ? "default" : "outline"}
                  onClick={() =>
                    setAspects({
                      ...aspects,
                      friendliness: !aspects.friendliness,
                    })
                  }
                  className="flex items-center"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Friendly
                </Button>
                <Button
                  type="button"
                  variant={aspects.timeliness ? "default" : "outline"}
                  onClick={() =>
                    setAspects({ ...aspects, timeliness: !aspects.timeliness })
                  }
                  className="flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  On Time
                </Button>
                <Button
                  type="button"
                  variant={aspects.navigation ? "default" : "outline"}
                  onClick={() =>
                    setAspects({ ...aspects, navigation: !aspects.navigation })
                  }
                  className="flex items-center"
                >
                  <Navigation2 className="w-4 h-4 mr-2" />
                  Great Route
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Submit Review
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewForm;
