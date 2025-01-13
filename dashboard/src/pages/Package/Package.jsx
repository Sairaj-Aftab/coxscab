import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "@/components/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Edit, Loader2, MapPin, Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DataTable from "react-data-table-component";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import useAuth from "@/store/useAuth";
import useVehicleType from "@/store/useVehicleType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
} from "@/service/package.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link, useParams } from "react-router-dom";

const endPlaceSchema = z.object({
  id: z.number().optional(),
  address: z.string(),
  address_bn: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  city_bn: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
  area_bn: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  latitude: z.number().or(z.string()).optional(),
  longitude: z.number().or(z.string()).optional(),
});

const formSchema = z.object({
  vehicleTypeId: z.string().min(1, {
    message: "Please select a vehicle type.",
  }),
  endAddress: z.string().min(5, {
    message: "Please enter an destination.",
  }),
  duration: z
    .string()
    .transform((value) => parseFloat(value))
    .optional(),
  extraCharge: z
    .object({
      price: z
        .string()
        .transform((value) => parseInt(value))
        .optional(),
    })
    .optional(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Price must be a valid number with up to 2 decimal places.",
    })
    .transform((value) => parseFloat(value)),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  seat: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  endPlaces: z
    .array(endPlaceSchema)
    .min(1, "At least one destination is required"),
  status: z.boolean().default(true),
});

const Package = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { auth } = useAuth();
  const { types } = useVehicleType();
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [focusedInput, setFocusedInput] = useState(false);
  const [bengali, setBengali] = useState(false);
  const bengaliRegex = /[\u0980-\u09FF]/;
  // eslint-disable-next-line no-control-regex
  const englishRegex = /^[\u0000-\u007F]*$/;
  // Get packages
  const { data, isLoading } = useQuery({
    queryKey: [
      "packages",
      {
        typeId: params?.id !== "all" ? params?.id : undefined,
        search,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getPackages({
        typeId: params?.id !== "all" ? params?.id : undefined,
        search,
        page,
        limit,
      }),
  });
  // Create package
  const {
    mutateAsync: createNewPackage,
    data: createData,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createPackage,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "packages",
          {
            typeId: params?.id !== "all" ? params?.id : undefined,
            search,
            page,
            limit,
          },
        ],
        (oldData = { packages: [] }) => ({
          ...oldData,
          packages: [data.package, ...oldData.packages],
        })
      );
      toast({
        title: "Success!",
        description: `${data?.message}`,
      });
      setIsDialogOpen(false);
      form.reset();
    },
  });
  // Update Package
  const {
    mutateAsync: updatePackageData,
    isPending: updateLoading,
    error: updateError,
  } = useMutation({
    mutationFn: updatePackage,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "packages",
          {
            typeId: params?.id !== "all" ? params?.id : undefined,
            search,
            page,
            limit,
          },
        ],
        (oldData = { packages: [] }) => ({
          ...oldData,
          packages: oldData.packages.map((item) =>
            item.id === data?.package.id ? data?.package : item
          ),
        })
      );
      toast({
        title: "Success!",
        description: `${data?.message}`,
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      form.reset();
    },
  });
  // Delete package
  const { mutateAsync: deletePackageData, error: deleteError } = useMutation({
    mutationFn: deletePackage,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "packages",
          {
            typeId: params?.id !== "all" ? params?.id : undefined,
            search,
            page,
            limit,
          },
        ],
        (oldData = { packages: [] }) => ({
          ...oldData,
          packages: oldData.packages.filter(
            (item) => item.id !== data?.package.id
          ),
        })
      );
    },
  });
  // Handle Search, pagination and filtering data using react table
  // Packages

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleTypeId: "",
      endAddress: "",
      price: undefined,
      duration: undefined,
      extraCharge: { price: undefined }, // 15 min
      description: "",
      seat: undefined,
      endPlaces: [],
      status: true,
    },
  });

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    if (e.target.value?.length > 0) {
      if (bengaliRegex.test(e.target.value)) {
        setBengali(true);
      } else if (englishRegex.test(e.target.value)) {
        setBengali(false);
      } else {
        setBengali(false);
      }

      const res = await axios.get(
        `https://barikoi.xyz/v2/api/search/autocomplete/place?api_key=${
          import.meta.env.VITE_BK_ACCESS_TOKEN
        }&q=${e.target.value}&bangla=true`
      );

      setDestinationSuggestions(res.data?.places);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const currentEndPlaces = form.getValues("endPlaces");

    const isRouteSelected = currentEndPlaces.some(
      (route) => route.id === parseFloat(suggestion.id)
    );

    if (!isRouteSelected) {
      const updatedRoutes = [
        ...currentEndPlaces,
        {
          id: suggestion.id,
          address: suggestion.address,
          address_bn: suggestion.address_bn,
          city: suggestion.city,
          city_bn: suggestion.city_bn,
          area: suggestion.area,
          area_bn: suggestion.area_bn,
          district: suggestion.district,
          postcode: String(suggestion?.postCode),
          latitude: suggestion.latitude,
          longitude: suggestion.longitude,
        },
      ];
      form.setValue("endPlaces", updatedRoutes);
    }

    // setSelected(updatedRoutes);
    setDestination("");
    setDestinationSuggestions([]);
    setFocusedInput(false);
  };

  const handleRemoveDestination = (id) => {
    const updatedRoutes = form
      .getValues("endPlaces")
      ?.filter((route) => route.id !== id);
    form.setValue("endPlaces", updatedRoutes);
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    // Map `data.endPoint` to the desired structure
    const mappedEndPlaces = (data.endPoint || []).map((place) => ({
      id: place?.mapId,
      address: place?.address,
      address_bn: place?.address_bn,
      city: place?.city,
      city_bn: place?.city_bn,
      area: place?.area,
      area_bn: place?.area_bn,
      district: place?.district,
      postcode: String(place?.postcode),
      latitude: place?.location?.coordinates[1], // Extract latitude
      longitude: place?.location?.coordinates[0], // Extract longitude
    }));

    form.setValue("vehicleTypeId", data?.vehicleTypeId);
    form.setValue("endAddress", data?.endAddress);
    form.setValue("price", String(data.price));
    form.setValue("duration", String(data?.duration));
    form.setValue("extraCharge.price", String(data?.extraCharge?.price));
    form.setValue("description", data?.description);
    form.setValue("seat", String(data?.seat));
    form.setValue("status", data?.status);
    form.setValue("endPlaces", mappedEndPlaces);

    setIsDialogOpen(true);
  };

  async function onSubmit(data) {
    if (data.endPlaces?.length === 0) {
      form.setError("endPlaces", {
        type: "manual",
        message: "Please select at least one route.",
      });
      return;
    }
    if (isEditing) {
      await updatePackageData({
        id: currentData.id,
        formData: data,
      });
    } else {
      await createNewPackage(data);
    }
  }

  const handleDelete = async (id) => {
    await deletePackageData(id);
  };

  useEffect(() => {
    if (createError || updateError || deleteError) {
      toast({
        variant: "destructive",
        title: `${
          createError?.message || updateError?.message || deleteError?.message
        }`,
      });
    }
  });

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    // {
    //   name: "Vehicle Type",
    //   selector: (row) => row.vehicleType?.name,
    //   sortable: true,
    //   width: "150px",
    // },
    {
      name: "Destination",
      selector: (row) => row.endAddress,
    },
    {
      name: "Duration",
      cell: (row) => <p>{row.duration ? row.duration + " min" : ""}</p>,
    },
    {
      name: "Seat",
      selector: (row) => row.seat,
      width: "60px",
    },
    {
      name: "Fare",
      selector: (row) => row.price,
      sortable: true,
      width: "80px",
    },
    {
      name: "Extra Charge",
      selector: (row) => row?.extraCharge?.price,
      sortable: true,
      width: "80px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row?.status ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Destination",
      cell: (row) => {
        return (
          <div className="flex flex-wrap gap-1 py-1">
            {row?.endPoint?.map((data, index) => (
              <span
                key={index}
                className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
              >
                {data?.address}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      name: "Action",
      selector: (row) => row,
      cell: (row) => (
        <div>
          <Button
            variant="ghost"
            size="icon"
            disabled={auth?.role?.name === "VIEWER"}
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={auth?.role?.name === "VIEWER"}
                // onClick={() => handleDelete(row.id)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      width: "90px",
      style: {
        padding: "0",
      },
    },
    // {
    //   name: "Date",
    //   selector: (row) => formatDate(row.createdAt),
    //   sortable: true,
    // },
    // {
    //   name: "Status",
    //   cell: (row) => (
    //     <span
    //       className={`px-2 py-1 rounded-full text-xs font-semibold ${
    //         row.status === "PENDING"
    //           ? "bg-yellow-100 text-yellow-800"
    //           : row.status === "APPROVED"
    //           ? "bg-green-100 text-green-800"
    //           : "bg-red-100 text-red-800"
    //       }`}
    //     >
    //       {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
    //     </span>
    //   ),
    //   sortable: true,
    // },
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <div className="flex space-x-2">
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           <Button variant="outline" size="sm">
    //             <ChevronDown className="w-4 h-4 mr-1" />
    //             Details
    //           </Button>
    //         </DialogTrigger>
    //         <DialogContent>
    //           <DialogHeader>
    //             <DialogTitle>Review Details</DialogTitle>
    //           </DialogHeader>
    //           <div className="space-y-4">
    //             <div className="flex flex-col gap-2">
    //               {row.comment && (
    //                 <div className="border rounded-md p-2">
    //                   <Label>Comment</Label>
    //                   <p className="mt-1">{row.comment}</p>
    //                 </div>
    //               )}

    //               {(row.reviewer?.phone || row?.reviewerPhone) && (
    //                 <div className="border rounded-md p-2">
    //                   <Label>Phone Number</Label>
    //                   <p className="mt-1">
    //                     {row.reviewer?.phone
    //                       ? row.reviewer?.phone
    //                       : row?.reviewerPhone}
    //                   </p>
    //                 </div>
    //               )}
    //               <div className="border rounded-md p-2">
    //                 <Label>IP Address</Label>
    //                 <p className="mt-1">{row.ipAddress}</p>
    //               </div>
    //             </div>
    //             {row.status === "PENDING" && (
    //               <div className="flex space-x-2">
    //                 <Button
    //                   onClick={() => handleStatusChange(row.id, "APPROVED")}
    //                   className="flex-1"
    //                   disabled={updateLoading}
    //                 >
    //                   {updateLoading ? (
    //                     <Loader2 className="w-4 h-4 mr-1 animate-spin" />
    //                   ) : (
    //                     <>
    //                       <Check className="w-4 h-4 mr-1" />
    //                       Approve
    //                     </>
    //                   )}
    //                 </Button>
    //                 <Button
    //                   onClick={() => handleStatusChange(row.id, "REJECTED")}
    //                   variant="destructive"
    //                   className="flex-1"
    //                   disabled={updateLoading}
    //                 >
    //                   {updateLoading ? (
    //                     <Loader2 className="w-4 h-4 mr-1 animate-spin" />
    //                   ) : (
    //                     <>
    //                       <X className="w-4 h-4 mr-1" />
    //                       Reject
    //                     </>
    //                   )}
    //                 </Button>
    //               </div>
    //             )}
    //           </div>
    //         </DialogContent>
    //       </Dialog>
    //       {row.reported && <Flag className="w-5 h-5 text-red-500" />}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <PageHeader
        title2={"Package"}
        button1={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsDialogOpen(true);
                  form.reset();
                  setIsEditing(false);
                }}
              >
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="p-2">
              <DialogHeader>
                <DialogTitle>Add New Package</DialogTitle>
              </DialogHeader>

              <ScrollArea className="h-[80vh] pr-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                  >
                    {/* VehicleTypeId */}
                    <FormField
                      control={form.control}
                      name="vehicleTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {types?.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Destination */}
                    <FormField
                      control={form.control}
                      name="endAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter destination" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-1">
                      {/* Seat */}
                      <FormField
                        control={form.control}
                        name="seat"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Seat Count</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter seat count (Optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Duration */}
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter duration (Optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-1">
                      {/* Price */}
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Fare</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter fare"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Extra Charge */}
                      <FormField
                        control={form.control}
                        name="extraCharge"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Extra Charge (15 min)</FormLabel>
                            <FormField
                              control={form.control}
                              name="extraCharge.price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Extra Fare"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* End Places */}
                    <FormField
                      control={form.control}
                      name="endPlaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="destination-input">
                            Add Routes
                          </FormLabel>
                          <div className="relative">
                            <Input
                              id="destination-input"
                              placeholder="Destination point"
                              value={destination}
                              onChange={handleDestinationChange}
                              onFocus={() => setFocusedInput(true)}
                              onBlur={() =>
                                setTimeout(() => setFocusedInput(false), 200)
                              }
                            />
                            {focusedInput &&
                              destinationSuggestions?.length > 0 && (
                                <ul className="absolute z-10 w-full bg-background border border-input rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                                  {destinationSuggestions.map((data, index) => (
                                    <li
                                      key={index}
                                      className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                                      onClick={() =>
                                        handleSuggestionClick(data)
                                      }
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" ||
                                          e.key === " "
                                        ) {
                                          handleSuggestionClick(data);
                                        }
                                      }}
                                      tabIndex={0}
                                      role="option"
                                      aria-selected={false}
                                    >
                                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                      <span className="w-full">
                                        {bengali && data?.address_bn
                                          ? data.address_bn
                                          : data.address}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                          {field.value?.length > 0 && (
                            <div className="mt-2 space-y-2">
                              <FormLabel>Selected Destinations</FormLabel>
                              <ul className="space-y-2">
                                {field.value?.map((route, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="text-sm"
                                    >
                                      {bengali && route.address_bn
                                        ? route.address_bn
                                        : route.address}
                                    </Badge>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveDestination(route.id)
                                      }
                                      aria-label={`Remove ${route.address}`}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter package description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">
                              Active Status
                            </FormLabel>
                            <FormDescription>
                              Set the package as active or inactive.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={createLoading || updateLoading}
                    >
                      {createLoading || updateLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Please wait...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </form>
                </Form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="bg-white shadow-md rounded-md">
        <div className="p-1">
          <ul className="flex flex-wrap justify-center gap-3 items-center pb-2 text-sm font-semibold">
            <li
              className={`border border-primary rounded-md py-1 px-2 ${
                params?.id === "all"
                  ? "bg-primary text-white"
                  : "bg-white text-primary"
              }`}
            >
              <Link to={`/package/all`}>All</Link>
            </li>
            {types?.map((type) => (
              <li
                key={type.id}
                className={`border border-primary rounded-md py-1 px-2 ${
                  type.id === params?.id
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                }`}
              >
                <Link to={`/package/${type.id}`}>{type.name}</Link>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder={`Search package of ${
              types?.find((type) => type.id === params?.id)?.name || ""
            }`}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.packages}
          responsive
          progressPending={isLoading}
          progressComponent={
            <div className="h-[50vh] flex items-center justify-center">
              <LoadingComponent loader={isLoading} />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={data?.totalPackages}
          onChangeRowsPerPage={(rowsPerPage) => setLimit(rowsPerPage)}
          onChangePage={(page) => setPage(page)}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
        />
      </div>
    </div>
  );
};

export default Package;
