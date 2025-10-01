import { getFieldsBeta } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useFields=(cycleId?:number)=>{
    return useQuery({
      queryKey: ["fields", cycleId],
      queryFn:()=> getFieldsBeta({cycleId}),
    });
}