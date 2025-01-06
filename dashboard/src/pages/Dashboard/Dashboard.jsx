import PageHeader from "@/components/PageHeader/PageHeader";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import RoundedChart from "@/components/RoundedChart/RoundedChart";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriverCharts, getVehicleCharts } from "@/service/chart.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, DollarSign, MapPin, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const rideData = [
  { date: "2023-06-01", rides: 1200, revenue: 15000 },
  { date: "2023-06-02", rides: 1300, revenue: 16500 },
  { date: "2023-06-03", rides: 1400, revenue: 17000 },
  { date: "2023-06-04", rides: 1100, revenue: 14000 },
  { date: "2023-06-05", rides: 1500, revenue: 18500 },
  { date: "2023-06-06", rides: 1600, revenue: 20000 },
  { date: "2023-06-07", rides: 1700, revenue: 21500 },
];

const popularLocations = [
  { location: "Laboni Beach", rides: 500 },
  { location: "Cox's Bazar Airport", rides: 350 },
  { location: "Inani Beach", rides: 300 },
  { location: "Cox's Bazar Central Bus Terminal", rides: 250 },
  { location: "Himchori Waterfall", rides: 200 },
];

const rideTypes = [
  { name: "Standard", value: 60 },
  { name: "Premium", value: 25 },
  { name: "Pool", value: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicleCharts"],
    queryFn: () => getVehicleCharts(),
  });
  const {
    data: driver,
    isLoading: driverLoading,
    error: driverError,
  } = useQuery({
    queryKey: ["driverCharts"],
    queryFn: () => getDriverCharts(),
  });

  if (error || driverError)
    return <div>Error: {error?.message || driverError?.message}</div>;

  // Prepare data for the Pie chart
  const vehicleTypes = data?.vehicleTypeCounts?.map((type) => type.type);
  const vehicleCounts = data?.vehicleTypeCounts?.map((type) => type.count);
  // Prepare data for the Pie chart
  const vehicleConditions = data?.vehicleConditionCounts?.map(
    (type) => type.condition
  );
  const vehicleCountsConditions = data?.vehicleConditionCounts?.map(
    (type) => type.count
  );
  // Prepare data for the Pie chart
  const driverTypes = driver?.driverTypeCounts?.map((type) => type.type);
  const driverCounts = driver?.driverTypeCounts?.map((type) => type.count);
  // Prepare data for the Pie chart
  const driverStatus = driver?.driverStatusCounts?.map((type) => type.status);
  const driverCountsStatus = driver?.driverStatusCounts?.map(
    (type) => type.count
  );
  const driverActivities = driver?.driverActivitiesCounts?.map(
    (type) => type.activity
  );
  const driverCountsActivities = driver?.driverActivitiesCounts?.map(
    (type) => type.count
  );
  return (
    <div>
      <PageHeader title2={"Dashboard"} />
      {/* <div className="flex gap-5">
        <div className="basis-4/12 bg-white shadow-md rounded-md p-3">
          <p className="text-sm font-normal text-gray-500">Total sells</p>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-medium text-gray_text my-2">
              $34100.00
            </h1>
            <p className="text-sm font-medium text-primary">
              &#10138; &#10136; 34.7%
            </p>
            <p className="text-sm font-normal text-gray-500">
              Compared to April 2021
            </p>
          </div>
        </div>
        <div className="basis-4/12 bg-white shadow-md rounded-md p-3">
          <p className="text-sm font-normal text-gray-500">
            Average order value
          </p>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-medium text-gray_text my-2">
              $272.98
            </h1>
            <p className="text-sm font-medium text-red-600">
              &#10138; &#10136; 12.0%
            </p>
            <p className="text-sm font-normal text-gray-500">
              Compared to April 2021
            </p>
          </div>
        </div>
        <div className="basis-4/12 bg-white shadow-md rounded-md p-3">
          <p className="text-sm font-normal text-gray-500">Total orders</p>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-medium text-gray_text my-2">$584</h1>
            <p className="text-sm font-medium text-primary">
              &#10138; &#10136; 27.9%
            </p>
            <p className="text-sm font-normal text-gray-500">
              Compared to April 2021
            </p>
          </div>
        </div>
      </div> */}
      {isLoading && (
        <div className="h-[90vh] flex items-center justify-center">
          <LoadingComponent loader={isLoading} />
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <RoundedChart
          title={"Vehicle"}
          labels={vehicleTypes}
          data={vehicleCounts}
        />
        <RoundedChart
          title={"Vehicle Conditions"}
          labels={vehicleConditions}
          data={vehicleCountsConditions}
        />
        <RoundedChart
          title={"Driver"}
          labels={driverTypes}
          data={driverCounts}
        />
        <RoundedChart
          title={"Driver Status"}
          labels={driverStatus}
          data={driverCountsStatus}
        />
        <RoundedChart
          title={"Driver Activities"}
          labels={driverActivities}
          data={driverCountsActivities}
        />
      </div>
      {/* New Dashboard */}
      {/* <div className="py-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">&#2547; 45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Riders
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Drivers
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Rides
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573,234</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ride Trends</CardTitle>
                </CardHeader>
                <CardContent className="pl-0">
                  <ChartContainer
                    config={{
                      rides: {
                        label: "Rides",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rideData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="rides"
                          stroke="var(--color-rides)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="">
                <CardHeader>
                  <CardTitle>Popular Pickup Locations</CardTitle>
                </CardHeader>
                <CardContent className="pl-0">
                  <ChartContainer
                    config={{
                      rides: {
                        label: "Rides",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={popularLocations}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="rides" fill="var(--color-rides)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="">
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-0">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rideData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          fill="var(--color-revenue)"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ride Types Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pl-0">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Percentage",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rideTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {rideTypes.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics view coming soon...
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div> */}
    </div>
  );
};

export default Dashboard;
