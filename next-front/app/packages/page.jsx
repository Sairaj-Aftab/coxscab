import { Suspense } from "react";
import PackagesPage from "@/pages/PackagesPage";
import { getPackages } from "@/service/package.service";
import LoadingComponent from "@/components/LoadingComponent";

const Packages = async () => {
  const data = await getPackages({ limit: 1000 });

  return (
    <Suspense fallback={<LoadingComponent />}>
      <PackagesPage data={data} />
    </Suspense>
  );
};

export default Packages;
