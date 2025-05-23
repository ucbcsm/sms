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

// export async function createEnrollment(
//   params: Omit<Enrollment, "id"| "user"|""> & {  }
// ) {
//   const res = await api.post(`/apparitorat/year-enrollment/`);
//   return res.data;
// }

export async function updateYearEnrollment({
  id,
  params,
}: {
  id: number;
  params: any;
}) {

  const res = await api.put(`/apparitorat/year-enrollment/${id}`,{

  });
  // await updateUser()
  return res.data;
}

