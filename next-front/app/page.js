import Home from "@/pages/Home";
import { getPackages } from "@/service/package.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Main() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["packages"],
    queryFn: () => getPackages({ limit: 1000 }),
  });
  return (
    <main className="w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Home />
      </HydrationBoundary>
    </main>
  );
}
