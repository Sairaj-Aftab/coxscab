import axios from "axios";
import { notFound } from "next/navigation";

export const getDriver = async (id) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/driver/getsingle/${id}`,
      { withCredentials: true }
    );
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);

    // throw new Error(error.response.data.message);
  }
};
