import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";

const rideHistory = [
  {
    id: 1,
    date: "2023-06-15",
    driver: "Alice Smith",
    from: "Home",
    to: "Office",
    cost: "$12.50",
  },
  {
    id: 2,
    date: "2023-06-14",
    driver: "Bob Johnson",
    from: "Airport",
    to: "Hotel",
    cost: "$35.00",
  },
  {
    id: 3,
    date: "2023-06-12",
    driver: "Carol Williams",
    from: "Restaurant",
    to: "Home",
    cost: "$15.75",
  },
];

export default function RideHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Rides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rideHistory.map((ride) => (
            <div key={ride.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt={ride.driver}
                />
                <AvatarFallback>{ride.driver[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ride.driver}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-3 w-3" />
                  {ride.date}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-1 h-3 w-3" />
                  {ride.from} to {ride.to}
                </div>
              </div>
              <div className="font-medium">{ride.cost}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
