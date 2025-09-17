import { CourseEnrollment } from "@/types";
import api from "../fetcher";
import dayjs from "dayjs";

export async function getCourseEnrollments(searchParams: {
  courseId: number;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "pending" | "validated" | "rejected";
}) {
  const { courseId, page, pageSize, search, status } = searchParams;
  const query = new URLSearchParams();
  query.append("course__id", courseId.toString());
  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    query.append("page_size", pageSize.toString());
  }
  if (search !== undefined && search.trim() !== "") {
    query.append("search", search.trim());
  }
  if (status !== undefined) {
    query.append("status", status);
  }
  const res = await api.get(
    `/faculty/course-enrollment-from-faculty/?${query.toString()}`
  );
  return res.data as {
    results: CourseEnrollment[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getAllCourseEnrollments(courseId: number) {
  const res = await api.get(
    `/faculty/course-enrollment-from-faculty/?course__id=${courseId}`
  );
  return res.data as CourseEnrollment[];
}

export async function createCourseEnrollment(data: {
  payload: {
    student: number;
    courses: number[];
    status: "pending" | "validated" | "rejected";
    exempted_on_attendance: boolean;
  }[];
}) {
  const res = await api.post(`/faculty/course-enrollment-from-faculty/`, data);
  return res.data;
}

export async function updateSingleCourseEnrollment(data: {
  id: number;
  student_id: number;
  course_id: number;
  status: "pending" | "validated" | "rejected";
  exempted_on_attendance: boolean;
}) {
  const res = await api.put(
    `/faculty/course-enrollment-from-student/${data.id}/`,
    {
      pk: data.id,
      student: data.student_id,
      course: data.course_id,
      status: data.status,
      mode: "SINGLE-UPDATE",
      exempted_on_attendance: data.exempted_on_attendance,
    }
  );
  return res.data;
}

export async function updateCourseEnrollment(
  enrollmentId: number,
  data: Omit<CourseEnrollment, "id" | "course" | "student"> & {
    course_id: number;
    student_id: number;
  }
) {
  const res = await api.patch(
    `/faculty/course-enrollment-from-student/${enrollmentId}/`,
    {
      course: data.course_id,
      student: data.student_id,
      date: dayjs(data.date).format("YYYY-MM-DD"),
      status: data.status,
      exempted_on_attendance: data.exempted_on_attendance,
    }
  );
  return res.data as CourseEnrollment;
}

export async function deleteCourseEnrollment(enrollmentId: number) {
  const res = await api.delete(
    `/faculty/course-enrollment-from-student/${enrollmentId}/`
  );
  return res.data;
}

export const getCourseEnrollmentsByStatus = (
  enrollments?: CourseEnrollment[],
  status?: "pending" | "validated" | "rejected"
) => {
  return enrollments?.filter((enrollment) => enrollment.status === status);
};

export const getCourseEnrollmentsCountByStatus = (
  enrollments?: CourseEnrollment[],
  status?: "pending" | "validated" | "rejected"
) => {
  return getCourseEnrollmentsByStatus(enrollments, status)?.length || 0;
};
