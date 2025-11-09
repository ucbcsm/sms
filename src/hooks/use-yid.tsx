"use client";

import { getYearById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useYid = () => {
  const [yid, setYidValue] = useState<number | undefined>(() => {
    if (typeof window === "undefined") return undefined;

    const storedYid = localStorage.getItem("yid");

    if (storedYid) return parseInt(storedYid);

    return undefined;
  });

  const {
    data: year,
    isPending,
    isError,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["year", yid],
    queryFn: () => getYearById(Number(yid)),
    enabled: !!yid,
  });

  const setYid = (value: number) => {
    setYidValue(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("yid", `${value}`);
    }
  };

  const removeYid = () => {
    setYidValue(undefined);
    if (typeof window !== "undefined") {
      localStorage.removeItem("yid");
    }
  };

  useEffect(() => {
    if (yid && typeof window !== "undefined") {
      localStorage.setItem("yid", `${yid}`);
    }
  }, [yid]);

  return {
    yid,
    setYid,
    removeYid,
    year,
    isPending,
    isError,
    error,
    isLoading,
    refetch,
  };
};
