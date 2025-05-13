"use client";

import { getYears, getYearsAsOptions } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Select, Skeleton } from "antd";

export function YearSelector() {
  const { data: years, isPending } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });
  if (isPending) {
    return <div><Skeleton.Input size="default" block /></div>;
  }
  return (
    <Select
      defaultValue={5}
      variant="filled"
      options={getYearsAsOptions(years)}
      style={{width:108}}
    />
  );
}
