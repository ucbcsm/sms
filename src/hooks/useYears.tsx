import { getYears } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useYears=()=>{
    return useQuery({
      queryKey: ["years"],
      queryFn: getYears,
    });
}