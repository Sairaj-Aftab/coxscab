"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Loader2, Navigation2, Star, ThumbsUp } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelect } from "@/components/ui/multi-select";
import { isPhoneNumber } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { createReview } from "@/service/review.service";
import { useAuthUser } from "@/store/authUser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

const reviewSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  reviewerPhone: z
    .string()
    .refine(isPhoneNumber, {
      message: "Please enter a valid Bangladeshi phone number.",
    })
    .optional()
    .or(z.literal("")),
  rating: z.number().min(1, "Please provide a rating").max(5),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters long")
    .max(500, "Comment must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
  aspects: z
    .object({
      friendliness: z.boolean(),
      timeliness: z.boolean(),
      navigation: z.boolean(),
    })
    .optional(),
});

const ReviewFormPage = ({ driver }) => {
  const [ipAddress, setIpAddress] = useState("");
  const [ipError, setIpError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [loader, setLoader] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const { user } = useAuthUser();

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      reviewerPhone: "",
      rating: 0,
      comment: "",
      aspects: {
        friendliness: false,
        timeliness: false,
        navigation: false,
      },
    },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const rating = watch("rating");
  const aspects = watch("aspects") || {};

  const onSubmit = async (data) => {
    setLoader(true);
    // Remove empty optional fields
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    if (cleanedData.aspects) {
      cleanedData.aspects = Object.fromEntries(
        Object.entries(cleanedData.aspects).filter(([_, v]) => v === true)
      );
      if (Object.keys(cleanedData.aspects).length === 0) {
        delete cleanedData.aspects;
      }
    }

    try {
      const res = await createReview({
        ...cleanedData,
        type: user ? "RIDER" : "PUBLIC",
        ipAddress,
        reviewerId: user?.id,
        driverId: driver.id,
      });
      if (res) {
        setShowAlertDialog(true);
        setLoader(false);
        form.reset();
      }
    } catch (error) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        setIpError("Failed to fetch IP address.");
      }
    };

    fetchIP();
  }, []);

  return (
    <>
      <Card className="w-[93%] max-w-lg mx-auto my-5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Rate Your Trip</CardTitle>
          <CardDescription>
            How was your ride with {driver?.name}?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {!user && (
                <>
                  {/* Name */}
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Phone */}
                  <FormField
                    control={control}
                    name="reviewerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {/* Rating */}
              <FormField
                control={control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              star <= (hoverRating || field.value)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => field.onChange(star)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Comment */}
              <FormField
                control={control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Aspects */}
              <FormField
                control={control}
                name="aspects"
                render={() => (
                  <FormItem>
                    <FormLabel>What went well?</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        <Controller
                          name="aspects.friendliness"
                          control={control}
                          render={({ field }) => (
                            <Button
                              type="button"
                              variant={
                                aspects.friendliness ? "default" : "outline"
                              }
                              onClick={() => field.onChange(!field.value)}
                              className="flex items-center"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Friendly
                            </Button>
                          )}
                        />
                        <Controller
                          name="aspects.timeliness"
                          control={control}
                          render={({ field }) => (
                            <Button
                              type="button"
                              variant={
                                aspects.timeliness ? "default" : "outline"
                              }
                              onClick={() => field.onChange(!field.value)}
                              className="flex items-center"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              On Time
                            </Button>
                          )}
                        />
                        <Controller
                          name="aspects.navigation"
                          control={control}
                          render={({ field }) => (
                            <Button
                              type="button"
                              variant={
                                aspects.navigation ? "default" : "outline"
                              }
                              onClick={() => field.onChange(!field.value)}
                              className="flex items-center"
                            >
                              <Navigation2 className="w-4 h-4 mr-2" />
                              Great Route
                            </Button>
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loader}
            className="w-full"
          >
            {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
            Review
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review Submitted Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for your feedback. Your review has been submitted and
              will be visible after approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href={"/"} onClick={() => setShowAlertDialog(false)}>
              <AlertDialogAction>Okay</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewFormPage;
