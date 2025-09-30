import { getYearById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useYid = () => {
  const [yid, setYidValue] = useState<number | undefined>();

     const {
       data: year,
       isPending,
       isError,
       error,
       isLoading,
       refetch
     } = useQuery({
       queryKey: ["year", yid],
       queryFn: ({ queryKey }) => getYearById(Number(yid)),
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
    const storedYid = localStorage.getItem("yid");

    if (storedYid) {setYid(parseInt(storedYid));}
  }, []);

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
