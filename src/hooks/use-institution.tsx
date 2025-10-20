import { getInstitution } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useInstitution = () => {
  return useQuery({
    queryKey: ["institution"],
    queryFn: getInstitution,
  });
};
