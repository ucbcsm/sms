"use client";

import { useState } from "react";

const DEFAULT_PATH = "/";

export const usePrevPathname = () => {
  const [prevPathname, setPrevPathname] = useState<string>(() => {
    const storedPath = localStorage.getItem("prevPathname");
    if (storedPath) {
      return storedPath;
    }
    return DEFAULT_PATH;
  });
  const setPathname = (pathname: string) => {
    setPrevPathname(pathname);
    localStorage.setItem("prevPathname", pathname);
  };

  const removePathname = () => {
    setPrevPathname(DEFAULT_PATH);
    localStorage.removeItem("prevPathname");
  };
  return { prevPathname, setPathname, removePathname };
};
