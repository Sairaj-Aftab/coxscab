import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import DialogBox from "@/components/DialogBox/DialogBox";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getDriverActivitiesData } from "@/features/driverActivitiesSlice";
import { getDriverStatusData } from "@/features/driverStatusSlice";
import { getVehicleTypeData } from "@/features/vehicleTypeSlice";
import DataTable from "react-data-table-component";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import AlertDialogMessage from "@/components/AlertDialogMessage/AlertDialogMessage";
import {
  useCreateDriverMutation,
  useDeleteDriverMutation,
  useGetDriversQuery,
  useUpdateDriverMutation,
} from "@/app/services/driverApi";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";

const FormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  nameBn: z.string().nonempty("Bengali name is required"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  picture: z.string().optional(),
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
  vehicleTypeId: z.string().nonempty("Vehicle type is required!"),
});

const Drivers = () => {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { activities } = useSelector(getDriverActivitiesData);
  const { status } = useSelector(getDriverStatusData);
  const { types } = useSelector(getVehicleTypeData);
  const { data: drivers, isLoading } = useGetDriversQuery({
    typeId: params?.id,
    search,
    page,
    limit,
  });
  const [createDriver, { isLoading: createLoading }] =
    useCreateDriverMutation();
  const [updateDriver, { isLoading: updateLoading }] =
    useUpdateDriverMutation();
  const [deleteDriver] = useDeleteDriverMutation();

  // State to track if editing mode is active
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  // Handle Search, pagination and filtering data using react table
  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setLimit(newPerPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      nameBn: "",
      fatherName: "",
      motherName: "",
      picture: "",
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
    },
  });

  // Function to open the dialog for editing a role
  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);

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
    if (isEditing) {
      try {
        const res = await updateDriver({
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
        const res = await createDriver({ ...data }).unwrap();
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
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await deleteDriver(id).unwrap();
      if (res?.success) {
        toast({
          title: `${res?.message}`,
        });
      }
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
      name: "QR",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex items-center">
          <img src={row.qrCode} alt={row.name} className="w-12 h-12 mr-4" />
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Name Bangla",
      selector: (row) => row.nameBn,
      sortable: true,
    },
    {
      name: "Father Name",
      selector: (row) => row.fatherName,
      sortable: true,
    },
    {
      name: "Mother Name",
      selector: (row) => row.motherName,
      sortable: true,
    },
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
      name: "NID No.",
      selector: (row) => row.nidNo,
      sortable: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.nidDob,
      sortable: true,
    },
    {
      name: "Education",
      selector: (row) => row.educationalQualification,
      sortable: true,
    },
    {
      name: "Blood Group",
      selector: (row) => row.bloodGroup,
      sortable: true,
    },
    {
      name: "Permanent Address",
      cell: (row) => {
        return (
          <p>{`${row.permanentAddress?.village}, ${row.permanentAddress?.po}, ${row.permanentAddress?.thana}, ${row.permanentAddress?.district}`}</p>
        );
      },
      sortable: true,
    },
    {
      name: "Current Address",
      cell: (row) => {
        return (
          <p>{`${row.currentAddress?.village}, ${row.currentAddress?.holdingNo}, ${row.currentAddress?.wardNo}, ${row.currentAddress?.thana}, ${row.currentAddress?.district}`}</p>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <BiEditAlt
            onClick={() => handleEdit(row)}
            className="text-primary text-xl cursor-pointer"
          />

          <AlertDialogMessage
            button={<BiTrash className="text-red-500 text-xl cursor-pointer" />}
            action={() => handleDelete(row.id)}
          />
        </div>
      ),
      width: "150px",
    },
  ];

  const createDriverDialogComponent = () => {
    return (
      <DialogBox
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        openButton={
          <Button
            onClick={() => {
              setIsEditing(false); // Reset editing mode
              form.reset(); // Reset form
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                      Vehicle Reg. No.
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        disabled={createLoading || updateLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
        title1={"Dashboard/Drivers"}
        title2={"Drivers"}
        button1={createDriverDialogComponent()}
      />
      <div className="bg-white shadow-md rounded-md">
        <div className="p-1">
          <ul className="flex justify-center gap-3 items-center pb-2 text-sm font-semibold">
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
            onChange={handleSearchChange}
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
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
        />
      </div>
    </div>
  );
};

export default Drivers;