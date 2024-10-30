import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-center items-center gap-5">
      <h1 className="text-2xl md:text-3xl">Now it's being developed mode</h1>
      <Image
        src={
          "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjbDRpN2tpdmduNnl0cGltMG5jY3o1NjQ1Z282eG52ZXpicG1hNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iIqmM5tTjmpOB9mpbn/giphy.gif"
        }
        alt="Sairaj Aftab"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full md:w-1/2"
      />
      <Link
        href={"https://www.linkedin.com/in/sairaj-aftab/"}
        className="text-lg font-bold underline text-red-500"
      >
        By Sairaj Aftab
      </Link>
    </main>
  );
}
