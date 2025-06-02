import { AttendanceList } from "@/types";
import api from "../fetcher";
import dayjs from "dayjs";

export async function getAttendancesListByCourse(courseId: number) {
  const res = await api.get(
    `/faculty/physical-attendance-check/?course__id=${courseId}`
  );
  return res.data.results as AttendanceList[];
}

export async function createAttendanceList(
  data: Omit<
    AttendanceList,
    "id" | "course" | "verified_by" | "student_attendance_status"
  > & {
    course_id: number;
    verified_by_user_id: number;
    student_attendance_status: number[];
  }
) {
  const res = await api.post(`/faculty/physical-attendance-check/`, {
    course: data.course_id,
    date: dayjs(data.date).format("YYYY-MM-DD"),
    time: (data.time as any).format("HH:mm"),
    verified_by: data.verified_by_user_id,
    student_attendance_status: data.student_attendance_status,
  });
  return res.data as AttendanceList;
}

export async function deleteAttendanceList(id: number) {
  const res = await api.delete(`/faculty/physical-attendance-check/${id}/`);
  return res.data;
}
export async function updateAttendanceList({
  id,
  data,
}: {
  id: number;
  data: Omit<
    AttendanceList,
    "id" | "course" | "verified_by" | "student_attendance_status"
  > & {
    course_id: number;
    verified_by_user_id: number;
    student_attendance_status: number[];
  };
}) {
  const res = await api.put(`/faculty/physical-attendance-check/${id}/`, {
    course: data.course_id,
    date: dayjs(data.date).format("YYYY-MM-DD"),
    time: (data.time as any).format("HH:mm:ss"),
    verified_by: data.verified_by_user_id,
    student_attendance_status: data.student_attendance_status,
  });
  return res.data as AttendanceList;
}
