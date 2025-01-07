import { getPackages } from "@/service/package.service";
import { useQuery } from "@tanstack/react-query";

export function usePackageData() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () =>
      getPackages({
        limit: 1000,
      }),
  });
}
