import api from "@/lib/fetcher";
import { Enrollment } from "@/types";

export async function getYearEnrollments() {
  const res = await api.get(`/apparitorat/year-enrollment/`);
  return res.data.results as Enrollment[];
}

export async function getYearEnrollment(id: number) {
  const res = await api.get(`/apparitorat/year-enrollment/${id}`);
  return res.data as Enrollment;
}
