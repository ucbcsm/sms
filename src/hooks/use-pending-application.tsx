import { useQuery } from "@tanstack/react-query";
import { getPendingApplications } from "@/lib/api";

export const usePendingApplications = (
  typeOfApplication: "is_new_student" | "is_old_student",
  year?: number
) => {
  return useQuery({
    queryKey: ["applications", year, "pending", "is_new_student"],
    queryFn: async ({ queryKey }) =>
      getPendingApplications({
        year: Number(year),
        student_tab_type: typeOfApplication,
      }),
    enabled: !!year,
  });
};
