import api from "@/fetcher";
import { Enrollment } from "@/types";

export async function getEnrollments() {
  const res = await api.get(`/apparitorat/enrollment/`);
  return res.data.results as Enrollment[];
}

export async function createEnrollment() {
  const res = await api.post(`/apparitorat/enrollment/`);
  return res.data;
}

export async function updateEnrollment({
  id,
  params,
}: {
  id: number;
  params: any;
}) {
  const res = await api.put(`/apparitorat/enrollment/${id}`);
  return res.data;
}
