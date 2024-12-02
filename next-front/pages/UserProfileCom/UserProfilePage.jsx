"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star } from "lucide-react";
import RideHistory from "./RideHistory";
import UserStats from "./UserStats";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import EditProfileForm from "./EditProfileForm";
import { useAuthUser } from "@/store/authUser";
import { formatMemberSince } from "@/lib/utils";

const UserProfilePage = () => {
  const { user } = useAuthUser();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  return (
    <div className="gradient-page min-h-[calc(100vh-55px)] w-full p-2 md:p-4">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt="User's profile picture"
                />
                <AvatarFallback className="gradient-page text-gray-900 text-xl font-semibold">
                  {user?.firstName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-2xl">{user?.firstName}</CardTitle>
              <div className="flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm text-muted-foreground">
                  San Francisco, CA
                </span>
              </div>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                <span className="font-semibold">4.8</span>
                <span className="text-sm text-muted-foreground ml-1">
                  (120 rides)
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary" className="mb-2">
                Verified User
              </Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Member since {formatMemberSince(user?.createdAt)}
              </p>
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="history" className="w-full">
                Ride History
              </TabsTrigger>
              <TabsTrigger value="stats" className="w-full">
                User Stats
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history">
              <RideHistory />
            </TabsContent>
            <TabsContent value="stats">
              <UserStats />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm onClose={() => setIsEditProfileOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilePage;
