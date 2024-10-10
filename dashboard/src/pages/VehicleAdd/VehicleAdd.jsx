import { useState } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import Selectt from "react-select";
import "tailwindcss/tailwind.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
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

const FormSchema = z.object({
  userName: z.string().min(2, {
    message: "User name is required.",
  }),
  password: z.string().min(2, {
    message: "Password is required.",
  }),
  roleId: z.string({
    message: "Please select a role",
  }),
});

const VehicleAdd = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Function to handle editor state changes
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const loader = false;
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userName: "",
      phone: "",
      password: "",
      roleId: [],
    },
  });

  function onSubmit(data) {
    if (isEditing) {
      // dispatch(
      //   updateAuthUser({
      //     id: currentAuth.id,
      //     data: {
      //       userName: data.userName,
      //       phone: data.phone,
      //       password: data.password,
      //       roleId: data.roleId,
      //     },
      //   })
      // );
    } else {
      // dispatch(createAuthUser(data));
    }
  }
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Vehicle/Add"}
        title2={"Add vehicle"}
        button1={<Button>Save</Button>}
      />
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Left Side */}
        <div className="basis-8/12 flex flex-col gap-5">
          {/* Basic Information */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Information
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="vehicleTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Vehicle Type*
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loader}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUPER-ADMIN">
                            SUPER ADMIN
                          </SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="VIEWER">VIEWER</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Registration No
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="engineChassisNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Engine/Chassis No
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Owner Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerMobileNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Owner Mobile No
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerNidNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Owner NID/DOB
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerNidDob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Owner NID/DOB
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Father&apos;s Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Owner Address
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleConditionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Vehicle Condition
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loader}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUPER-ADMIN">
                            SUPER ADMIN
                          </SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="VIEWER">VIEWER</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Garage ID
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="followUpByAuthority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          loader && "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Follow Up By Authority
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loader} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Add other fields as necessary */}
                <Button type="submit" disabled={loader}>
                  {loader ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait...
                    </>
                  ) : isEditing ? (
                    "Update Vehicle"
                  ) : (
                    "Create Vehicle"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        {/* Right Side */}
        <div className="basis-4/12 flex flex-col gap-5">
          {/* Categories */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Categories
            </h3>
            <div>
              <Selectt options={options} isMulti classNamePrefix="select" />

              <button className="text-sm font-normal text-primary hover:underline mt-3">
                Add new category
              </button>
            </div>
          </div>
          {/* Tags */}
          {/* <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">Tags</h3>
            <div>
              <Select options={options} isMulti classNamePrefix="select" />
              <button className="text-sm font-normal text-primary hover:underline mt-3">
                Add new tag
              </button>
            </div>
          </div> */}
          {/* Images */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Vehicle Images
            </h3>
            <div className="flex justify-between flex-wrap gap-5">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
            </div>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full border border-gray-300 rounded-sm outline-none py-1 px-3 text-base text-gray-800 mt-1"
              />
              <button className="text-sm font-normal text-primary hover:underline mt-3">
                Add images
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleAdd;
