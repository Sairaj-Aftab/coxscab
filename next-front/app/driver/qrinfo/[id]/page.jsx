import { getDriver } from "@/service/driver.service";
import QrInfoPage from "@/pages/QrInfoPage";

const DriverQrInfo = async ({ params }) => {
  const { id } = await params;

  const { driver, totalReviewCount, averageRating } = await getDriver(id);

  return (
    <>
      <QrInfoPage
        driver={driver}
        totalReviewCount={totalReviewCount}
        averageRating={averageRating}
      />
    </>
  );
};

export default DriverQrInfo;
