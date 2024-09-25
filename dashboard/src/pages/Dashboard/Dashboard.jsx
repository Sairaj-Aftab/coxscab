import { Button } from "@/components/ui/Button";
import ActiveUsers from "@/components/ActiveUsers/ActiveUsers";
import IncomeStatisticChart from "@/components/IncomeStatisticChart/IncomeStatisticChart";
import SalesByTrafficSource from "@/components/SalesByTrafficSource/SalesByTrafficSource";
import RecentOrdersTable from "@/components/RecentOrdersTable/RecentOrdersTable";
import RecentReviewTable from "@/components/RecentReviewTable/RecentReviewTable";
import PageHeader from "@/components/PageHeader/PageHeader";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title2={"Dashboard"} />
      <div className="flex gap-5">
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
      </div>
      {/* Active users And Income Statistics */}
      <div className="flex gap-5">
        {/* Active users */}
        <div className="basis-4/12 bg-white rounded-md p-3 shadow-md">
          <ActiveUsers />
        </div>
        {/* Income statistics */}
        <div className="basis-8/12 bg-white rounded-md p-3 shadow-md">
          <IncomeStatisticChart />
        </div>
      </div>
      {/* Recent Orders Table */}
      <RecentOrdersTable />
      {/* Sales by traffic sources */}
      <SalesByTrafficSource />
      {/* Recent Review Table */}
      <RecentReviewTable />
    </div>
  );
};

export default Dashboard;
