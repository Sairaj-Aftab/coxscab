import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-2 items-center sm:flex-row py-6 px-3 text-sm">
        <p className="text-xs text-muted-foreground">
          © 2024 CoxsCab, Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
