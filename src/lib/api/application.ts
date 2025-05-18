import api from "@/lib/fetcher";
import { Application, ApplicationFormDataType } from "@/lib/types";
import dayjs from "dayjs";

export async function getApplications() {
  const res = await api.get(`/apparitorat/application/`);
  return res.data.results as Application[];
}

export async function getPendingApplications(searchParams?: {
  year?: string;
  page?: string | number;
  student_tab_type?: "is_new_student" | "is_old_student" | string;
  page_size?: string | number;
  search?: string;
  get_all?: boolean;
}) {
  const res = await api.get(
    `/apparitorat/application-pending/?year=${searchParams?.year || ""}&page=${
      searchParams?.page || 1
    }&page_size=${searchParams?.page_size || 25}&student_tab_type=${
      searchParams?.student_tab_type || "is_new_student"
    }&search=${searchParams?.search || ""}&get_all=${
      searchParams?.get_all || false
    }`
  );

  return res.data.results as Application[];
}

export async function getValidatedApplications(searchParams?: {
  year?: string;
  page?: string | number;
  student_tab_type?: "is_new_student" | "is_old_student" | string;
  page_size?: string | number;
  search?: string;
  get_all?: boolean;
}) {
  const res = await api.get(
    `/apparitorat/application-validated/?year=${
      searchParams?.year || ""
    }&page=${searchParams?.page || 1}&page_size=${
      searchParams?.page_size || 25
    }&student_tab_type=${
      searchParams?.student_tab_type || "is_new_student"
    }&search=${searchParams?.search || ""}&get_all=${
      searchParams?.get_all || false
    }`
  );
  return res.data.results as Application[];
}

export async function getRejectedApplications(searchParams?: {
  year?: string;
  page?: string | number;
  student_tab_type?: "is_new_student" | "is_old_student" | string;
  page_size?: string | number;
  search?: string;
  get_all?: boolean;
}) {
  const res = await api.get(
    `/apparitorat/application-rejected/?year=${searchParams?.year || ""}&page=${
      searchParams?.page || 1
    }&page_size=${searchParams?.page_size || 25}&student_tab_type=${
      searchParams?.student_tab_type || "is_new_student"
    }&search=${searchParams?.search || ""}&get_all=${
      searchParams?.get_all || false
    }`
  );
  return res.data.results as Application[];
}

export async function createApplication(params: ApplicationFormDataType) {
  const res = await api.post(`/apparitorat/application/`, {
    academic_year: params.year_id,
    cycle: params.cycle_id,
    faculty: params.faculty_id,
    field: params.field_id,
    departement: params.department_id,
    class_year: params.class_id,
    period: params.period_id,
    previous_university_studies: params.student_previous_studies,
    enrollment_question_response: params.enrollment_q_a,
    admission_test_result: params.test_result,
    gender: params.gender,
    place_of_birth: params.place_of_birth,
    date_of_birth: dayjs(params.date_of_birth).format("YYYY-MM-DD"),
    nationality: params.nationality,
    marital_status: params.marital_status,
    religious_affiliation: params.religious_affiliation,
    phone_number_1: params.phone_number_1,
    phone_number_2: params.phone_number_2 || null,
    name_of_secondary_school: params.name_of_secondary_school,
    country_of_secondary_school: params.country_of_secondary_school,
    province_of_secondary_school: params.province_of_secondary_school,
    territory_or_municipality_of_school:
      params.territory_or_municipality_of_school,
    section_followed: params.section_followed,
    father_name: params.father_name,
    father_phone_number: params.father_phone_number || null,
    mother_name: params.mother_name,
    mother_phone_number: params.mother_phone_number || null,
    current_city: params.current_city,
    current_municipality: params.current_municipality,
    current_neighborhood: params.current_neighborhood,
    country_of_origin: params.country_of_origin,
    province_of_origin: params.province_of_origin,
    territory_or_municipality_of_origin:
      params.territory_or_municipality_of_origin,
    physical_ability: params.physical_ability,
    professional_activity: params.professional_activity || "",
    spoken_language: formatLanguages(params.spoken_languages),
    year_of_diploma_obtained: params.year_of_diploma_obtained,
    diploma_number: params.diploma_number || null,
    diploma_percentage: params.diploma_percentage || null,
    diploma_file: params.diploma_file || null,
    other_documents: params.other_documents || null,
    is_foreign_registration: params.is_foreign_registration,
    former_matricule: params.former_matricule || "",
    type_of_enrollment: params.type_of_enrollment || null,
    enrollment_fees: "unpaid",
    surname: params.surname,
    last_name: params.last_name,
    first_name: params.first_name,
    email: params.email,
    status: "pending",
    avatar: params.avatar || null,
    is_former_student: params.is_former_student || false,
  });
  return res.data;
}

export async function updateApplication({
  id,
  params,
}: {
  id: number;
  params: Omit<
    Application,
    | "id"
    | "academic_year"
    | "cycle"
    | "faculty"
    | "field"
    | "departement"
    | "class_year"
    | "period"
    | "spoken_language"
  > & {
    year_id: number;
    cycle_id: number;
    faculty_id: number;
    field_id: number;
    department_id: number;
    class_id: number;
    period_id: number;
    spoken_languages: { language: string }[];
  };
}) {
  const res = await api.put(`/apparitorat/application/${id}/`, {
    ...params,
    academic_year: params.year_id,
    cycle: params.cycle_id,
    faculty: params.faculty_id,
    field: params.field_id,
    departement: params.department_id,
    class_year: params.class_id,
    period: params.period_id,
    avatar: params.avatar || null,
    former_matricule: params.former_matricule || "",
    spoken_language: formatLanguages(params.spoken_languages),
    date_of_birth: dayjs(params.date_of_birth).format("YYYY-MM-DD"),
  });
  return res.data;
}

export async function deleteApplication(id: number) {
  const res = await api.delete(`/apparitorat/application/${id}/`);
  return res.data;
}

export function getApplicationStatusName(
  status: "pending" | "validated" | "rejected" | "reoriented" | string
) {
  switch (status) {
    case "pending":
      return "En attente";
    case "validated":
      return "Validée";
    case "rejected":
      return "Rejetée";
    case "reoriented":
      return "Réorientée";
    default:
      return "Inconnu";
  }
}

export function getApplicationStatusTypographyType(
  status: "pending" | "validated" | "rejected" | "reoriented" | string
) {
  switch (status) {
    case "pending":
      return "warning";
    case "validated":
      return "success";
    case "rejected":
      return "danger";
    case "reoriented":
      return "secondary";
    default:
      break;
  }
}

export function getApplicationStatusAlertType(
  status: "pending" | "validated" | "rejected" | "reoriented" | string
) {
  switch (status) {
    case "pending":
      return "warning";
    case "validated":
      return "success";
    case "rejected":
      return "error";
    case "reoriented":
      return "info";
    default:
      break;
  }
}

export const getApplicationStatusAsOptions = [
  { value: "pending", label: "En attente" },
  { value: "rejected", label: "Rejetée" },
  { value: "validated", label: "Validée" },
  { value: "reoriented", label: "Réorientée", disabled: true },
];

export function formatLanguages(languages: { language: string }[]): string {
  return languages.map((lang) => lang.language).join(", ");
}

export function parseLanguages(
  languagesString: string
): { language: string }[] {
  return languagesString
    .split(",")
    .map((lang) => lang.trim())
    .filter((lang) => lang !== "")
    .map((lang) => ({ language: lang }));
}
