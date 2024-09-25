const ActiveUsers = () => {
  return (
    <>
      <h3 className="text-base font-medium text-gray_text mb-3">
        Active users
      </h3>
      <h3 className="bg-gray-300 rounded-sm p-5 text-3xl font-medium text-primary text-center">
        148
      </h3>
      <div className="mt-3">
        <div className="text-sm text-gray-500 font-medium flex justify-between border-b border-gray-300 py-1">
          <span>Active pages</span>
          <span>Users</span>
        </div>
        <div className="text-sm text-gray-900 font-normal flex justify-between border-b border-gray-300 py-1">
          <span>/home/shop</span>
          <span>16</span>
        </div>
        <div className="text-sm text-gray-900 font-normal flex justify-between border-b border-gray-300 py-1">
          <span>/home/shop</span>
          <span>16</span>
        </div>
        <div className="text-sm text-gray-900 font-normal flex justify-between border-b border-gray-300 py-1">
          <span>/home/shop</span>
          <span>16</span>
        </div>
      </div>
    </>
  );
};

export default ActiveUsers;
