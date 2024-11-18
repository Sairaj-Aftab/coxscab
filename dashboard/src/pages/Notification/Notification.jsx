import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, ChevronDown, Info, UserPlus } from "lucide-react";
import { useState } from "react";

const mockNotifications = [
  {
    id: 1,
    type: "new_driver",
    title: "New Driver Registration",
    description: "John Doe has registered as a new driver.",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "user_report",
    title: "User Complaint",
    description: "A user has reported an issue with their recent ride.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "system_alert",
    title: "System Maintenance",
    description: "Scheduled maintenance will occur tonight at 2 AM UTC.",
    timestamp: "3 hours ago",
    read: true,
  },
  // Add more mock notifications as needed
];

const Notification = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.read);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIconForType = (type) => {
    switch (type) {
      case "new_driver":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "user_report":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "system_alert":
        return <Info className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Badge variant="secondary">{unreadCount} unread</Badge>
      </div>

      <div className="flex justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter: {filter === "all" ? "All" : "Unread"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("all")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("unread")}>
              Unread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={notification.read ? "bg-gray-50" : ""}
          >
            <CardContent className="flex items-start p-4">
              <div className="mr-4 mt-1">
                {getIconForType(notification.type)}
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{notification.title}</h2>
                <p className="text-gray-600">{notification.description}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {notification.timestamp}
                </p>
              </div>
              {!notification.read && (
                <Badge className="ml-2" variant="default">
                  New
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
};

export default Notification;
