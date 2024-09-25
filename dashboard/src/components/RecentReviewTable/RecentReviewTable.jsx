import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
const RecentReviewTable = () => {
  const rating = 4;
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <FaStar
        key={index}
        color={index < rating ? "#ffc107" : "#e4e5e9"} // Yellow for filled stars, gray for empty
      />
    ));
  return (
    <div className="bg-white rounded-md shadow-md">
      <h3 className="text-base font-medium text-gray_text mb-3 p-3">
        Recent reviews
      </h3>
      <div className="flex flex-col">
        <div className="flex justify-between p-3 border-b border-gray-300">
          <div className="flex gap-3">
            <img
              src="https://picsum.photos/200"
              alt=""
              className="w-12 h-12 object-cover cursor-pointer"
            />
            <div>
              <h2 className="text-sm text-gray-800 font-medium cursor-pointer hover:underline">
                Product Name Here
              </h2>
              <p className="text-sm text-gray-600 font-normal">
                Reviewed by{" "}
                <Link to={"/"} className="hover:underline">
                  Jhon Doe
                </Link>
              </p>
            </div>
          </div>
          <div className="flex">{stars}</div>
        </div>
        <div className="flex justify-between p-3 border-b border-gray-300">
          <div className="flex gap-3">
            <img
              src="https://picsum.photos/200"
              alt=""
              className="w-12 h-12 object-cover"
            />
            <div>
              <h2 className="text-sm text-gray-800 font-medium cursor-pointer hover:underline">
                Product Name Here
              </h2>
              <p className="text-sm text-gray-600 font-normal">
                Reviewed by{" "}
                <Link to={"/"} className="hover:underline">
                  Jhon Doe
                </Link>
              </p>
            </div>
          </div>
          <div className="flex">{stars}</div>
        </div>
      </div>
    </div>
  );
};

export default RecentReviewTable;
