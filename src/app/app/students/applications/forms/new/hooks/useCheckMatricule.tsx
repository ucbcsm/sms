import { getYearEnrollments } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCheckMatricule = (matricule: string | null) => {
   const {data, isPending, isLoading, isError, refetch}= useQuery({
     queryKey: ["check_enrollments", matricule],
     queryFn: ({ queryKey }) =>
       getYearEnrollments({
         search:
           matricule !== null && matricule.trim() !== ""
             ? matricule
             : undefined,
       }),
     enabled: false,
   });

   console.log({ matricule, data: data?.results });

   useEffect(() => {
     if (matricule && matricule.trim() !== "" && matricule.length >= 3) {
       refetch();
     }
   }, [matricule, refetch]);

    return {
      matriculeExists: data
        ? data?.results.length > 0
          ? true
          : false
        : undefined,
      isPending,
      isLoading,
      isError,
      refetch,
    };
}