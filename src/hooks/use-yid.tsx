'use client'

import { getYearById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useYid = () => {
  const [yid, setYidValue] = useState<number | undefined>(() => {
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
    localStorage.setItem("yid", `${value}`);
  };

  const removeYid = () => {
    setYidValue(undefined);
    localStorage.removeItem("yid");
  };

  useEffect(() => {
    if (yid) localStorage.setItem("yid", `${yid}`);
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
