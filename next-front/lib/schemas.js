import * as z from "zod";

export const reportFormSchema = z.object({
  reportType: z.enum(["LOST", "FOUND"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid mobile number"),
  address: z.string().min(5, "Please enter a valid address"),
  statusType: z.enum(["tourist", "local"]),
  place: z.string().min(2, "Please specify a valid location"),
  dateTime: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    },
    {
      message: "Please enter a valid date and time not in the future",
    }
  ),
  goods: z.string().min(2, "Please list the lost or found items"),
  images: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 images can be uploaded")
    .optional(),
  policeReport: z.string().optional(),
  description: z.string().min(10, "Please provide a detailed description"),
  from: z.enum(["COXSCAB"]).default("COXSCAB"),
});
