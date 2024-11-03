import { notFound } from "next/navigation";

export const getDriver = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/driver/getsingle/${id}`
  );

  const data = await res.json();
  console.log(data.driver);

  if (!res.ok) notFound();
  return data;
};
