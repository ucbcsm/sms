import { TaughtCourse } from "@/types";
import api from "../fetcher";

export async function getTaughtCoursesByFacultyId(
  yearId: number,
  facultyId: number
) {
  const res = await api.get(
    `/faculty/taught-course/?academic_year__id=${yearId}&faculty__id=${facultyId}`
  );
  return res.data.results as TaughtCourse[];
}
