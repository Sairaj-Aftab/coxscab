"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LostAndFoundHeader = () => {
  const pathname = usePathname();
  return (
    <div>
      {/* <div className="bg-white text-base font-semibold pt-1">
    <NoticeFromAdmin status="Tourist-Bus-Permission" />
  </div> */}
      <div className="bg-white rounded-t-md flex gap-3 w-fit mx-auto mt-1 sm:mt-3 p-2">
        <Link
          href="/lost-and-found"
          className={`${
            pathname === "/lost-and-found"
              ? "bg-white text-primary"
              : "bg-primary text-white"
          } text-sm sm:text-base font-medium py-1 px-2 rounded-md`}
        >
          Lost And Found
        </Link>
        <Link
          href="/lost-and-found/form"
          className={`${
            pathname === "/lost-and-found/form"
              ? "bg-white text-primary"
              : "bg-primary text-white"
          } text-sm sm:text-base font-medium py-1 px-2 rounded-md`}
        >
          New Entry Form
        </Link>
      </div>
    </div>
  );
};

export default LostAndFoundHeader;
