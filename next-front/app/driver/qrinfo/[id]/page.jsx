import { getDriver } from "@/service/driver.service";
import Image from "next/image";
import avatar from "@/public/avatar.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Activity,
  Calendar,
  Car,
  FileText,
  IdCard,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const DriverQrInfo = async ({ params }) => {
  const { id } = await params;

  const { driver } = await getDriver(id);

  return (
    <Card className="w-[93%] max-w-md mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl my-5">
      <CardHeader className="p-0">
        <div className="relative h-24 bg-gradient-to-r from-primary to-primary-foreground">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32 rounded-full border-4 border-background overflow-hidden">
              <Image
                src={driver?.pictureUrl ? driver?.pictureUrl : avatar}
                alt={driver?.name || "Driver"}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-16 pb-3 px-3">
        <div className="text-center mb-3 sm:mb-5">
          <h2 className="text-2xl font-bold text-primary mb-1">
            {driver?.name || "Driver Name"}
          </h2>
          <a href={`tel:+88${driver?.mobileNo}`}>
            <Badge variant="secondary" className="text-sm">
              <Phone className="mr-2 h-4 w-4" />
              {driver?.mobileNo || "Unknown No."}
            </Badge>
          </a>
          <div className="mt-1 flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(driver?.averageRating || 3)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">
              ({driver?.ratingCount || 16})
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <InfoItem
            icon={User}
            label="CoxsCab ID"
            value={driver?.coxscabId || "N/A"}
          />
          <InfoItem
            icon={Car}
            label="Vehicle Type"
            value={driver.vehicleType?.name || "N/A"}
          />
          <InfoItem
            icon={FileText}
            label="Vehicle Reg. No."
            value={driver.vehicle?.registrationNo || "N/A"}
          />
          <InfoItem
            icon={Activity}
            label="Status"
            value={driver.driverStatus?.name || "N/A"}
          />
          <InfoItem
            icon={IdCard}
            label="Driver License"
            value={driver?.drivingLicenseNo || "N/A"}
          />
          <InfoItem
            icon={Calendar}
            label="Date of Birth"
            value={formatDate(driver?.nidDob) || "N/A"}
          />
        </div>
        <Separator className="my-2 sm:my-4" />
        <div className="space-y-2 sm:space-y-4">
          {/* Current Address */}
          {(driver?.currentAddress?.thana ||
            driver?.currentAddress?.district ||
            driver?.currentAddress?.village) && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Current Address</h3>
              <div className="grid grid-cols-2 gap-2">
                <InfoItem
                  icon={MapPin}
                  label="Village"
                  value={driver.currentAddress?.village || "N/A"}
                />
                <InfoItem
                  icon={MapPin}
                  label="Ward No"
                  value={driver.currentAddress?.wardNo || "N/A"}
                />
                <InfoItem
                  icon={MapPin}
                  label="Thana"
                  value={driver.currentAddress?.thana || "N/A"}
                />
                <InfoItem
                  icon={MapPin}
                  label="District"
                  value={driver.currentAddress?.district || "N/A"}
                />
              </div>
            </div>
          )}
          {/* Permanent Address */}
          {(!driver?.currentAddress?.thana ||
            !driver?.currentAddress?.district ||
            !driver?.currentAddress?.village) &&
            (driver?.permanentAddress?.thana ||
              driver?.permanentAddress?.district ||
              driver?.permanentAddress?.village) && (
              <div>
                <h3 className="text-sm font-semibold mb-1">
                  Permanent Address
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <InfoItem
                    icon={MapPin}
                    label="Village"
                    value={driver.permanentAddress?.village || "N/A"}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="PO"
                    value={driver.permanentAddress?.po || "N/A"}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Thana"
                    value={driver.permanentAddress?.thana || "N/A"}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="District"
                    value={driver.permanentAddress?.district || "N/A"}
                  />
                </div>
              </div>
            )}
        </div>
        <Separator className="my-2 sm:my-4" />
        <div className="flex justify-center">
          <Link
            href={`/driver/review-form/${id}`}
            className={cn(buttonVariants(), "font-semibold text-base")}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-current" /> Rate Your
            Trip <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default DriverQrInfo;
