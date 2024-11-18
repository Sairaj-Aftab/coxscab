import { toast } from "@/components/hooks/use-toast";
import { toast as sonner } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DataTable from "react-data-table-component";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  useCreateVehicleMutation,
  useGetVehiclesQuery,
  useUpdateVehicleMutation,
} from "@/app/services/vehicleApi";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getVehicles } from "@/features/vehicleSlice";
import DialogBox from "@/components/DialogBox/DialogBox";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Loader2 } from "lucide-react";
import { getVehicleTypeData } from "@/features/vehicleTypeSlice";
import { getVehicleConditionData } from "@/features/vehicleConditionSlice";
import { Label } from "@/components/ui/label";
import { Link, useParams } from "react-router-dom";
import { useGetGaragesQuery } from "@/app/services/garageApi";
import { useGetDriversQuery } from "@/app/services/driverApi";
import { Checkbox } from "@/components/ui/checkbox";
import { authData } from "@/features/auth/authSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FormSchema = z.object({
  vehicleTypeId: z.string().min(2, {
    message: "Type is required.",
  }),
  registrationNo: z.string().min(2, {
    message: "Registration number is required.",
  }),
  vehicleConditionId: z.string().optional(), // Optional field
  engineChassisNo: z.string().optional(), // Optional field
  ownerName: z.string().optional(), // Optional field
  ownerMobileNo: z.string().optional(), // Optional field
  ownerNidNo: z.string().optional(), // Optional field
  ownerNidDob: z.string().optional(), // Optional field
  fatherName: z.string().optional(), // Optional field
  village: z.string().optional(),
  wardNo: z.string().optional(),
  holdingNo: z.string().optional(),
  thana: z.string().optional(),
  district: z.string().optional(),
  vehicleImage: z.array(z.instanceof(File)).optional(), // Optional field (array of strings)
  followUpByAuthority: z.string().optional(), // Optional field
  driverIds: z.array(z.string()).optional(), // Optional field (array of strings).string().optional(), // Optional field
  garageId: z.string().optional(), // Optional field
});

const Vehicles = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      vehicleTypeId: "",
      registrationNo: "",
      vehicleConditionId: "",
      engineChassisNo: "",
      ownerName: "",
      ownerMobileNo: "",
      ownerNidNo: "",
      ownerNidDob: "",
      fatherName: "",
      village: "",
      wardNo: "",
      holdingNo: "",
      thana: "",
      district: "",
      vehicleImage: [],
      followUpByAuthority: "",
      driverIds: [],
      garageId: "",
    },
  });
  const params = useParams();
  const dispatch = useDispatch();
  // Vehicle State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // Garage State
  const [searchGarage, setSearchGarage] = useState("");
  const [garage, setGarage] = useState({});
  // Driver State
  const [searchDriver, setSearchDriver] = useState("");
  const [driver, setDriver] = useState([]);
  // State to track if editing mode is active
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { auth } = useSelector(authData);
  const { types } = useSelector(getVehicleTypeData);
  const { conditions } = useSelector(getVehicleConditionData);
  const { data, isLoading, isFetching } = useGetVehiclesQuery({
    typeId: params?.id,
    search,
    page,
    limit,
  });
  const {
    data: garages,
    isLoading: garageLoading,
    isFetching: isFetchingGarage,
  } = useGetGaragesQuery({
    search: searchGarage,
    limit: 5,
  });
  const {
    data: drivers,
    isLoading: driversLoading,
    isFetching: isFetchingDrivers,
  } = useGetDriversQuery({
    typeId: params?.id,
    search: searchDriver,
    limit: 5,
  });

  const [createVehicle, { isLoading: createLoading }] =
    useCreateVehicleMutation();
  const [updateVehicle, { isLoading: updateLoading }] =
    useUpdateVehicleMutation();
  useEffect(() => {
    dispatch(getVehicles({ vehicles: data?.vehicles, loader: isLoading }));
  }, [dispatch, data, isLoading]);

  // Handle Search, pagination and filtering data using react table
  // Vehicle
  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setLimit(newPerPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Garage

  const handleSearchChangeGarage = (e) => {
    setSearchGarage(e.target.value);
  };

  const handleSearchChangeDriver = (e) => {
    setSearchDriver(e.target.value);
  };

  // Garage
  const handleSelectedGarage = (id) => {
    const selectedGarage = garages?.garages?.find((garage) => garage.id === id);

    if (selectedGarage) {
      setGarage({
        id: selectedGarage.id,
        coxscabId: selectedGarage.coxscabId,
        ownerName: selectedGarage.ownerName,
      });
    } else {
      setGarage(null);
    }
  };
  // Driver
  const handleSelectedDriver = (ids) => {
    const selectedDrivers = drivers?.drivers?.filter((driver) =>
      ids.includes(driver.id)
    );

    setDriver(
      selectedDrivers?.map((driver) => ({
        id: driver.id,
        coxscabId: driver.coxscabId,
        name: driver.name,
      }))
    );
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  // View details of Vehicle
  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewDialogOpen(true);
  };

  // Function to open the dialog for editing a role
  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);

    // Set form values for vehicle details
    form.setValue("vehicleTypeId", data.vehicleTypeId || "");
    form.setValue("vehicleConditionId", data.vehicleConditionId || "");
    form.setValue("registrationNo", data.registrationNo || "");
    form.setValue("engineChassisNo", data.engineChassisNo || "");

    // Set form values for owner details
    form.setValue("ownerName", data.ownerName || "");
    form.setValue("ownerMobileNo", data.ownerMobileNo || "");
    form.setValue("ownerNidNo", data.ownerNidNo || "");
    form.setValue(
      "ownerNidDob",
      data.ownerNidDob ? data.ownerNidDob.split("T")[0] : ""
    );
    form.setValue("fatherName", data.fatherName || "");
    form.setValue("followUpByAuthority", data.followUpByAuthority || "");

    // Current Address
    form.setValue("village", data?.ownerAddress?.village || "");
    form.setValue("holdingNo", data?.ownerAddress?.holdingNo || "");
    form.setValue("wardNo", data?.ownerAddress?.wardNo || "");
    form.setValue("thana", data?.ownerAddress?.thana || "");
    form.setValue("district", data?.ownerAddress?.district || "");

    // Set form values for related fields
    form.setValue("garageId", data?.garage?.id || "");
    setGarage({
      id: data?.garage?.id || "",
      coxscabId: data?.garage?.coxscabId || "",
      ownerName: data?.garage?.ownerName || "",
    });
    form.setValue("driverIds", data?.drivers?.map((data) => data.id) || "");
    setDriver(
      data?.drivers?.map((data) => ({
        id: data.id,
        coxscabId: data.coxscabId,
        name: data.name,
      }))
    );

    // If images are provided, set them up in an array format
    form.setValue("vehicleImage", data.vehicleImage || []);

    setIsDialogOpen(true);
  };

  async function onSubmit(data) {
    if (isEditing) {
      try {
        const res = await updateVehicle({
          id: currentData.id,
          ...data,
        }).unwrap();
        if (res?.message) {
          sonner("Success", {
            description: `${res?.message}`,
          });
          setIsDialogOpen(false);
          form.reset();
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: `${error?.data?.message}`,
        });
      }
    } else {
      try {
        const res = await createVehicle(data).unwrap();
        if (res?.message || res?.success) {
          toast({
            title: "Success!",
            description: `${res?.message}`,
          });
          setIsDialogOpen(false);
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

  // const handleDelete = async (id) => {
  //   try {
  //     const res = await deleteVehicle(id).unwrap();
  //     if (res?.success) {
  //       toast({
  //         title: `${res?.message}`,
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: `${error?.data?.message}`,
  //     });
  //   }
  // };

  const columns = [
    {
      name: "#",
      selector: (_data, index) => calculateItemIndex(page, limit, index),
      width: "70px",
    },
    {
      name: "Action",
      selector: (row) => row,
      cell: (row) => (
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewClick(row)}
          >
            <Eye className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={auth?.role?.name === "VIEWER"}
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
      ),
      width: "90px",
      style: {
        padding: "0",
      },
    },
    {
      name: "Reg. No.",
      selector: (row) => row.registrationNo,
      sortable: true,
      style: {
        paddingLeft: "0",
      },
    },
    {
      name: "QR",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex items-center">
          <img
            src={row.qrCode}
            alt={row.registrationNo}
            className="w-12 h-12 mr-4"
          />
        </div>
      ),
      width: "50px",
      style: {
        padding: "0",
      },
    },

    // {
    //   name: "Eng. Chass. No.",
    //   selector: (row) => row.engineChassisNo,
    //   sortable: true,
    // },
    {
      name: "Owner Name",
      selector: (row) => row.ownerName,
      sortable: true,
    },
    {
      name: "Father Name",
      selector: (row) => row.fatherName,
      sortable: true,
    },
    {
      name: "Owner Mobile",
      selector: (row) => row.ownerMobileNo,
      sortable: true,
    },
    {
      name: "Owner NID No.",
      selector: (row) => row.ownerNidNo,
      sortable: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.ownerNidDob,
      sortable: true,
    },
    {
      name: "Owner Address",
      cell: (row) => {
        return (
          <p>{`${row.ownerAddress?.village}, ${row.ownerAddress?.holdingNo}, ${row.ownerAddress?.wardNo}, ${row.ownerAddress?.thana}, ${row.ownerAddress?.district}`}</p>
        );
      },
      sortable: true,
    },

    {
      name: "Driver ID",
      // selector: (row) => row.drivers?.name,
      cell: (row) => (
        <div className="flex items-center">
          {row?.drivers?.map((data) => (
            <p key={data.id}>{data?.coxscabId}</p>
          ))}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Driver Name",
      // selector: (row) => row.drivers?.name,
      cell: (row) => (
        <div className="flex items-center">
          {row?.drivers?.map((data) => (
            <p key={data.id}>{data?.name}</p>
          ))}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Authority",
      selector: (row) => row.followUpByAuthority,
      sortable: true,
    },
    // {
    //   name: "Action",
    //   selector: (row) => row,
    //   cell: (row) => (
    //     <div className="flex gap-2 items-center">

    //       <AlertDialogMessage
    //         button={<BiTrash className="text-red-500 text-xl cursor-pointer" />}
    //         action={() => handleDelete(row.id)}
    //       />
    //     </div>
    //   ),
    //   width: "150px",
    // },
  ];

  const createVehicleDialogComponent = () => {
    return (
      <DialogBox
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        openButton={
          <Button
            disabled={auth?.role?.name === "VIEWER"}
            onClick={() => {
              setIsEditing(false); // Reset editing mode
              form.reset(); // Reset form
              setIsDialogOpen(true);
              setGarage({});
              setDriver([]);
            }}
          >
            Create vehicle
          </Button>
        }
        title={isEditing ? "Update vehicle" : "Create vehicle"}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Type and Condition */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="vehicleTypeId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Vehicle Type*
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createLoading || updateLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types?.map((data) => (
                          <SelectItem key={data.id} value={data.id}>
                            {data.name}
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
                name="vehicleConditionId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Vehicle Condition
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createLoading || updateLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions?.map((data) => (
                          <SelectItem key={data.id} value={data.id}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* RegNo and Engine */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="registrationNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Registration No
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="engineChassisNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Engine/Chassis No
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Owner Name and Mobile No */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Owner Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerMobileNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Owner Mobile No
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Owner NID NO and Nid DOB */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="ownerNidNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Owner NID NO.
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerNidDob"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Owner NID DOB
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Father's Name and Owner Address */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Father&apos;s Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label
                    htmlFor="current"
                    className={`${
                      (createLoading || updateLoading) &&
                      "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Owner Address
                  </Label>
                  <Input
                    value={`${form.watch("village") || ""} ${
                      form.watch("holdingNo") || ""
                    } ${form.watch("wardNo") || ""} ${
                      form.watch("thana") || ""
                    } ${form.watch("district") || ""}`}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Village (গ্রাম)"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="holdingNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Holding No (হোল্ডিং নং)"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wardNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ward No (ওয়ার্ড নং)"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thana"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Thana (থানা)"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="District (জেলা)"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* GrageId and DriverId */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* Garage Id */}
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label htmlFor="garage">Garage</Label>
                  <Input
                    value={`${garage?.coxscabId || ""} ${
                      garage?.ownerName || ""
                    }`}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-[360px] sm:w-[420px] p-2">
                  <input
                    type="text"
                    placeholder="Search garage"
                    onChange={handleSearchChangeGarage}
                    className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
                  />
                  <FormField
                    control={form.control}
                    name="garageId"
                    render={() => (
                      <FormItem className="w-full mt-1">
                        <div className="flex space-x-5 font-semibold text-sm">
                          <span>#</span>
                          <div className="flex w-full">
                            <span className="w-2/12">ID</span>
                            <span className="w-5/12">Owner Name</span>
                            <span className="w-5/12">Manager Name</span>
                          </div>
                        </div>

                        <div className="h-[120px] w-full">
                          {garageLoading || isFetchingGarage ? (
                            <div className="h-[150px] w-full flex items-center justify-center">
                              <LoadingComponent
                                loader={garageLoading || isFetchingGarage}
                              />
                            </div>
                          ) : (
                            garages?.garages?.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="garageId"
                                render={({ field }) => {
                                  const handleCheckboxChange = () => {
                                    // If the selected ID is the same as the current ID, deselect it
                                    const newValue =
                                      field.value === item.id ? "" : item.id;

                                    // Update the form field
                                    field.onChange(newValue);

                                    // Call handleSelectedGarage with the selected or deselected ID
                                    handleSelectedGarage(newValue);
                                  };

                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="w-full flex space-x-3 space-y-0 mb-2"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value === item.id}
                                          onCheckedChange={handleCheckboxChange}
                                        />
                                      </FormControl>

                                      <FormLabel className="font-normal w-full flex">
                                        <span className="w-2/12">
                                          {item.coxscabId}
                                        </span>
                                        <span className="w-5/12">
                                          {item?.ownerName}
                                        </span>
                                        <span className="w-5/12">
                                          {item?.managerName}
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))
                          )}
                          {!isFetchingGarage &&
                            !garageLoading &&
                            garages?.garages.length < 1 && (
                              <div className="h-[150px] w-full flex justify-center items-center">
                                <p className="text-sm font-semibold text-red-500">
                                  No garage found
                                </p>
                              </div>
                            )}
                        </div>
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
              {/* Driver Id */}
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label htmlFor="driver">Driver</Label>
                  <Input
                    value={driver
                      .map((d) => `${d.coxscabId || ""} ${d.name || ""}`)
                      .join(", ")}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-[360px] sm:w-[420px] p-2">
                  <input
                    type="text"
                    placeholder="Search driver"
                    onChange={handleSearchChangeDriver}
                    className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
                  />
                  <FormField
                    control={form.control}
                    name="driverIds"
                    render={() => (
                      <FormItem className="w-full mt-1">
                        <div className="flex space-x-5 font-semibold text-sm">
                          <span>#</span>
                          <div className="flex w-full">
                            <span className="w-2/12">ID</span>
                            <span className="w-5/12">Name</span>
                            <span className="w-5/12">License</span>
                          </div>
                        </div>

                        <div className="h-[120px] w-full">
                          {driversLoading || isFetchingDrivers ? (
                            <div className="h-[150px] w-full flex items-center justify-center">
                              <LoadingComponent
                                loader={driversLoading || isFetchingDrivers}
                              />
                            </div>
                          ) : (
                            drivers?.drivers?.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="driverIds"
                                render={({ field }) => {
                                  const handleCheckboxChange = (checked) => {
                                    const updatedDriverIds = checked
                                      ? [...field.value, item.id]
                                      : field.value?.filter(
                                          (value) => value !== item.id
                                        );

                                    // Update the form field
                                    field.onChange(updatedDriverIds);

                                    // Call handleSelectedDriver with the updated IDs
                                    handleSelectedDriver(updatedDriverIds);
                                  };
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="w-full flex space-x-3 space-y-0 mb-2"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            item.id
                                          )}
                                          onCheckedChange={handleCheckboxChange}
                                          // onCheckedChange={(checked) => {
                                          //   return checked
                                          //     ? field.onChange([
                                          //         ...field.value,
                                          //         item.id,
                                          //       ])
                                          //     : field.onChange(
                                          //         field.value?.filter(
                                          //           (value) => value !== item.id
                                          //         )
                                          //       );
                                          // }}
                                        />
                                      </FormControl>

                                      <FormLabel className="font-normal w-full flex">
                                        <span className="w-2/12">
                                          {item.coxscabId}
                                        </span>
                                        <span className="w-5/12">
                                          {item.name}
                                        </span>
                                        <span className="w-5/12">
                                          {item.drivingLicenseNo}
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))
                          )}
                          {!isFetchingDrivers &&
                            !driversLoading &&
                            drivers?.drivers.length < 1 && (
                              <div className="h-[150px] w-full flex justify-center items-center">
                                <p className="text-sm font-semibold text-red-500">
                                  No driver found
                                </p>
                              </div>
                            )}
                        </div>
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Follow Up By Authority */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="followUpByAuthority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Follow Up By Authority
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Add other fields as necessary */}
            <Button type="submit" disabled={createLoading || updateLoading}>
              {createLoading || updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogBox>
    );
  };

  return (
    <div>
      <PageHeader
        title1={"Dashboard/Vehicles"}
        title2={"Vehicles"}
        button1={createVehicleDialogComponent()}
      />
      <div className="bg-white shadow-md rounded-md">
        <div className="p-1">
          <ul className="flex flex-wrap justify-center gap-3 items-center pb-2 text-sm font-semibold">
            {types?.map((type) => (
              <li
                key={type.id}
                className={`border border-primary rounded-md py-1 px-2 ${
                  type.id === params?.id
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                }`}
              >
                <Link to={`/vehicles/${type.id}`}>{type.name}</Link>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder={`Search vehicle of ${
              types?.find((type) => type.id === params?.id)?.name || ""
            }`}
            onChange={handleSearchChange}
            className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.vehicles}
          responsive
          progressPending={isLoading || isFetching}
          progressComponent={
            <div className="h-[50vh] flex items-center justify-center">
              <LoadingComponent loader={isLoading || isFetching} />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={data?.totalVehicles}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
        />
      </div>
      {/* View details */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>
              View details for vehicle {selectedVehicle?.registrationNo}
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Make:</span>
                <span className="col-span-3">{selectedVehicle.make}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Model:</span>
                <span className="col-span-3">{selectedVehicle.model}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Year:</span>
                <span className="col-span-3">{selectedVehicle.year}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">License:</span>
                <span className="col-span-3">
                  {selectedVehicle.licensePlate}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Status:</span>
                <span className="col-span-3">{selectedVehicle.status}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Driver:</span>
                <span className="col-span-3">{selectedVehicle.driver}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vehicles;
