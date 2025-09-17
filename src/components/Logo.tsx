import React from "react";
import LogoLight from "../assets/logo.png";
import LogoDark from "../assets/logo-dark.png";

export const Logo = () => {
  return (
    <>
      <img src={LogoLight} alt="Logo" className="w-50 dark:hidden" />
      <img src={LogoDark} alt="Logo Dark" className="w-50 dark:block hidden" />
    </>
  );
};
