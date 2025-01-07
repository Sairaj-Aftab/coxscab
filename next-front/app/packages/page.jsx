import PackagesPage from "@/pages/PackagesPage";
import { getPackages } from "@/service/package.service";

const Packages = async () => {
  const data = await getPackages({ limit: 1000 });

  return <PackagesPage data={data} />;
};

export default Packages;
