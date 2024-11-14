import { getDriver } from "@/app/service/driver.service";

const DriverQrInfo = async ({ params }) => {
  const { id } = await params;

  const driver = await getDriver(id);

  return (
    <div>
      <div className="shadow-lg w-[95%] sm:w-[60%] md:w-[50%] lg:w-[40%] mx-auto p-5 rounded-md text-center">
        <p>Coxscab ID : {driver?.driver?.coxscabId}</p>
        <p>{driver?.driver?.name}</p>
        <p>{driver?.driver?.nameBn}</p>
      </div>
    </div>
  );
};

export default DriverQrInfo;
