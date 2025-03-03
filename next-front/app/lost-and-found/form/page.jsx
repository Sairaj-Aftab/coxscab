"use client";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { reportFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const LostAndFoundForm = () => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [maxDateTime, setMaxDateTime] = useState("");

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMaxDateTime(now.toISOString().slice(0, 16));
  }, []);

  const form = useForm({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reportType: "",
      statusType: "",
      name: "",
      phone: "",
      address: "",
      place: "",
      dateTime: "",
      goods: "",
      description: "",
      images: [],
      policeReport: "",
    },
  });

  const submitReport = async (url, { arg }) => {
    try {
      const response = await axios.post(url, arg, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const err = new Error(
        error.response?.data?.message ||
          "An error occurred while submitting the form."
      );
      err.info = error.response?.data;
      err.status = error.response?.status;
      throw err;
    }
  };

  const { trigger, isMutating, error } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_OBT_API}/lost-found/create`,
    submitReport
  );

  async function onSubmit(data) {
    // Here you would typically send the data to your backend
    const formData = new FormData();

    // Append all regular fields
    Object.keys(data).forEach((key) => {
      if (key !== "images") {
        formData.append(key, data[key]);
      }
    });

    // Append files with the SAME FIELD NAME
    data.images.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const result = await trigger(formData);
      form.reset();
      setFiles([]);
      setPreviews([]);
      toast({
        title: "Success!",
        description: `${result?.message}`,
      });
      router.push("/lost-and-found");

      // Handle success here (e.g., show toast notification)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error submitting form",
        description: err.message,
      });
    }
  }

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      form.setValue("images", [...form.getValues("images"), ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    form.setValue(
      "images",
      form.getValues("images").filter((_, i) => i !== index)
    );
  };
  return (
    <Card className="w-full max-w-2xl mx-auto mb-10">
      <CardHeader>
        <CardTitle>New Report Entry</CardTitle>
        <CardDescription>
          Please fill out the form below to submit a new report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Please select the type of report:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="LOST" />
                        </FormControl>
                        <FormLabel className="font-normal !mt-0">
                          Lost Report
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="FOUND" />
                        </FormControl>
                        <FormLabel className="font-normal !mt-0">
                          Found Report
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reporter Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile No</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Provide a valid contact number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your current address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statusType"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
                    <FormLabel>Status:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4 !mt-0"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="tourist" />
                          </FormControl>
                          <FormLabel className="font-normal !mt-0">
                            Tourist
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="local" />
                          </FormControl>
                          <FormLabel className="font-normal !mt-0">
                            Local Citizen
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Incident Details:</h3>
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Lost/Found</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify the location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        max={maxDateTime}
                        {...field}
                        value={field.value ? field.value.slice(0, 16) : ""}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date.toISOString());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goods</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="List the lost or found items"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("images")?.click()
                            }
                          >
                            <UploadIcon className="mr-2 h-4 w-4" />
                            Upload Images
                          </Button>
                          <FormDescription>
                            {files.length > 0
                              ? `${files.length} file(s) selected`
                              : "Upload images if available"}
                          </FormDescription>
                        </div>
                        {previews.length > 0 && (
                          <div className="grid grid-cols-3 gap-4">
                            {previews.map((preview, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={preview || ""}
                                  alt={`Preview ${index + 1}`}
                                  width={300}
                                  height={300}
                                  className="rounded-md object-cover w-full aspect-square"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policeReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Police Report Info</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mention if reported, along with the case number, if applicable"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Give a detailed description of the incident, including any relevant details about how the item was lost or found."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isMutating}>
              {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isMutating ? "Please wait..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LostAndFoundForm;
