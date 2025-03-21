"use client";

import { useState } from "react";
import avatar from "@/public/avatar.png";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  Calendar,
  Car,
  FileText,
  Flag,
  IdCard,
  Loader2,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import ReviewFormPage from "./ReviewFormPage";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const QrInfoPage = ({ driver, totalReviewCount, averageRating }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast({
        title: "Please select a reason for reporting",
        variant: "destructive",
      });
      return;
    }

    setReportSubmitting(true);

    // Demo delay to simulate API call
    setTimeout(() => {
      toast({
        title: "Report submitted successfully",
        description: "Thank you for helping us maintain quality standards.",
      });
      setReportDialogOpen(false);
      setReportReason("");
      setReportDescription("");
      setReportSubmitting(false);
    }, 1000);
  };
  return (
    <>
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
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-muted-foreground">
                ({totalReviewCount})
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <InfoItem
              icon={User}
              label="CoxsCab ID"
              value={driver?.coxscabId}
            />
            <InfoItem
              icon={Car}
              label="Vehicle Type"
              value={driver?.vehicleType?.name || "N/A"}
            />
            <InfoItem
              icon={FileText}
              label="Vehicle Reg. No."
              value={driver?.vehicle?.registrationNo || "N/A"}
            />
            <InfoItem
              icon={Activity}
              label="Status"
              value={driver?.driverStatus?.name || "N/A"}
            />
            <InfoItem
              icon={IdCard}
              label="Driver License"
              value={
                driver?.drivingLicenseNo
                  ? `${driver?.drivingLicenseNo?.slice(
                      0,
                      2
                    )}********${driver?.drivingLicenseNo?.slice(-2)}`
                  : "N/A"
              }
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
                    value={driver?.currentAddress?.village || "N/A"}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Ward No"
                    value={driver?.currentAddress?.wardNo || "N/A"}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Thana"
                    value={driver?.currentAddress?.thana || "N/A"}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="District"
                    value={driver?.currentAddress?.district || "N/A"}
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
                      value={driver?.permanentAddress?.village || "N/A"}
                    />
                    <InfoItem
                      icon={MapPin}
                      label="PO"
                      value={driver?.permanentAddress?.po || "N/A"}
                    />
                    <InfoItem
                      icon={MapPin}
                      label="Thana"
                      value={driver?.permanentAddress?.thana || "N/A"}
                    />
                    <InfoItem
                      icon={MapPin}
                      label="District"
                      value={driver?.permanentAddress?.district || "N/A"}
                    />
                  </div>
                </div>
              )}
          </div>
          <Separator className="my-2 sm:my-4" />
          <div className="flex justify-center">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={cn(buttonVariants(), "font-semibold text-base")}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-current" /> Rate
              Your Trip{" "}
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[93%] max-w-lg p-2">
          <DialogHeader>
            <DialogTitle>Rate Your Trip</DialogTitle>
            <DialogDescription>
              How was your ride with {driver?.name}?
            </DialogDescription>
          </DialogHeader>
          <ReviewFormPage driver={driver} />
          {/* <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => setReportDialogOpen(true)}
          >
            <Flag className="h-4 w-4" />
            Report Inappropriate Content
          </Button> */}
        </DialogContent>
      </Dialog>
      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Report Inappropriate Content
            </DialogTitle>
            <DialogDescription>
              Help us maintain a respectful community by reporting inappropriate
              content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-reason">Reason for reporting</Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger id="report-reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">
                    Inappropriate content
                  </SelectItem>
                  <SelectItem value="harassment">
                    Harassment or bullying
                  </SelectItem>
                  <SelectItem value="spam">Spam or misleading</SelectItem>
                  <SelectItem value="offensive">Offensive language</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="report-description">
                Additional details (optional)
              </Label>
              <Textarea
                id="report-description"
                placeholder="Please provide more details about your report..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReportSubmit}
              disabled={reportSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {reportSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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

export default QrInfoPage;
