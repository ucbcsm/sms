import { getRequiredDocuments } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useAllRequiredDocuments = () => {
  return useQuery({
    queryKey: ["required_documents"],
    queryFn: getRequiredDocuments,
  });
}