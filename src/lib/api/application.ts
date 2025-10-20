import api from "@/lib/fetcher";
import {
  Application,
  ApplicationDocument,
  ApplicationEditFormDataType,
  ApplicationFormDataType,
  EnrollmentQA,
  TestResult,
} from "@/types";
import dayjs from "dayjs";

export async function getApplications() {
  const res = await api.get(`/apparitorat/application/`);
  return res.data.results as Application[];
}

export async function getApplication(id: number) {
  const res = await api.get(`/apparitorat/application/${id}/`);
  return res.data as Application;
}

export async function getPendingApplications(searchParams: {
  year: string | number;
  student_tab_type: "is_new_student" | "is_old_student";
  page?: string | number;
  page_size?: string | number;
  search?: string;
  get_all?: boolean;
}) {
  const { year, student_tab_type, page, page_size, search, get_all } =
    searchParams;
  const query = new URLSearchParams();
  query.append("year", year.toString());
  query.append("student_tab_type", student_tab_type.toString());

  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (page_size !== undefined) {
    query.append("page_size", page_size.toString());
  }
  if (search !== undefined) {
    query.append("search", search.toString());
  }
  if (get_all !== undefined) {
    query.append("get_all", String(get_all));
  }

  const res = await api.get(
    `/apparitorat/application-pending/?${query.toString()}`
  );

  return res.data as {
    results: Application[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getValidatedApplications(searchParams: {
  year: string | number;
  student_tab_type: "is_new_student" | "is_old_student";
  page?: string | number;
  page_size?: string | number;
  search?: string;
  get_all?: boolean;
}) {
  const { year, student_tab_type, page, page_size, search, get_all } =
    searchParams;
  const query = new URLSearchParams();
  query.append("year", year.toString());
  query.append("student_tab_type", student_tab_type.toString());
  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (page_size !== undefined) {
    query.append("page_size", page_size.toString());
  }
  if (search !== undefined) {
    query.append("search", search.toString());
  }
  if (get_all !== undefined) {
    query.append("get_all", String(get_all));
  }

  const res = await api.get(
    `/apparitorat/application-validated/?${query.toString()}`
  );
  return res.data as {
    results: Application[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getRejectedApplications(searchParams: {
  year: string | number;
  student_tab_type: "is_new_student" | "is_old_student";
  page?: string | number;
  page_size?: string | number;
  search?: string;
  get_all?: boolean;
}) {
  const { year, student_tab_type, page, page_size, search, get_all } =
    searchParams;
  const query = new URLSearchParams();
  query.append("year", String(year));
  query.append("student_tab_type", student_tab_type);

  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (page_size !== undefined) {
    query.append("page_size", page_size.toString());
  }
  if (search !== undefined) {
    query.append("search", search.toString());
  }
  if (get_all !== undefined) {
    query.append("get_all", String(get_all));
  }

  const res = await api.get(
    `/apparitorat/application-rejected/?${query.toString()}`
  );
  return res.data as {
    results: Application[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function createApplication(
  params: ApplicationFormDataType & { isFormer: boolean }
) {
  if (!params.isFormer && params.former_matricule === null) {
    const res = await api.post(`/apparitorat/application/`, {
      academic_year: params.year_id,
      cycle: params.cycle_id,
      faculty: params.faculty_id,
      field: params.field_id,
      departement: params.department_id,
      class_year: params.class_id,
      previous_university_studies: params.student_previous_studies,
      enrollment_question_response: params.enrollment_q_a,
      admission_test_result: params.test_result,
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
      year_of_diploma_obtained: dayjs(params.year_of_diploma_obtained).year(),
      diploma_number: params.diploma_number || null,
      diploma_percentage: params.diploma_percentage || null,
      is_foreign_registration: params.is_foreign_registration,
      former_matricule: null,
      former_year_enrollment_id: null,
      type_of_enrollment: params.type_of_enrollment || null,
      enrollment_fees: params.enrollment_fees,
      surname: params.surname,
      last_name: params.last_name,
      first_name: params.first_name,
      gender:params.gender,
      email: params.email,
      status: "pending",
      avatar: params.avatar || null,
      is_former_student: false,
      application_documents: params.application_documents,
    });
    return res.data;
  } else if (params.isFormer && params.former_matricule !== null) {
    const res = await api.post(`/apparitorat/application/`, {
      academic_year: params.year_id,
      cycle: params.cycle_id,
      faculty: params.faculty_id,
      field: params.field_id,
      departement: params.department_id,
      class_year: params.class_id,
      previous_university_studies: params.student_previous_studies,
      enrollment_question_response: params.enrollment_q_a,
      admission_test_result: params.test_result,
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
      year_of_diploma_obtained: dayjs(params.year_of_diploma_obtained).year(),
      diploma_number: params.diploma_number || null,
      diploma_percentage: params.diploma_percentage || null,
      is_foreign_registration: params.is_foreign_registration,
      former_matricule: params.former_matricule,
      former_year_enrollment_id: null,
      type_of_enrollment: params.type_of_enrollment || null,
      enrollment_fees: params.enrollment_fees,
      surname: params.surname,
      last_name: params.last_name,
      first_name: params.first_name,
      gender:params.gender,
      email: params.email,
      status: "validated",
      avatar: params.avatar || null,
      is_former_student: true,
      application_documents: params.application_documents,
    });
    await api.post(`/apparitorat/year-enrollment/`, {
      ...params,
      academic_year: params.year_id,
      cycle: params.cycle_id,
      faculty: params.faculty_id,
      field: params.field_id,
      departement: params.department_id,
      class_year: params.class_id,
      application_documents: params.application_documents,
      enrollment_question_response: params.enrollment_q_a,
      admission_test_result: params.test_result,
      type_of_enrollment: params.type_of_enrollment,
      status: "enabled",
    });
    return res.data;
  }
}

export async function updateApplication({
  id,
  params,
}: {
  id: number;
  params: ApplicationEditFormDataType;
}) {
  const res = await api.put(`/apparitorat/application/${id}/`, {
    ...params,
    academic_year: params.year_id,
    cycle: params.cycle_id,
    faculty: params.faculty_id,
    field: params.field_id,
    departement: params.department_id,
    class_year: params.class_id,
    avatar: params.avatar || null,
    former_matricule: params.former_matricule || null,
    former_year_enrollment_id: params.former_year_enrollment_id || null,
    spoken_language: formatLanguages(params.spoken_languages),
    date_of_birth: dayjs(params.date_of_birth).format("YYYY-MM-DD"),
    year_of_diploma_obtained: dayjs(params.year_of_diploma_obtained).year(),
    application_documents: params.application_documents,
    enrollment_question_response: params.enrollment_question_response,
    admission_test_result: params.admission_test_result,
  });
  return res.data;
}

export async function markApplicationAsPending(params: Application) {
  const res = await api.put(`/apparitorat/application/${params.id}/`, {
    ...params,
    academic_year: params.academic_year.id,
    cycle: params.cycle.id,
    faculty: params.faculty.id,
    field: params.field.id,
    departement: params.departement.id,
    class_year: params.class_year.id,
    avatar: params.avatar || null,
    application_documents: formatApplicationDocumentsForEdition(
      params.application_documents
    ),
    enrollment_question_response: formatEnrollmentQuestionResponseForEdition(
      params.enrollment_question_response
    ),
    admission_test_result: formatAdmissionTestResultsForEdition(
      params.admission_test_result
    ),
    status: "pending",
  });
  return res.data;
}

export async function rejectApplication(params: Application) {
  const res = await api.put(`/apparitorat/application/${params.id}/`, {
    ...params,
    academic_year: params.academic_year.id,
    cycle: params.cycle.id,
    faculty: params.faculty.id,
    field: params.field.id,
    departement: params.departement.id,
    class_year: params.class_year.id,
    avatar: params.avatar || null,
    application_documents: formatApplicationDocumentsForEdition(
      params.application_documents
    ),
    enrollment_question_response: formatEnrollmentQuestionResponseForEdition(
      params.enrollment_question_response
    ),
    admission_test_result: formatAdmissionTestResultsForEdition(
      params.admission_test_result
    ),
    status: "rejected",
  });
  return res.data;
}

export async function validateApplication(params: Application) {

  const resEnrollement = await api.post(`/apparitorat/year-enrollment/`, {
    ...params,
    academic_year: params.academic_year.id,
    cycle: params.cycle.id,
    faculty: params.faculty.id,
    field: params.field.id,
    departement: params.departement.id,
    class_year: params.class_year.id,
    application_documents: formatApplicationDocumentsForEdition(
      params.application_documents
    ),
    enrollment_question_response: formatEnrollmentQuestionResponseForEdition(
      params.enrollment_question_response
    ),
    admission_test_result: formatAdmissionTestResultsForEdition(
      params.admission_test_result
    ),
    type_of_enrollment: params.type_of_enrollment,
    status: "enabled",
  });

  await api.put(`/apparitorat/application/${params.id}/`, {
    ...params,
    academic_year: params.academic_year.id,
    cycle: params.cycle.id,
    faculty: params.faculty.id,
    field: params.field.id,
    departement: params.departement.id,
    class_year: params.class_year.id,
    avatar: params.avatar || null,
    application_documents: formatApplicationDocumentsForEdition(
      params.application_documents
    ),
    enrollment_question_response: formatEnrollmentQuestionResponseForEdition(
      params.enrollment_question_response
    ),
    admission_test_result: formatAdmissionTestResultsForEdition(
      params.admission_test_result
    ),
    status: "validated",
  });

  return resEnrollement.data;
}

export async function validateEditedApplication({
  oldParams,
  newParams,
}: {
  oldParams: Application;
  newParams: ApplicationEditFormDataType;
}) {
  
  const resEnrollement = await api.post(`/apparitorat/year-enrollment/`, {
    ...newParams,
    academic_year: newParams.year_id,
    cycle: newParams.cycle_id,
    faculty: newParams.faculty_id,
    field: newParams.field_id,
    departement: newParams.department_id,
    class_year: newParams.class_id,
    avatar: newParams.avatar || null,
    former_year_enrollment_id: newParams.former_year_enrollment_id || null,
    spoken_language: formatLanguages(newParams.spoken_languages),
    date_of_birth: dayjs(newParams.date_of_birth).format("YYYY-MM-DD"),
    year_of_diploma_obtained: dayjs(newParams.year_of_diploma_obtained).year(),
    application_documents: newParams.application_documents,
    enrollment_question_response: newParams.enrollment_question_response,
    admission_test_result: newParams.admission_test_result,
    type_of_enrollment: newParams.type_of_enrollment,
    status: "enabled",
  });

  await api.put(`/apparitorat/application/${oldParams.id}/`, {
    ...newParams,
    academic_year: newParams.year_id,
    cycle: newParams.cycle_id,
    faculty: newParams.faculty_id,
    field: newParams.field_id,
    departement: newParams.department_id,
    class_year: newParams.class_id,
    avatar: newParams.avatar || null,
    former_year_enrollment_id: newParams.former_year_enrollment_id || null,
    spoken_language: formatLanguages(newParams.spoken_languages),
    date_of_birth: dayjs(newParams.date_of_birth).format("YYYY-MM-DD"),
    year_of_diploma_obtained: dayjs(newParams.year_of_diploma_obtained).year(),
    application_documents: newParams.application_documents,
    enrollment_question_response: newParams.enrollment_question_response,
    admission_test_result: newParams.admission_test_result,
    status: "validated",
  });

  return resEnrollement.data;
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

export function getApplicationTagColor(
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

export function formatLanguages(languages: string[]): string {
  return languages.map((lang) => lang).join(", ");
}

export function parseLanguages(languagesString: string): string[] {
  return languagesString
    .split(",")
    .map((lang) => lang.trim())
    .filter((lang) => lang !== "")
    .map((lang) => lang);
}

export function formatApplicationDocumentsForEdition(
  docs?: ApplicationDocument[]
) {
  return (
    docs?.map((doc) => ({
      ...doc,
      id: doc.id || null,
      required_document: doc.required_document?.id || null,
    })) || []
  );
}

export function formatEnrollmentQuestionResponseForEdition(
  questionsResponses?: EnrollmentQA[]
) {
  return (
    questionsResponses?.map((qa) => ({
      ...qa,
      registered_enrollment_question:
        qa.registered_enrollment_question?.id || null,
    })) || []
  );
}

export function formatAdmissionTestResultsForEdition(results?: TestResult[]) {
  return results?.map((res) => ({
    ...res,
    result: res.result || null,
    course_test: res.course_test?.id || null,
  }))|| [];
}

export async function createReapplication(params: {
  yearId: number;
  facultyId: number;
  fieldId: number;
  departmentId: number;
  classId: number;
  yearEnrollmentId: number;
  cycleId: number;
  enrollmentFees: "paid" | "unpaid" | "partially_paid";
  status: "pending" | "validated" | "rejected";
}) {
  const res = await api.post(
    `/apparitorat/year-enrollment/year-registration/`,
    {
      academic_year: params.yearId,
      cycle: params.cycleId,
      faculty: params.facultyId,
      field: params.fieldId,
      departement: params.departmentId,
      class_year: params.classId,
      former_year_enrollment_id: params.yearEnrollmentId,
      type_of_enrollment: "reapplication",
      enrollment_fees: params.enrollmentFees,
      status: params.status,
    }
  );
  return res.data;
}
