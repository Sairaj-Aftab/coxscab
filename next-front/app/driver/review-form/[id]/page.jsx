import ReviewFormPage from "@/pages/ReviewFormPage";
import { getDriver } from "@/service/driver.service";

const ReviewForm = async ({ params }) => {
  const { id } = await params;
  const { driver } = await getDriver(id);

  return <ReviewFormPage driver={driver} />;
};

export default ReviewForm;
