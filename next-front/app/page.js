import Home from "@/pages/Home";
import { getPackages } from "@/service/package.service";

export default async function Main() {
  const data = await getPackages({ limit: 1000 });

  return (
    <main className="w-full">
      <Home data={data} />
    </main>
  );
}
