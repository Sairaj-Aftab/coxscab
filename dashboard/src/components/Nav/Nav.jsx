import { BiAlignLeft, BiSolidBell } from "react-icons/bi";

const Nav = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-[99999] flex pr-3">
      <div className="basis-2/12 bg-primary pl-3 py-1 flex items-center">
        <h1 className="text-2xl text-white font-bold">Coxscab</h1>
      </div>
      <div className="basis-10/12 pl-3 shadow-lg flex justify-between items-center py-1">
        <div className="flex gap-5 items-center">
          <BiAlignLeft className="text-xl text-black cursor-pointer" />
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-full py-1 px-3 outline-none"
          />
        </div>
        <div className="flex gap-5 items-center">
          <BiSolidBell className="text-xl text-black cursor-pointer" />
          <div>
            <img
              src="https://picsum.photos/200"
              alt=""
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
