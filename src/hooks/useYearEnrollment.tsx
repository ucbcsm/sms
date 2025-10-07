import { getYearEnrollment } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useYearEnrollment = (id?: number | string) => {
    return useQuery({
      queryKey: ["enrollment", id],
      queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
      enabled: !!id,
    });
};