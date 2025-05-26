import api from "@/lib/fetcher";
import { Course } from "@/types";

export async function getCouses() {
  const res = await api.get(`/faculty/available-course/`);
  return res.data.results as Course[];
}

export async function createCourse(
  params: Omit<Course, "id" | "faculties"> & { faculties: number[] }
) {
  const res = await api.post(`/faculty/available-course/`, {
    name: params.name,
    code: params.code,
    course_type: params.course_type,
    faculties: params.faculties,
  });
  return res.data;
}

export async function updateCourse({
  id,
  params,
}: {
  id: number;
  params: Omit<Course, "id" | "faculties"> & { faculties: number[] };
}) {
  const res = await api.put(`/faculty/available-course/${id}/`, {
    name: params.name,
    code: params.code,
    course_type: params.course_type,
    faculties: params.faculties,
  });
  return res.data;
}

export async function deleteCourse(id: number) {
  const res = await api.delete(`/faculty/available-course/${id}/`);
  return res.data;
}

export const getCourseTypesAsOptions = [
  { value: "theoretical", label: "Théorique" },
  { value: "practical", label: "Pratique" },
  {
    value: "theoretical_and_practical",
    label: "Théorique et pratique",
  },
];

export function getCourseTypeName(
  type: "theoretical" | "practical" | "theoretical_and_practical" | string
) {
  switch (type) {
    case "theoretical":
      return "Théorique";
    case "practical":
      return "Pratique";
    case "theoretical_and_practical":
      return "Théorique et pratique";
    default:
      return "Inconnu";
  }
}
