export const getDriver = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/driver/getsingle/${id}`,
    { credentials: "include" }
  );
  const data = await res.json();
  return data;
};
