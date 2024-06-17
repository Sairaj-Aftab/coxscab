import "@/app/styles/components/admin-login.css";
import Image from "next/image";
import police_logo from "@/public/images/police_logo.png";
const AdminLoginPage = () => {
  return (
    <div className="admin-login">
      <div className="container">
        <div className="wrap">
          <Image src={police_logo} alt="" width={0} height={0} sizes="100vw" />
          <form action="">
            <input type="text" placeholder="Username or email" />
            <input type="password" placeholder="Password" />

            <button>Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
