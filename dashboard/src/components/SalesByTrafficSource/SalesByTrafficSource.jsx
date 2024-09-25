const SalesByTrafficSource = () => {
  return (
    <div className="bg-white p-3 rounded-md shadow-md">
      <h3 className="text-base font-medium text-gray_text mb-3">
        Sales by traffic sources
      </h3>
      <div className="flex gap-5">
        <div className="basis-4/12"></div>
        <div className="basis-8/12">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 text-sm font-medium text-gray-500">
                <th className="text-left">Source</th>
                <th className="text-left">Orders</th>
                <th className="text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300 text-sm font-normal text-gray-800">
                <td>Yandex</td>
                <td>12</td>
                <td>$2,742.00</td>
              </tr>
              <tr className="border-b border-gray-300 text-sm font-normal text-gray-800">
                <td>YouTube</td>
                <td>51</td>
                <td>$3,272.00</td>
              </tr>
              <tr className="border-b border-gray-300 text-sm font-normal text-gray-800">
                <td>Google</td>
                <td>4</td>
                <td>$2,303.00</td>
              </tr>
              <tr className="border-b border-gray-300 text-sm font-normal text-gray-800">
                <td>Facebook</td>
                <td>10</td>
                <td>$1,434.00</td>
              </tr>
              <tr className="border-b border-gray-300 text-sm font-normal text-gray-800">
                <td>Instagram</td>
                <td>1</td>
                <td>$799.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesByTrafficSource;
