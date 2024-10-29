import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-center items-center gap-5">
      <h1 className="text-3xl">Now it's being developed mode</h1>
      <Link
        href={"https://www.linkedin.com/in/sairaj-aftab/"}
        className="text-lg font-bold underline text-red-500"
      >
        By Sairaj Aftab
      </Link>
    </main>
  );
}
