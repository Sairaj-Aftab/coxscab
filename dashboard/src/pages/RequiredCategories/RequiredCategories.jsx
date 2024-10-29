import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { getVehicleTypeData } from "@/features/vehicleTypeSlice";
import { getVehicleConditionData } from "@/features/vehicleConditionSlice";
import { useCreateVehicleTypeMutation } from "@/app/services/vehicleTypeApi";
import { useCreateVehicleConditionMutation } from "@/app/services/vehicleConditionApi";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import DriverStatus from "@/components/DriverStatus/DriverStatus";
import DriverActivities from "@/components/DriverActivities/DriverActivities";

const FormSchemaType = z.object({
  name: z.string().min(1, {
    message: "Type name is required.",
  }),
});
const FormSchemaCondition = z.object({
  name: z.string().min(1, {
    message: "Condition name is required.",
  }),
});

const RequiredCategories = () => {
  const { types, loader: typesLoader } = useSelector(getVehicleTypeData);
  const { conditions, loader: conditionsLoader } = useSelector(
    getVehicleConditionData
  );
  const [createVehicleType, { isLoading: typeLoading }] =
    useCreateVehicleTypeMutation();
  const [createVehicleCondition, { isLoading: conditionLoading }] =
    useCreateVehicleConditionMutation();
  const formType = useForm({
    resolver: zodResolver(FormSchemaType),
    defaultValues: {
      name: "",
    },
  });
  const formCondition = useForm({
    resolver: zodResolver(FormSchemaCondition),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmitType(data) {
    try {
      await createVehicleType({ name: data.name }).unwrap();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${error?.data?.message}`,
      });
    }
  }
  async function onSubmitCondition(data) {
    try {
      await createVehicleCondition({ name: data.name }).unwrap();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${error?.data?.message}`,
      });
    }
  }
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Required Categories"}
        title2={"Required Categories"}
      />
      {/* Vehicle Types and conditions */}
      <div className="flex gap-5 flex-col sm:flex-row">
        {/* Vehicle Type */}
        <div className="w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-gray-700">
              Vehicle Types
            </h2>
            <Form {...formType}>
              <form
                onSubmit={formType.handleSubmit(onSubmitType)}
                className="flex gap-2 justify-between"
              >
                <FormField
                  control={formType.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Type name"
                          {...field}
                          disabled={typeLoading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={typeLoading}>
                  {typeLoading ? (
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
          </div>
          <Table className="table-auto min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types?.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{data.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {typesLoader && (
            <div className="h-[30vh] flex items-center justify-center">
              <LoadingComponent loader={typesLoader} />
            </div>
          )}
        </div>
        {/* Vehicle Condition */}
        <div className="w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-gray-700">
              Vehicle Conditions
            </h2>
            <Form {...formCondition}>
              <form
                onSubmit={formCondition.handleSubmit(onSubmitCondition)}
                className="flex gap-2 justify-between"
              >
                <FormField
                  control={formCondition.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Type name"
                          {...field}
                          disabled={conditionLoading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={conditionLoading}>
                  {conditionLoading ? (
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
          </div>
          <Table className="table-auto min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conditions?.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{data.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {conditionsLoader && (
            <div className="h-[30vh] flex items-center justify-center">
              <LoadingComponent loader={conditionsLoader} />
            </div>
          )}
        </div>
      </div>
      {/* Driver status and activities */}
      <div className="flex gap-5 flex-col sm:flex-row">
        {/* Driver Status */}
        <DriverStatus />
        {/* Driver Activities */}
        <DriverActivities />
      </div>
    </div>
  );
};

export default RequiredCategories;
