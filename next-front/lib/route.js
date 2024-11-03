export const getDriver = async (id) => {
  console.log(process.env.NEXT_PUBLIC_API ?? "No API URL");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/driver/getsingle/${id}`,
    { credentials: "include" }
  );
  const data = await res.json();
  return data;
};
