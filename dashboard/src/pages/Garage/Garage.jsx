import { useState } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DialogBox from "@/components/DialogBox/DialogBox";
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
import { Edit, Eye, Loader2, MoreHorizontal, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetVehiclesQuery } from "@/app/services/vehicleApi";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import {
  useCreateGarageMutation,
  useGetGaragesQuery,
  useUpdateGarageMutation,
} from "@/app/services/garageApi";
import AlertDialogMessage from "@/components/AlertDialogMessage/AlertDialogMessage";

const FormSchema = z.object({
  ownerName: z.string().nonempty("Owner name is required"),
  mobileNo: z.string().optional(),
  managerName: z.string().optional(),
  managerMobileNo: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  vehicleIds: z.array(z.string()).optional(),
  note: z.string().optional(),
});

const Garage = () => {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchGarage, setSearchGarage] = useState("");
  const [pageGarage, setPageGarage] = useState(1);
  const [limitGarage, setLimitGarage] = useState(10);
  const [regNo, setRegNo] = useState([]);

  // State to track if editing mode is active
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const { data: vehicles, isLoading: vehiclesLoading } = useGetVehiclesQuery({
    typeId: params?.id,
    search,
    page,
    limit,
  });

  const { data: garages, isLoading: getGarageLoading } = useGetGaragesQuery({
    search: searchGarage,
    page: pageGarage,
    limit: limitGarage,
  });

  const [createGarage, { isLoading: createLoading }] =
    useCreateGarageMutation();
  const [updateGarage, { isLoading: updateLoading }] =
    useUpdateGarageMutation();

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

  const handlePageChangeGarage = (page) => {
    setPageGarage(page);
  };

  const handlePerRowsChangeGarage = (newPerPage) => {
    setLimitGarage(newPerPage);
  };

  const handleSearchChangeGarage = (e) => {
    setSearchGarage(e.target.value);
  };

  // Handle row selection to capture selected IDs
  const handleRowSelected = (selectedRows) => {
    const ids = selectedRows.selectedRows.map((row) => row.id);
    const reg = selectedRows.selectedRows.map((row) => row.registrationNo);
    setRegNo(reg);
    form.setValue("vehicleIds", ids);
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ownerName: "",
      mobileNo: "",
      managerName: "",
      managerMobileNo: "",
      address1: "",
      address2: "",
      vehicleIds: [],
      note: "",
    },
  });

  async function onSubmit(data) {
    if (isEditing) {
      try {
        const res = await updateGarage({
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
        const res = await createGarage({ ...data }).unwrap();
        if (res?.message || res?.success) {
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

  const handleDelete = (id) => {
    console.log(id);
  };

  // Garage Column

  const garageColumns = [
    {
      name: "#",
      selector: (data, index) =>
        calculateItemIndex(pageGarage, limitGarage, index),
      width: "60px",
    },
    {
      name: "",
      // selector: (row) => row.vehicles?.map((data)),
      cell: (row) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 rounded-xl bg-white shadow-2xl border border-gray-200 p-1.5">
              <DropdownMenuItem className="group flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-indigo-100">
                <Eye className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600" />
                <span className="text-gray-700 text-sm font-medium group-hover:text-indigo-800">
                  View
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="group flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-blue-100">
                <Edit className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
                <span className="text-gray-700 text-sm font-medium group-hover:text-blue-800">
                  Update
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="group flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-red-100">
                <Trash className="h-5 w-5 text-red-500 group-hover:text-red-600" />
                <span className="text-gray-700 text-sm font-medium group-hover:text-red-800">
                  Delete
                </span>
              </DropdownMenuItem>
              {/* <AlertDialogMessage
                button={
                }
                action={() => handleDelete(row.id)}
              /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      width: "50px",
      style: {
        padding: "0",
      },
    },
    {
      name: "Owner Name",
      selector: (row) => row.ownerName,
      sortable: true,
    },
    {
      name: "Mobile No.",
      selector: (row) => row.mobileNo,
      sortable: true,
    },
    {
      name: "Manager Name",
      selector: (row) => row.managerName,
      sortable: true,
    },
    {
      name: "Manager Mobile No.",
      selector: (row) => row.managerMobileNo,
      sortable: true,
    },
    {
      name: "Garage Address",
      selector: (row) => row.managerMobileNo,
      cell: (row) => {
        return (
          <p>{`${row.garageAddress?.address1}, ${row.garageAddress?.address2}`}</p>
        );
      },
      sortable: true,
    },
    {
      name: "No. of Vehicle",
      selector: (row) => row._count?.vehicles,
      sortable: true,
    },
    {
      name: "Vehicles",
      // selector: (row) => row.vehicles?.map((data)),
      cell: (row) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.vehicles?.map((data) => (
              <span
                key={data.id}
                className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
              >
                {data?.registrationNo}
              </span>
            ))}
          </div>
        );
      },
      width: "400px",
    },
  ];

  // Vehicle Short columnt
  const vehicleColumns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "Reg. No.",
      selector: (row) => row.registrationNo,
      sortable: true,
    },
    {
      name: "Owner Name",
      selector: (row) => row.ownerName,
      sortable: true,
    },
  ];

  const createGarageDialogComponent = () => {
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
            Create garage
          </Button>
        }
        title={isEditing ? "Update garage" : "Create garage"}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Owner name and mobile number */}
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
                name="mobileNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Owner Mobile No.
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
            {/* Manager name and mobile number */}
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Manager Name
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
                name="managerMobileNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className={`${
                        (createLoading || updateLoading) &&
                        "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Manager Mobile No.
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
            {/* Garage Address and vehicles */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* Garage Address */}
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label htmlFor="permanent">Garage Address</Label>
                  <Input
                    value={`${form.watch("address1") || ""} ${
                      form.watch("address2") || ""
                    }`}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Address line 1"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Address line 2"
                            disabled={createLoading || updateLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
              {/* Vehicles */}
              <Popover>
                <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                  <Label htmlFor="vehicles">Add Vehicles</Label>
                  <Input
                    value={regNo.join(", ")}
                    readOnly
                    disabled={createLoading || updateLoading}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  <input
                    type="text"
                    placeholder="Search vehicle by registration number"
                    onChange={handleSearchChange}
                    className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
                  />
                  <DataTable
                    columns={vehicleColumns}
                    data={vehicles?.vehicles}
                    responsive
                    progressPending={vehiclesLoading}
                    progressComponent={
                      <div className="h-[50vh] flex items-center justify-center">
                        <LoadingComponent loader={vehiclesLoading} />
                      </div>
                    }
                    selectableRows
                    onSelectedRowsChange={handleRowSelected}
                    pagination
                    paginationServer
                    paginationTotalRows={vehicles?.totalVehicles}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationRowsPerPageOptions={[
                      10, 20, 50, 100, 125, 150, 175, 200,
                    ]}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Note */}
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
        title1={"Dashboard/Garage"}
        title2={"Garage"}
        button1={createGarageDialogComponent()}
      />
      <input
        type="text"
        placeholder="Search garage"
        onChange={handleSearchChangeGarage}
        className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
      />
      <DataTable
        columns={garageColumns}
        data={garages?.garages}
        responsive
        progressPending={getGarageLoading}
        progressComponent={
          <div className="h-[50vh] flex items-center justify-center">
            <LoadingComponent loader={getGarageLoading} />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={garages?.totalGarage}
        onChangeRowsPerPage={handlePerRowsChangeGarage}
        onChangePage={handlePageChangeGarage}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
      />
    </div>
  );
};

export default Garage;
