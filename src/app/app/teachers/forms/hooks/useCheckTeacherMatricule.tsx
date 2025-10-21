import { getTeachers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCheckTeacherMatricule = (matricule: string | null) => {
   const { data, isPending, isLoading, isError, refetch } = useQuery({
     queryKey: ["check_teachers", matricule],
     queryFn: ({ queryKey }) =>
       getTeachers({
         search:
           matricule !== null && matricule.trim() !== ""
             ? matricule
             : undefined,
       }),
     enabled: false,
   });

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