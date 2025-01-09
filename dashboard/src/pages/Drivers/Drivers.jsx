import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import avatar from "../../assets/avatar.png";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CloudUpload, Edit, Eye, Loader2, Phone } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import DialogBox from "@/components/DialogBox/DialogBox";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import { Link, useParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAuth from "@/store/useAuth";
import useDriverActivities from "@/store/useDriverActivities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDriver,
  getDrivers,
  updateDriver,
} from "@/service/driver.service";
import { getVehicles } from "@/service/vehicle.service";
import useDriverStatus from "@/store/useDriverStatus";
import useVehicleType from "@/store/useVehicleType";

const FormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  nameBn: z.string().nonempty("Bengali name is required"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  picture: z.instanceof(FileList).optional(),
  nidNo: z.string().optional(),
  nidDob: z.string().optional(),
  mobileNo: z.string().optional(),
  drivingLicenseNo: z.string().optional(),
  bloodGroup: z.string().optional(),
  educationalQualification: z.string().optional(),
  perVillage: z.string().optional(),
  perPo: z.string().optional(),
  perThana: z.string().optional(),
  perDistrict: z.string().optional(),
  currVillage: z.string().optional(),
  currHoldingNo: z.string().optional(),
  currWardNo: z.string().optional(),
  currThana: z.string().optional(),
  currDistrict: z.string().optional(),
  note: z.string().optional(),
  driverActivitiesId: z.string().optional(),
  driverStatusId: z.string().optional(),
  vehicleTypeId: z.string().optional(),
  vehicleId: z.string().optional(),
});

const Drivers = () => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      nameBn: "",
      fatherName: "",
      motherName: "",
      picture: undefined,
      nidNo: "",
      nidDob: "",
      mobileNo: "",
      drivingLicenseNo: "",
      bloodGroup: "",
      educationalQualification: "",
      perVillage: "",
      perPo: "",
      perThana: "",
      perDistrict: "",
      currVillage: "",
      currHoldingNo: "",
      currWardNo: "",
      currThana: "",
      currDistrict: "",
      note: "",
      driverActivitiesId: "",
      driverStatusId: "",
      vehicleTypeId: "",
      vehicleId: "",
    },
  });
  const fileRef = form.register("picture");

  const params = useParams();
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [vehicle, setVehicle] = useState({});
  // State to track if editing mode is active
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isViewVehicleDialogOpen, setIsViewVehicleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  // Get Data
  const { auth } = useAuth();
  const { activities } = useDriverActivities();
  const { status } = useDriverStatus();
  const { types } = useVehicleType();
  // Get Drivers
  const { data: drivers, isLoading } = useQuery({
    queryKey: [
      "drivers",
      {
        typeId: params?.id !== "all" ? params?.id : undefined,
        search,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getDrivers({
        typeId: params?.id !== "all" ? params?.id : undefined,
        search,
        page,
        limit,
      }),
  });
  // Get Vehicle
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: [
      "vehicles",
      {
        typeId: form.watch("vehicleTypeId")
          ? form.watch("vehicleTypeId")
          : undefined,
        search: searchVehicle,
        limit: 5,
      },
    ],
    queryFn: () =>
      getVehicles({
        typeId: form.watch("vehicleTypeId")
          ? form.watch("vehicleTypeId")
          : undefined,
        search: searchVehicle,
        limit: 5,
      }),
  });
  // Create Driver
  const {
    mutateAsync: createNewDriver,
    data: createData,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createDriver,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "drivers",
          {
            typeId: params?.id !== "all" ? params?.id : undefined,
            search,
            page,
            limit,
          },
        ],
        (oldData = { drivers: [] }) => ({
          ...oldData,
          drivers: [data.driver, ...oldData.drivers],
        })
      );
    },
  });
  // Update Driver
  const {
    mutateAsync: updateDriverData,
    data: updatedData,
    isPending: updateLoading,
    error: updateError,
  } = useMutation({
    mutationFn: updateDriver,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "drivers",
          {
            typeId: params?.id !== "all" ? params?.id : undefined,
            search,
            page,
            limit,
          },
        ],
        (oldData = { drivers: [] }) => ({
          ...oldData,
          drivers: oldData.drivers.map((item) =>
            item.id === data?.driver.id ? data?.driver : item
          ),
        })
      );
    },
  });

  const handleSearchChangeVehicle = (e) => {
    setSearchVehicle(e.target.value);
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const handleSelectedVehicle = (id) => {
    const selectedVehicle = vehicles?.vehicles?.find(
      (vehicle) => vehicle.id === id
    );

    if (selectedVehicle) {
      setVehicle({
        id: selectedVehicle.id,
        regNo: selectedVehicle.registrationNo,
        ownerName: selectedVehicle.ownerName,
      });
    } else {
      setVehicle({});
    }
  };

  const [existImgUrl, setExistImgUrl] = useState(null);
  // Function to open the dialog for viewing a Driver
  const handleViewClick = (driver) => {
    setSelectedDriver(driver);
    setIsViewDialogOpen(true);
  };
  // View vehicle info
  const handleViewVehicleInfo = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewVehicleDialogOpen(true);
  };
  // Function to open the dialog for editing a role
  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);

    setExistImgUrl(data?.pictureUrl);
    setFile(null);
    form.setValue("name", data.name);
    form.setValue("nameBn", data.nameBn);
    form.setValue("fatherName", data?.fatherName || "");
    form.setValue("motherName", data?.motherName || "");
    form.setValue("mobileNo", data?.mobileNo || "");
    form.setValue("nidNo", data?.nidNo || "");
    form.setValue("nidDob", data.nidDob ? data.nidDob.split("T")[0] : "");
    form.setValue("bloodGroup", data?.bloodGroup || "");
    form.setValue("drivingLicenseNo", data?.drivingLicenseNo || "");
    form.setValue(
      "educationalQualification",
      data?.educationalQualification || ""
    );

    // Set form values for related fields
    form.setValue("vehicleId", data?.vehicle?.id || "");
    setVehicle({
      id: data?.vehicle?.id || "",
      regNo: data?.vehicle?.registrationNo || "",
      ownerName: data?.vehicle?.ownerName || "",
    });

    // Permanent Address
    form.setValue("perVillage", data?.permanentAddress?.village || "");
    form.setValue("perPo", data?.permanentAddress?.po || "");
    form.setValue("perThana", data?.permanentAddress?.thana || "");
    form.setValue("perDistrict", data?.permanentAddress?.district || "");

    // Current Address
    form.setValue("currVillage", data?.currentAddress?.village || "");
    form.setValue("currHoldingNo", data?.currentAddress?.holdingNo || "");
    form.setValue("currWardNo", data?.currentAddress?.wardNo || "");
    form.setValue("currThana", data?.currentAddress?.thana || "");
    form.setValue("currDistrict", data?.currentAddress?.district || "");

    form.setValue("driverActivitiesId", data?.driverActivitiesId || "");
    form.setValue("driverStatusId", data?.driverStatusId || "");
    form.setValue("vehicleTypeId", data?.vehicleTypeId || "");
    form.setValue("note", data?.note || "");

    setIsDialogOpen(true);
  };

  async function onSubmit(data) {
    const formData = new FormData();

    for (const key in data) {
      if (key === "picture" && data.picture?.length > 0) {
        formData.append("picture", data.picture[0]); // Appending single file
      } else {
        formData.append(key, data[key]);
      }
    }

    if (isEditing) {
      await updateDriverData({
        id: currentData.id,
        formData,
      });
    } else {
      await createNewDriver({ ...data });
    }
  }

  useEffect(() => {
    if (createData?.message || updatedData?.message) {
      sonner("Success", {
        description: `${createData?.message || updatedData?.message}`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (createError || updateError) {
      toast({
        variant: "destructive",
        title: `${createError?.message || updateError?.message}`,
      });
    }
  }, [
    createData?.message,
    createError,
    form,
    updateError,
    updatedData?.message,
  ]);

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
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
    // {
    //   name: "",
    //   // selector: (row) => row.vehicles?.map((data)),
    //   cell: (row) => {
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent className="w-44 rounded-xl bg-white shadow-2xl border border-gray-200 p-1.5">
    //           <DropdownMenuItem
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               setIsDialogOpenView(true);
    //             }}
    //             className="group flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-indigo-100"
    //           >
    //             <Eye className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600" />
    //             <span className="text-gray-700 text-sm font-medium group-hover:text-indigo-800">
    //               View
    //             </span>
    //           </DropdownMenuItem>
    //           <DropdownMenuItem
    //             onClick={() => handleEdit(row)}
    //             className="group flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-blue-100"
    //           >
    //             <Edit className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
    //             <span className="text-gray-700 text-sm font-medium group-hover:text-blue-800">
    //               Update
    //             </span>
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //         {viewDriverDialogComponent()}
    //       </DropdownMenu>
    //     );
    //   },
    //   width: "50px",
    //   style: {
    //     padding: "0",
    //   },
    // },
    {
      name: "ID",
      selector: (row) => row.coxscabId,
      sortable: true,
      width: "70px",
    },
    {
      name: "Photo",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex items-center">
          <img
            src={row.pictureUrl ? row.pictureUrl : avatar}
            alt={row.name}
            className="w-12 h-12 object-cover"
          />
        </div>
      ),
      width: "50px",
      style: {
        padding: "0",
      },
    },
    {
      name: "QR",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex items-center">
          <img src={row.qrCode} alt={row.name} className="w-12 h-12" />
        </div>
      ),
      width: "50px",
      style: {
        padding: "0",
      },
    },

    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    // {
    //   name: "Name Bangla",
    //   selector: (row) => row.nameBn,
    //   sortable: true,
    // },
    {
      name: "Father Name",
      selector: (row) => row.fatherName,
      sortable: true,
    },
    // {
    //   name: "Mother Name",
    //   selector: (row) => row.motherName,
    //   sortable: true,
    // },
    {
      name: "Driver Mobile No.",
      selector: (row) => row.mobileNo,
      sortable: true,
    },
    {
      name: "Driving License No.",
      selector: (row) => row.drivingLicenseNo,
      sortable: true,
    },
    {
      name: "Vehicle Type",
      selector: (row) => row.vehicleType?.name,
      sortable: true,
    },
    {
      name: "Vehicle Reg. No.",
      cell: (row) => (
        <p
          onClick={() => handleViewVehicleInfo(row?.vehicle)}
          className="text-primary underline cursor-pointer"
        >
          {row?.vehicle?.registrationNo}
        </p>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.driverStatus?.name,
      sortable: true,
    },
    {
      name: "NID No.",
      selector: (row) => row.nidNo,
      sortable: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.nidDob,
      sortable: true,
    },
    // {
    //   name: "Education",
    //   selector: (row) => row.educationalQualification,
    //   sortable: true,
    // },
    // {
    //   name: "Blood Group",
    //   selector: (row) => row.bloodGroup,
    //   sortable: true,
    // },
    {
      name: "Permanent Address",
      cell: (row) => {
        return (
          <p>
            {[
              row.permanentAddress?.village,
              row.permanentAddress?.po,
              row.permanentAddress?.thana,
              row.permanentAddress?.district,
            ]
              .filter(Boolean) // Removes falsy values
              .join(", ")}{" "}
            {/* Joins remaining values with ", " */}
          </p>
        );
      },
      sortable: true,
    },
    {
      name: "Current Address",
      cell: (row) => {
        return (
          <p>
            {[
              row.currentAddress?.village,
              row.currentAddress?.holdingNo,
              row.currentAddress?.wardNo,
              row.currentAddress?.thana,
              row.currentAddress?.district,
            ]
              .filter(Boolean) // Removes falsy values
              .join(", ")}{" "}
            {/* Joins remaining values with ", " */}
          </p>
        );
      },
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
  const createDriverDialogComponent = () => {
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
              setFile(null);
              setIsDialogOpen(true);
            }}
          >
            Create driver
          </Button>
        }
        title={isEditing ? "Update driver" : "Create driver"}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-2"
          >
            {/* Driver name */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Driver Name (চালকের নাম ইংরেজি)*
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
                name="nameBn"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Driver Name (চালকের নাম বাংলা)*
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
            {/* Father & Mother name */}
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
                      Father Name
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
                name="motherName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Mother Name
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
            {/* NID NO and Nid DOB */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="nidNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Driver NID NO.
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
                name="nidDob"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Driver NID DOB
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
            {/* Mobile No & Licence No */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="mobileNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Driver Mobile No
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
                name="drivingLicenseNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Driving License No
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
            {/* Blood group & Educational Qulification */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createLoading || updateLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="educationalQualification"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Educational Qualification
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
            {/* Permannet address and current address */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* Permanent Address */}
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label htmlFor="permanent">Permanent Address</Label>
                  <Input
                    value={`${form.watch("perVillage") || ""} ${
                      form.watch("perPo") || ""
                    } ${form.watch("perThana") || ""} ${
                      form.watch("perDistrict") || ""
                    }`}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="perVillage"
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
                    name="perPo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="P.O. (ডাকঘর)"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="perThana"
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
                    name="perDistrict"
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
              {/* Current Address */}
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label htmlFor="current">Current Address</Label>
                  <Input
                    value={`${form.watch("currVillage") || ""} ${
                      form.watch("currHoldingNo") || ""
                    } ${form.watch("currWardNo") || ""} ${
                      form.watch("currThana") || ""
                    } ${form.watch("currDistrict") || ""}`}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="currVillage"
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
                    name="currHoldingNo"
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
                    name="currWardNo"
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
                    name="currThana"
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
                    name="currDistrict"
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
            {/* Activities and Status */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="driverActivitiesId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Driver Activities</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createLoading || updateLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activities" />
                      </SelectTrigger>
                      <SelectContent>
                        {activities?.map((data) => (
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
                name="driverStatusId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Driver Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createLoading || updateLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {status?.map((data) => (
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
            {/* Vehicle type and Reg no. */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="vehicleTypeId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createLoading || updateLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types?.map((data) => (
                          <SelectItem key={data.id} value={data.id}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* Vehicle Id */}
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label htmlFor="vehicle">Vehicle Reg. No.</Label>
                  <Input
                    value={`${vehicle?.regNo || ""} ${
                      vehicle?.ownerName || ""
                    }`}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-[360px] sm:w-[420px] p-2">
                  <input
                    type="text"
                    placeholder="Search vehicle"
                    onChange={handleSearchChangeVehicle}
                    className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
                  />
                  <FormField
                    control={form.control}
                    name="vehicleId"
                    render={() => (
                      <FormItem className="w-full mt-1">
                        <div className="flex space-x-5 font-semibold text-sm">
                          <span>#</span>
                          <div className="flex w-full">
                            <span className="w-6/12">Reg. No.</span>
                            <span className="w-6/12">Owner Name</span>
                          </div>
                        </div>

                        <div className="h-[120px] w-full">
                          {vehiclesLoading ? (
                            <div className="h-[150px] w-full flex items-center justify-center">
                              <LoadingComponent loader={vehiclesLoading} />
                            </div>
                          ) : (
                            vehicles?.vehicles?.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="vehicleId"
                                render={({ field }) => {
                                  const handleCheckboxChange = () => {
                                    // If the selected ID is the same as the current ID, deselect it
                                    const newValue =
                                      field.value === item.id ? "" : item.id;

                                    // Update the form field
                                    field.onChange(newValue);

                                    // Call handleSelectedGarage with the selected or deselected ID
                                    handleSelectedVehicle(newValue);
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
                                          {item.registrationNo}
                                        </span>
                                        <span className="w-5/12">
                                          {item?.ownerName}
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))
                          )}
                          {!vehiclesLoading &&
                            vehicles?.vehicles.length < 1 && (
                              <div className="h-[150px] w-full flex justify-center items-center">
                                <p className="text-sm font-semibold text-red-500">
                                  No vehicle found
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
                name="note"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Note
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
            {/* Driver Photo */}
            <div>
              <FormField
                control={form.control}
                name="picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Driver Photo
                    </FormLabel>
                    <FormControl>
                      <div className="outline-dashed outline-1 outline-slate-500 relative cursor-pointer rounded-lg h-[130px] flex items-center justify-center">
                        <Input
                          {...fileRef}
                          onChange={(e) => setFile(e.target.files[0])}
                          type="file"
                          accept=".jpeg, .jpg, .png, .gif, .tiff, .tif, .webp, .svg"
                          disabled={createLoading || updateLoading}
                          className="absolute top-0 left-0 bottom-0 right-0 w-full h-full opacity-0"
                        />
                        {file || existImgUrl ? (
                          <img
                            src={file ? URL.createObjectURL(file) : existImgUrl}
                            alt=""
                            className="h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center flex-col p-8 w-full">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG, JPEG, GIF, TIFF,TIF, WEBP or SVG
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Add other fields as necessary */}
            <Button
              type="submit"
              disabled={
                createLoading ||
                updateLoading ||
                auth?.role?.name === "VIEWER" ||
                auth?.role?.name === "DEMO"
              }
            >
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
        title1={"Dashboard/Drivers"}
        title2={"Drivers"}
        button1={createDriverDialogComponent()}
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
              <Link to={`/drivers/all`}>All</Link>
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
                <Link to={`/drivers/${type.id}`}>{type.name}</Link>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder={`Search driver of ${
              types?.find((type) => type.id === params?.id)?.name || ""
            }`}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
          />
        </div>
        <DataTable
          columns={columns}
          data={drivers?.drivers}
          responsive
          progressPending={isLoading}
          progressComponent={
            <div className="h-[50vh] flex items-center justify-center">
              <LoadingComponent loader={isLoading} />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={drivers?.totalDrivers}
          onChangeRowsPerPage={(perPage) => setLimit(perPage)}
          onChangePage={(page) => setPage(page)}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
        />
      </div>
      {/* View details */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              View details for driver {selectedDriver?.coxscabId}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-2">
            {selectedDriver && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <img
                    src={
                      selectedDriver?.pictureUrl
                        ? selectedDriver?.pictureUrl
                        : avatar
                    }
                    alt={selectedDriver.name}
                    className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-full border border-primary"
                  />
                  <div>
                    <p className="text-lg font-semibold text-primary mb-2">
                      {selectedDriver.name}
                    </p>
                    {selectedDriver?.mobileNo && (
                      <a
                        href={`tel:+88${selectedDriver.mobileNo}`}
                        className="flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4 text-blue-500" />{" "}
                        <span className="text-blue-500 underline">
                          {selectedDriver.mobileNo}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDriver?.fatherName && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Father&apos;s Name</Label>
                      <p>{selectedDriver.fatherName}</p>
                    </div>
                  )}
                  {selectedDriver?.motherName && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Mother&apos;s Name</Label>
                      <p>{selectedDriver.motherName}</p>
                    </div>
                  )}
                  {selectedDriver?.nidNo && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>NID Number</Label>
                      <p>{selectedDriver.nidNo}</p>
                    </div>
                  )}
                  {selectedDriver?.nidDob && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Date of Birth (NID)</Label>
                      <p>
                        {new Date(selectedDriver.nidDob).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedDriver?.drivingLicenseNo && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Driving License No.</Label>
                      <p>{selectedDriver.drivingLicenseNo}</p>
                    </div>
                  )}
                  {selectedDriver?.bloodGroup && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Blood Group</Label>
                      <p>{selectedDriver.bloodGroup}</p>
                    </div>
                  )}
                  {selectedDriver?.educationalQualification && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Educational Qualification</Label>
                      <p>{selectedDriver.educationalQualification}</p>
                    </div>
                  )}
                  {selectedDriver?.permanentAddress && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Permanent Address</Label>
                      <p>
                        {[
                          selectedDriver?.permanentAddress?.village,
                          selectedDriver?.permanentAddress?.po,
                          selectedDriver?.permanentAddress?.thana,
                          selectedDriver?.permanentAddress?.district,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                  {selectedDriver?.currentAddress && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Current Address</Label>
                      <p>
                        {[
                          selectedDriver?.currentAddress?.holdingNo,
                          selectedDriver?.currentAddress?.wardNo,
                          selectedDriver?.currentAddress?.village,
                          selectedDriver?.currentAddress?.thana,
                          selectedDriver?.currentAddress?.district,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {selectedDriver?.vehicle && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Vehicle Reg. No.</Label>
                      <p>{selectedDriver?.vehicle?.registrationNo}</p>
                    </div>
                  )}
                  {selectedDriver?.note && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md md:col-span-2">
                      <Label>Note</Label>
                      <p>{selectedDriver.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* View vehicle details */}
      <Dialog
        open={isViewVehicleDialogOpen}
        onOpenChange={setIsViewVehicleDialogOpen}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>
              View details for vehicle {selectedVehicle?.registrationNo}
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col gap-2 border p-2 rounded-md">
                <Label>Owner name</Label>
                <p>{selectedVehicle.ownerName}</p>
              </div>
              <div className="flex flex-col gap-2 border p-2 rounded-md">
                <Label>Address</Label>
                <p>
                  {[
                    selectedVehicle?.ownerAddress?.village,
                    selectedVehicle?.ownerAddress?.holdingNo,
                    selectedVehicle?.ownerAddress?.wardNo,
                    selectedVehicle?.ownerAddress?.thana,
                    selectedVehicle?.ownerAddress?.district,
                  ]
                    .filter(Boolean) // Filter out falsy values (e.g., null, undefined, "")
                    .join(", ")}{" "}
                  {/* Join with ", " */}
                </p>
              </div>
              {selectedVehicle?.ownerMobileNo && (
                <div className="flex flex-col gap-2 border p-2 rounded-md">
                  <Label>Mobile number</Label>
                  <p>{selectedVehicle?.ownerMobileNo}</p>
                </div>
              )}
              {selectedVehicle?.engineChassisNo && (
                <div className="flex flex-col gap-2 border p-2 rounded-md">
                  <Label>Chesis No.</Label>
                  <p>{selectedVehicle?.engineChassisNo}</p>
                </div>
              )}
              {selectedVehicle?.drivers?.length > 0 && (
                <div className="flex flex-col gap-2 border p-2 rounded-md">
                  <Label>Driver ID</Label>
                  <p>
                    {selectedVehicle?.drivers
                      ?.map((d) => d.coxscabId)
                      .join(", ")}
                  </p>
                </div>
              )}
              {selectedVehicle?.drivers?.length > 0 && (
                <div className="flex flex-col gap-2 border p-2 rounded-md">
                  <Label>Driver name</Label>
                  <p>
                    {selectedVehicle?.drivers?.map((d) => d.name).join(", ")}
                  </p>
                </div>
              )}
              {selectedVehicle?.vehicleCondition && (
                <div className="flex flex-col gap-2 border p-2 rounded-md">
                  <Label>Vehicle condition</Label>
                  <p>{selectedVehicle?.vehicleCondition?.name}</p>
                </div>
              )}
              {selectedVehicle?.followUpByAuthority && (
                <div className="flex flex-col gap-2 border p-2 rounded-md">
                  <Label>Report</Label>
                  <p>{selectedVehicle?.followUpByAuthority}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewVehicleDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Drivers;
