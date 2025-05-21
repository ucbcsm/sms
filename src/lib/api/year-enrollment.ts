import api from "@/lib/fetcher";
import { Enrollment } from "@/lib/types";

export async function getYearEnrollments() {
  const res = await api.get(`/apparitorat/year-enrollment/`);
  return res.data.results as Enrollment[];
}

export async function createEnrollment(
  params: Omit<Enrollment, "id"| "user"|""> & {  }
) {
  const res = await api.post(`/apparitorat/year-enrollment/`);
  return res.data;
}

export async function updateEnrollment({
  id,
  params,
}: {
  id: number;
  params: any;
}) {
  const res = await api.put(`/apparitorat/year-enrollment/${id}`);
  return res.data;
}
