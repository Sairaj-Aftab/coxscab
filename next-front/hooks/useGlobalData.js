import { getPackages } from "@/service/package.service";
import { useQuery } from "@tanstack/react-query";

export function usePackageData() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: () =>
      getPackages({
        limit: 1000,
      }),
  });
}
