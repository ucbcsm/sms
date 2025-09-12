import api from "@/lib/fetcher";
import { Course, } from "@/types";

export async function getCourses(searchParams: {
  facultyId?: number;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const { facultyId, page, pageSize, search } = searchParams;
  const queryParams = new URLSearchParams();
  if (facultyId !== undefined) {
    queryParams.append("faculties__id", facultyId.toString());
  }
  if (page !== undefined) {
    queryParams.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    queryParams.append("page_size", pageSize.toString());
  }
  if (search !== undefined && search.trim() !== "") {
    queryParams.append("search", search.trim());
  }

  const res = await api.get(
    `/faculty/available-course?${queryParams.toString()}`
  );

  return res.data as {
    results: Course[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getAllCourses(searchParams: {
  facultyId?: number;
}) {
  const { facultyId } = searchParams;
  const queryParams = new URLSearchParams();
  if (facultyId !== undefined) {
    queryParams.append("faculties__id", facultyId.toString());
     queryParams.append("get_all", "true");
  }

  const res = await api.get(
    `/faculty/available-course?${queryParams.toString()}`
  );

  return res.data as Course[];
}

export async function getCoursesByFacultyId(facultyId: number) {
  const res = await api.get(`/faculty/available-course/?faculties__id=${facultyId}`);
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

export function getCoursesAsOptions(courses?: Course[]) {
  return courses?.map((course) => {
    return { value: course.id, label: course.name };
  });
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
