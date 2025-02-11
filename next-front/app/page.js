import { Suspense } from "react";
import LoadingComponent from "@/components/LoadingComponent";
import Home from "@/pages/Home";
import { getPackages } from "@/service/package.service";

export default async function Main() {
  const data = await getPackages({ limit: 1000 });

  return (
    <main>
      <Suspense fallback={<LoadingComponent />}>
        <Home data={data} />
      </Suspense>
    </main>
  );
}
