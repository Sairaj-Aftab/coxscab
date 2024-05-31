import Link from "next/link";
import "@/app/styles/components/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        Copyright ©2024 All rights reserved | <Link href="/">Coxscab</Link>
      </p>
    </footer>
  );
};

export default Footer;
