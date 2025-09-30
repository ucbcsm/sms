import {  getDepartmentsBeta } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useDepartments = (facultyId?: number) => {
  return useQuery({
    queryKey: ["departments", facultyId],
    queryFn: () => getDepartmentsBeta({ facultyId }),
  });
};