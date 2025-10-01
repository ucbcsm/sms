import { getFacultiesBeta } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFaculties = (fieldId?: number) => {
  return useQuery({
    queryKey: ["faculties", fieldId],
    queryFn: () => getFacultiesBeta({ fieldId }),
  });
};
