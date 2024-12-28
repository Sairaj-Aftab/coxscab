"use client";
import React, { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/store/authUser";
import { motion } from "framer-motion";
import { Car, KeyRound, Loader2, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import logo from "@/public/logo1.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginUser, registerUser, sendLoginOTP } from "@/service/auth.service";
import {
  clearOtpExpiration,
  getOtpExpiration,
  isPhoneNumber,
} from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const signUpSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  phone: z.string().refine(isPhoneNumber, {
    message: "Please enter a valid Bangladeshi phone number.",
  }),
  role: z.enum(["CUSTOMER", "DRIVER"]),
  device: z.optional(
    z.object({
      browser: z.optional(
        z.object({
          name: z.optional(z.string()),
          version: z.optional(z.string()),
          major: z.optional(z.string()),
        })
      ),
      device: z.optional(
        z.object({
          type: z.optional(z.string()),
          vendor: z.optional(z.string()),
          model: z.optional(z.string()),
        })
      ),
      os: z.optional(
        z.object({
          name: z.optional(z.string()),
          version: z.optional(z.string()),
        })
      ),
    })
  ),
  platform: z.optional(z.string()),
  ipAddress: z.optional(z.string()),
  location: z.optional(
    z.object({ latitude: z.number(), longitude: z.number() })
  ),
});

const loginSchema = z.object({
  phone: z.string().refine(isPhoneNumber, {
    message: "Please enter a valid Bangladeshi phone number.",
  }),
});

const otpSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be 6 digits.",
  }),
});

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AuthPage = () => {
  const router = useRouter();
  const { setLogin } = useAuthUser();
  const [activeTab, setActiveTab] = useState("signup");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [browser, setBrowser] = useState(null);
  const [device, setDevice] = useState(null);
  const [os, setOs] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loader, setLoader] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      activeTab === "signup"
        ? signUpSchema
        : activeTab === "login"
        ? loginSchema
        : otpSchema
    ),
    defaultValues: {
      name: "",
      phone: "",
      role: "CUSTOMER",
      otp: "",
      device: null,
      platform: "web",
      ipAddress: "",
      location: null,
    },
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      form.setValue("location", {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
    const parser = new UAParser();
    const result = parser.getResult();
    form.setValue("device", {
      browser: result.browser,
      device: result.device,
      os: result.os,
    });
    setBrowser(result.browser);
    setDevice(result.device);
    setOs(result.os);
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        form.setValue("ipAddress", response?.data?.ip);
        setIpAddress(response?.data?.ip);
      } catch (error) {}
    };

    fetchIpAddress();
  }, []);

  async function onSubmit(values) {
    setLoader(true);
    if (activeTab === "signup" || activeTab === "login") {
      if (activeTab === "signup") {
        try {
          const data = await registerUser(values);
          if (data?.user) {
            setPhoneNumber(data.user?.phone);
            setActiveTab("otp");
            setLoader(false);
          }
        } catch (error) {
          toast({
            title: error.response.data.message,
            variant: "destructive",
          });
          setLoader(false);
        }
      }
      if (activeTab === "login") {
        try {
          const data = await sendLoginOTP({
            role: "CUSTOMER",
            phone: values.phone,
          });
          if (data?.user) {
            setPhoneNumber(data.user?.phone);
            setActiveTab("otp");
            setLoader(false);
          }
        } catch (error) {
          toast({
            title: error.response.data.message,
            variant: "destructive",
          });
          setLoader(false);
        }
      }
    } else {
      try {
        const data = await loginUser({
          phone: phoneNumber,
          otp: values.otp,
          role: "CUSTOMER",
          platform: "web",
          device: {
            browser: browser,
            device: device,
            os: os,
          },
          ipAddress,
          location,
        });
        if (data) {
          router.refresh();
          setLogin(data);
          setLoader(false);
        }
      } catch (error) {
        toast({
          title: error.response.data.message,
          variant: "destructive",
        });
        setLoader(false);
      }
    }
  }

  const handleGetOTPAgain = async () => {
    try {
      setLoader(true);
      const data = await sendLoginOTP({ role: "CUSTOMER", phone: phoneNumber });
      if (data?.user) {
        setPhoneNumber(data.user?.phone);
        setActiveTab("otp");
        setLoader(false);
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
    const timer = setInterval(() => {
      const { remainingTime, removeExpiresAt } = getOtpExpiration();
      const currentTime = new Date().getTime();
      setTimeLeft(remainingTime);
      if (currentTime > removeExpiresAt) {
        clearOtpExpiration();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const storedData = localStorage.getItem("phone");
    if (storedData) {
      const { phone } = JSON.parse(storedData);
      setPhoneNumber(phone);
      setActiveTab("otp");
    }
  }, []);

  return (
    <div className="gradient-page flex items-center justify-center min-h-[calc(100vh-55px)] w-ful p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <Card className="rounded-xl md:rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="pb-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <motion.div
                className="inline-block border-2 border-primary rounded-full overflow-hidden"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="relative w-24 h-24">
                  <Image
                    src={logo}
                    alt="CoxsCab"
                    fill
                    sizes="(max-width: 96px) 100vw, 96px"
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
              <h1 className="text-lg md:text-2xl font-bold text-primary">
                Welcome to CoxsCab
              </h1>
              <p className="text-sm font-semibold text-muted-foreground">
                Secure, quick, and easy authentication
              </p>
            </motion.div>
          </CardHeader>
          <CardContent className="px-2 py-4 sm:p-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value)}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-3 mb-2 sm:mb-4">
                <TabsTrigger
                  value="signup"
                  disabled={activeTab === "otp"}
                  className="text-base font-semibold"
                >
                  Sign up
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  disabled={activeTab === "otp"}
                  className="text-base font-semibold"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="otp"
                  disabled={activeTab !== "otp"}
                  className="text-base font-semibold"
                >
                  OTP
                </TabsTrigger>
              </TabsList>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <TabsContent value="signup">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="signup">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input
                                {...field}
                                className="pl-10"
                                placeholder="01XXXXXXXXX"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="login">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input
                                {...field}
                                className="pl-10"
                                placeholder="01XXXXXXXXX"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="otp">
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground flex justify-between items-center">
                            <span>OTP</span>
                            <p>
                              {timeLeft > 0 ? (
                                <span>
                                  Expires in: {formatTime(Number(timeLeft))}
                                </span>
                              ) : (
                                <Button
                                  onClick={handleGetOTPAgain}
                                  className="bg-primary text-white rounded-md py-1 px-2 text-xs font-normal cursor-pointer h-fit"
                                  disabled={loader}
                                >
                                  {loader ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "GET OTP"
                                  )}
                                </Button>
                              )}
                            </p>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input
                                {...field}
                                className="pl-10"
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      OTP sent to: {phoneNumber}
                    </p>
                  </TabsContent>
                  <Button
                    type="submit"
                    className="w-full group text-sm font-semibold"
                    disabled={loader}
                  >
                    {activeTab === "signup"
                      ? "Sign up"
                      : activeTab === "login"
                      ? "Log in"
                      : "Verify OTP"}
                    {loader ? (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Car className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                    )}
                  </Button>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
