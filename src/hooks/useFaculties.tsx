import { getFaculties } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFaculties = () => {
  return useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });
};