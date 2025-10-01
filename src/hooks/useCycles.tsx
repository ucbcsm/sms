import { getCycles } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useCycles=()=>{
    return useQuery({
      queryKey: ["cycles"],
      queryFn: getCycles,
    });
}