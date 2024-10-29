import { Button } from "@/components/ui/Button";
import ActiveUsers from "@/components/ActiveUsers/ActiveUsers";
import IncomeStatisticChart from "@/components/IncomeStatisticChart/IncomeStatisticChart";
import SalesByTrafficSource from "@/components/SalesByTrafficSource/SalesByTrafficSource";
import RecentOrdersTable from "@/components/RecentOrdersTable/RecentOrdersTable";
import RecentReviewTable from "@/components/RecentReviewTable/RecentReviewTable";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useGetChartsQuery } from "@/app/services/chartApi";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";

const Dashboard = () => {
  const { data, isLoading, error } = useGetChartsQuery();

  // if (isLoading)
  //   return (
  //     <div className="h-[90vh] flex items-center justify-center">
  //       <LoadingComponent loader={isLoading} />
  //     </div>
  //   );
  if (error) return <div>Error: {error.message}</div>;

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
      <div className="grid grid-cols-4 gap-3">
        <IncomeStatisticChart
          title={"Vehicle Types"}
          labels={vehicleTypes}
          data={vehicleCounts}
        />
        <IncomeStatisticChart
          title={"Vehicle Conditions"}
          labels={vehicleConditions}
          data={vehicleCountsConditions}
        />
      </div>
    </div>
  );
};

export default Dashboard;
