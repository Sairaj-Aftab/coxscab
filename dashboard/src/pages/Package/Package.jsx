import { useState } from "react";
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
import { useSelector } from "react-redux";
import { authData } from "@/features/auth/authSlice";
import { getVehicleTypeData } from "@/features/vehicleTypeSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Edit, Loader2, MapPin, Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useCreatePackageMutation,
  useGetPackagesQuery,
} from "@/app/services/packageApi";
import DataTable from "react-data-table-component";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";

const routeSchema = z.object({
  id: z.number(),
  address: z.string(),
  address_bn: z.string().optional(),
  city: z.string().optional(),
  city_bn: z.string().optional(),
  area: z.string().optional(),
  area_bn: z.string().optional(),
  district: z.string().optional(),
  postcode: z.number().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const formSchema = z.object({
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Price must be a valid number with up to 2 decimal places.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  vehicleTypeId: z.string().min(1, {
    message: "Please select a vehicle type.",
  }),
  seat: z.number().int().positive().optional(),
  routes: z
    .array(routeSchema)
    .min(1, {
      message: "Please select at least one route.",
    })
    .optional(),
  status: z.boolean().default(true),
});

const Package = () => {
  const { auth } = useSelector(authData);
  const { types } = useSelector(getVehicleTypeData);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [focusedInput, setFocusedInput] = useState(false);
  const [bengali, setBengali] = useState(false);
  const bengaliRegex = /[\u0980-\u09FF]/;
  // eslint-disable-next-line no-control-regex
  const englishRegex = /^[\u0000-\u007F]*$/;
  const { data, isLoading, isFetching } = useGetPackagesQuery({
    search,
    page,
    limit,
  });

  const [createPackage, { isLoading: createLoading }] =
    useCreatePackageMutation();
  const updateLoading = false;
  // Handle Search, pagination and filtering data using react table
  // Packages
  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setLimit(newPerPage);
  };
  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleTypeId: "",
      price: "",
      description: "",
      seat: undefined,
      routes: [],
      status: true,
    },
  });

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    if (e.target.value.length > 0) {
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

      // console.log(res?.data?.places);

      setDestinationSuggestions(res?.data?.places);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const currentRoutes = form.getValues("routes");

    const isRouteSelected = currentRoutes.some(
      (route) => route.id === parseFloat(suggestion.id)
    );

    if (!isRouteSelected) {
      const updatedRoutes = [
        ...currentRoutes,
        {
          id: suggestion.id,
          address: suggestion.address,
          address_bn: suggestion.address_bn,
          city: suggestion.city,
          city_bn: suggestion.city_bn,
          area: suggestion.area,
          area_bn: suggestion.area_bn,
          postcode: suggestion.postCode,
          latitude: String(suggestion.latitude),
          longitude: String(suggestion.longitude),
        },
      ];
      form.setValue("routes", updatedRoutes);
      console.log(form.getValues("routes"));
    }

    // setSelected(updatedRoutes);
    setDestination("");
    setDestinationSuggestions([]);
    setFocusedInput(false);
  };

  const handleRemoveDestination = (id) => {
    const updatedRoutes = form
      .getValues("routes")
      .filter((route) => route.id !== id);
    form.setValue("routes", updatedRoutes);
  };

  async function onSubmit(data) {
    if (data.routes.length === 0) {
      form.setError("routes", {
        type: "manual",
        message: "Please select at least one route.",
      });
      return;
    }
    if (isEditing) {
      // try {
      //   const res = await updateVehicle({
      //     id: currentData.id,
      //     ...data,
      //   }).unwrap();
      //   if (res?.message) {
      //     sonner("Success", {
      //       description: `${res?.message}`,
      //     });
      //     setIsDialogOpen(false);
      //     form.reset();
      //   }
      // } catch (error) {
      //   toast({
      //     variant: "destructive",
      //     title: `${error?.data?.message}`,
      //   });
      // }
      alert("Please try!");
    } else {
      try {
        const res = await createPackage(data).unwrap();
        if (res?.message || res?.success) {
          toast({
            title: "Success!",
            description: `${res?.message}`,
          });
          setOpen(false);
          form.reset();
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: `${error?.data?.message}`,
        });
      }
    }
  }

  const handleEdit = async (data) => {
    try {
      console.log(data.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${error?.data?.message}`,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${error?.data?.message}`,
      });
    }
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "Vehicle Type",
      selector: (row) => row.vehicleType?.name,
      sortable: true,
    },
    {
      name: "Seat",
      selector: (row) => row.seat,
    },
    {
      name: "Price",
      selector: (row) => row.price,
    },
    {
      name: "Destination",
      // selector: (row) =>
      //   row.routes?.map((data) => data.route?.endPoint?.address),
      cell: (row) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.routes?.map((data, index) => (
              <span
                key={index}
                className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
              >
                {data.route?.endPoint?.address}
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
          <Button
            variant="ghost"
            size="icon"
            disabled={auth?.role?.name === "VIEWER"}
            onClick={() => handleDelete(row.id)}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Package</Button>
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
                    <FormField
                      control={form.control}
                      name="seat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seat Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter seat count (Optional)"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter price" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="routes"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <Label htmlFor="destination-input">
                              Add Routes
                            </Label>
                            <Input
                              id="destination-input"
                              placeholder="Destination point"
                              value={destination}
                              onChange={handleDestinationChange}
                              onFocus={() => setFocusedInput(true)}
                            />
                            {focusedInput &&
                              destinationSuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-background border border-input rounded-md mt-1 shadow-lg">
                                  {destinationSuggestions.map((data, index) => (
                                    <li
                                      key={index}
                                      className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                                      onClick={() =>
                                        handleSuggestionClick(data)
                                      }
                                    >
                                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                      {bengali ? (
                                        <span className="w-full">
                                          {data?.address_bn
                                            ? data?.address_bn
                                            : data?.address}
                                        </span>
                                      ) : (
                                        <span className="w-full">
                                          {data?.address}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            {field.value.length > 0 && (
                              <div className="mt-1 space-y-1">
                                <Label>Selected Destinations</Label>
                                <ul className="space-y-1">
                                  {field.value.map((route, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center justify-between"
                                    >
                                      <Badge
                                        variant="secondary"
                                        className="text-sm"
                                      >
                                        {bengali && route.address_bn
                                          ? route.address_bn
                                          : route.address}
                                      </Badge>
                                      <div
                                        onClick={() =>
                                          handleRemoveDestination(route.id)
                                        }
                                        aria-label={`Remove ${route.address}`}
                                      >
                                        <X className="w-4 h-4" />
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
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
                              placeholder="Enter package description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
      <div>
        <DataTable
          columns={columns}
          data={data?.packages}
          responsive
          progressPending={isLoading || isFetching}
          progressComponent={
            <div className="h-[50vh] flex items-center justify-center">
              <LoadingComponent loader={isLoading || isFetching} />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={data?.totalPackages}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
        />
      </div>
    </div>
  );
};

export default Package;
