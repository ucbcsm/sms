import { getFields } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useFields=()=>{
    return useQuery({
      queryKey: ["fields"],
      queryFn: getFields,
    });
}