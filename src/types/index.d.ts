import { title } from "process";
import React from "react";
import { number, z } from "zod";

export type AppItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  color: string;
  roles: RolesType[];
  icon: React.ReactNode;
};

/**
 * Represents a Year object with various properties.
 *
 * @property {number} id - The unique identifier for the year.
 * @property {Institute | null} university - The associated university or institute, which can be null.
 * @property {string} name - The name of the year.
 * @property {string} start_date - The start date of the year in string format, expected to be a valid date.
 * @property {string} end_date - The end date of the year in string format, expected to be a valid date.
 * @property {"pending" | "progress" | "finished" | "suspended"} status - The current status of the year, which can be one of the following:
 * - "pending": The year is pending and has not started yet.
 * - "progress": The year is currently in progress.
 * - "finished": The year has been completed.
 * - "suspended": The year has been suspended.
 */
export const Year = z.object({
  id: z.number(),
  university: Institute.nullable(),
  name: z.string(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  status: z.enum(["pending", "progress", "finished", "suspended"]),
});

export type Year = z.infer<typeof Year>;

/**
 * Represents an Institute with various properties describing its details.
 *
 * @property id - A unique identifier for the institute.
 * @property name - The full name of the institute.
 * @property acronym - The acronym or short form of the institute's name.
 * @property category - The category of the institute, either "university" or "institut".
 * @property address - The physical address of the institute.
 * @property web_site - The official website URL of the institute.
 * @property phone_number_1 - The primary contact phone number of the institute.
 * @property phone_number_2 - An optional secondary contact phone number of the institute.
 * @property email_address - The official email address of the institute.
 * @property logo - An optional URL to the logo of the institute.
 * @property parent_organization - An optional name of the parent organization, if applicable.
 * @property status - The status of the institute, either "private" or "public".
 * @property motto - An optional motto of the institute.
 * @property slogan - The slogan of the institute.
 * @property vision - The vision statement of the institute.
 * @property mission - The mission statement of the institute.
 * @property country - The country where the institute is located.
 * @property city - The city where the institute is located.
 * @property province - The province or state where the institute is located.
 */
export const Institute = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
  category: z.enum(["university", "institut"]),
  address: z.string(),
  web_site: z.string(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  email_address: z.string(),
  logo: z.string().nullable(),
  parent_organization: z.string().nullable(),
  status: z.enum(["private", "public"]),
  motto: z.string().nullable(),
  slogan: z.string(),
  vision: z.string(),
  mission: z.string(),
  country: z.string(),
  city: z.string(),
  province: z.string(),
});

export type Institute = z.infer<typeof Institute>;

/**
 * Represents an academic cycle with its associated properties.
 *
 * @property {number} id - Unique identifier of the academic cycle.
 * @property {string} name - Name of the academic cycle (e.g., Licence, Master, Doctorat).
 * @property {string} symbol - Single-character symbol representing the cycle.
 * @property {number | null} planned_credits - Total planned credits for the academic cycle (nullable).
 * @property {number | null} planned_years - Total planned years for the academic cycle (nullable).
 * @property {number | null} planned_semester - Total planned semesters for the academic cycle (nullable).
 * @property {string | null} purpose - Description or purpose of the academic cycle (nullable).
 */
export const Cycle = z.object({
  id: z.number(),
  name: z.enum(["Licence", "Master", "Doctorat"]),
  symbol: z.string().max(1),
  planned_credits: z.number().nullable(),
  planned_years: z.number().nullable(),
  planned_semester: z.number().nullable(),
  purpose: z.string().nullable(),
  order_number: z.number(),
});

export type Cycle = z.infer<typeof Cycle>;

/**
 * Represents a Field with its associated properties.
 *
 * @property {number} id - Unique identifier of the field.
 * @property {Cycle | null} cycle - The academic cycle associated with the field (nullable).
 * @property {string} name - Name of the field.
 * @property {string} acronym - Acronym representing the field.
 */
export const Field = z.object({
  id: z.number(),
  cycle: Cycle.nullable(),
  name: z.string(),
  acronym: z.string(),
});

export type Field = z.infer<typeof Field>;

export const Faculty = z.object({
  id: z.number(),
  coordinator: Teacher.nullable(),
  secretary: Teacher.nullable(),
  other_members: z.array(Teacher),
  field: Field,
  name: z.string(),
  acronym: z.string(),
});

export type Faculty = z.infer<typeof Faculty>;

export const Department = z.object({
  id: z.number(),
  start_class_year: Class,
  end_class_year: Class,
  faculty: Faculty,
  director: Teacher.nullable(),
  other_members: z.array(Teacher),
  name: z.string(),
  acronym: z.string(),
});

export type Department = z.infer<typeof Department>;

export const Class = z.object({
  id: z.number(),
  cycle: Cycle.nullable(),
  name: z.string(),
  acronym: z.string(),
  order_number: z.number(),
  description: z.string().nullable(),
});

export type Class = z.infer<typeof Class>;

export const ClassPresident = z.object({
  id: z.number(),
  departement: Department,
  class_year: Class,
  student: Enrollment,
});

export type ClassPresident = z.infer<typeof ClassPresident>;

export const Period = z.object({
  id: z.number(),
  cycle: Cycle.nullable(),
  academic_year: Year,
  name: z.string(),
  acronym: z.string(),
  type_of_period: z.enum(["semester, block_semester, quarter, term"]),
  order_number: z.number(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  max_value: z.number(),
  status: z.enum(["pending", "progress", "finished", "suspended"]),
});

export type Period = z.infer<typeof Period>;

export const Currency = z.object({
  id: z.number(),
  name: z.string(),
  iso_code: z.enum([]),
  symbol: z.string(),
  enabled: z.boolean(),
});

export type Currency = z.infer<typeof Currency>;

export const PaymentMethod = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
});

export type PaymentMethod = z.infer<typeof PaymentMethod>;

export const Permission = z.object({
  id: z.number(),
  name: z.string(),
  content_type_id: z.number(),
  codename: z.string(),
  content_type: z.number(),
});

export type Permission = z.infer<typeof Permission>;

export const Group = z.object({
  id: z.number(),
  name: z.string(),
  permissions: z.array(Permission),
});

export type Group = z.infer<typeof Group>;

export const Role = z.object({
  id: z.number(),
  name: z.string(),
});

export type Role = z.infer<typeof Role>;

export type RolesType =
  | "is_apparitor"
  | "is_apparitorat_personal"
  | "is_faculty_coordinator"
  | "is_faculty_secretary"
  | "is_faculty_personal"
  | "is_finance_budget_administrator"
  | "is_finance_accountant"
  | "is_finance_personal"
  | "is_jury_president"
  | "is_jury_secretary"
  | "is_jury_member"
  | "is_jury_personal"
  | "is_rector"
  | "is_rectorship_cabin_manager"
  | "is_rectorship_secretary"
  | "is_rectorship_personal"
  | "is_academic_general_secretary"
  | "is_sgad_cabin_manager"
  | "is_sgad_secretary"
  | "is_sgad_personal"
  | "is_administrative_secretary_general"
  | "is_sga_personal_manager"
  | "is_sga_secretary"
  | "is_sga_personal"
  | "is_reseach_general_secretary"
  | "is_sgr_cabin_manager"
  | "is_sgr_secretary"
  | "is_sgr_personal";

export const User = z.object({
  id: z.number(),
  user_permissions: z.array(Permission),
  groups: z.array(Group),
  last_login: z.string().datetime(),
  is_superuser: z.boolean(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  is_staff: z.boolean(),
  is_student: z.boolean(),
  is_active: z.boolean(),
  is_permanent_teacher: z.boolean(),
  date_joined: z.string().datetime(),
  surname: z.string().nullable(),
  username: z.string(),
  email: z.string().email(),
  matricule: z.string(),
  gender: z.enum(["M", "F"]),
  avatar: z.string().nullable(),
  pending_avatar: z.string().nullable(),
  roles: z.array(Role),
});

export type User = z.infer<typeof User>;

export const Classroom = z.object({
  id: z.number(),
  name: z.string(),
  room_type: z
    .enum([
      "amphitheater", // Amphithéâtre
      "classroom", // Salle de cours
      "laboratory", // Laboratoire
      "computer-room", // Salle informatique
      "meeting-room", // Salle de réunion
      "chapel", // Chapelle
      "office", // Bureau
    ])
    .nullable(),
  capacity: z.number().nullable(),
  code: z.string(),
  status: z.enum(["occupied", "unoccupied"]).nullable(),
});

export type Classroom = z.infer<typeof Classroom>;

export const Course = z.object({
  id: z.number(),
  faculties: z.array(Faculty),
  name: z.string(),
  code: z.string(),
  course_type: z.enum([
    "theoretical",
    "practical",
    "theoretical_and_practical",
  ]),
});

export type Course = z.infer<typeof Course>;

export const TeachingUnit = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  category: z.enum(["required", "optional", "free", "transversal"]),
  faculty: Faculty.nullable(),
  cycle: Cycle.nullable(),
  credit_count: z.number().nullable(),
});

export type TeachingUnit = z.infer<typeof TeachingUnit>;

export const TaughtCourse = z.object({
  id: z.number(),
  teacher: Teacher.nullable(),
  assistants: z.array(Teacher).nullable(),
  class_room: Classroom.nullable(),
  academic_year: Year.nullable(),
  teaching_unit: TeachingUnit.nullable(),
  period: Period.nullable(),
  available_course: Course,
  faculty: Faculty,
  departements: z.array(Department),
  credit_count: z.number().nullable(),
  theoretical_hours: z.number().nullable(),
  practical_hours: z.number().nullable(),
  max_value: z.number().nullable(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  status: z.enum(["pending", "progress", "finished", "suspended"]).nullable(),
  attendance_threshold: z.number(),
});

export type TaughtCourse = z.infer<typeof TaughtCourse>;

export const HourTracking = z.object({
  id: z.number(),
  course: TaughtCourse,
  date: z.date(),
  start_time: z.string().time(),
  end_time: z.string().time(),
  hours_completed: z.number(),
  activity_type: z.enum([
    "lecture", //Cours Magistral (CM)
    "tutorial", //Travaux Dirigés (TD)
    "practical", //Travaux Pratiques (TP)
    "practical_tutorial", //Travaux Pratiques et Dirigés (TPD)
  ]),
  lesson: z.string().nullable(),
  cp_validation: z.boolean(),
  teacher_validation: z.boolean(),
});

export type HourTracking = z.infer<typeof HourTracking>;

export const AttendanceList = z.object({
  id: z.number(),
  course: TaughtCourse,
  verified_by: User,
  student_attendance_status: z.array(AttendanceListItem),
  date: z.date(),
  time: z.string().time(),
});

export type AttendanceList = z.infer<typeof AttendanceList>;

export const AttendanceListItem = z.object({
  id: z.number(),
  student: Enrollment, //PeriodEnrollment,
  status: z.enum(["present", "absent", "justified"]),
  note: z.string().nullable(),
});

export type AttendanceListItem = z.infer<typeof AttendanceListItem>;

export const CourseEnrollment = z.object({
  id: z.number(),
  student: PeriodEnrollment,
  date: z.date(),
  course: TaughtCourse,
  status: z.enum(["pending", "validated", "rejected"]).nullable(),
  exempted_on_attendance: z.boolean(),
});

export type CourseEnrollment = z.infer<typeof CourseEnrollment>;

export const DepartmentProgram = z.object({
  id: z.number(),
  departement: Department,
  courses_of_program: z.array(CourseProgram),
  name: z.string(),
  credit_count: z.number().nullable(),
  duration: z.number().nullable(),
  description: z.string().nullable(),
});

export type DepartmentProgram = z.infer<typeof DepartmentProgram>;

export const CourseProgram = z.object({
  id: z.number(),
  theoretical_hours: z.number().nullable(),
  practical_hours: z.number().nullable(),
  credit_count: z.number().nullable(),
  max_value: z.number().nullable(),
  available_course: Course.nullable(),
});

export type CourseProgram = z.infer<typeof CourseProgram>;

export const Enrollment = z.object({
  id: z.number(),
  user: User,
  academic_year: Year,
  cycle: Cycle,
  faculty: Faculty,
  field: Field,
  departement: Department,
  class_year: Class,
  common_enrollment_infos: StudentInfo,
  type_of_enrollment: z
    .enum(["new_application", "reapplication", "former_application"])
    .nullable(),
  enrollment_fees: z.enum(["paid", "partially_paid", "unpaid"]).nullable(),
  status: z.enum(["enabled", "disabled"]).nullable(),
  date_of_enrollment: z.date(),
});

export type Enrollment = z.infer<typeof Enrollment>;

export const PeriodEnrollment = z.object({
  id: z.number(),
  year_enrollment: Enrollment,
  period: Period,
  date_of_enrollment: z.string().date(),
  status: z.enum(["validated", "pending", "rejected"]),
});

export type PeriodEnrollment = z.infer<typeof PeriodEnrollment>;

export const House = z.object({
  id: z.number(),
  name: z.string(),
});

export type House = z.infer<typeof House>;

export const StudentPreviousStudy = z.object({
  id: z.number(),
  academic_year: z.string(),
  institution: z.string(),
  study_year_and_faculty: z.string(),
  result: z.number(),
});

export type StudentPreviousStudy = z.infer<typeof StudentPreviousStudy>;

export const EnrollmentQA = z.object({
  id: z.number(),
  registered_enrollment_question: EnrollmentQuestion.nullable(),
  response: z.string(),
});

export type EnrollmentQA = z.infer<typeof EnrollmentQA>;

export const EnrollmentQuestion = z.object({
  id: z.number(),
  question: z.string(),
  enabled: z.boolean(),
});

export type EnrollmentQuestion = z.infer<typeof EnrollmentQuestion>;

export const TestCourse = z.object({
  id: z.number(),
  faculty: Faculty,
  name: z.string(),
  max_value: z.number(),
  description: z.string(),
  enabled: z.boolean(),
});

export type TestCourse = z.infer<typeof TestCourse>;

export const TestResult = z.object({
  id: z.number(),
  course_test: TestCourse,
  result: z.number().nullable(),
});

export type TestResult = z.infer<typeof TestResult>;

export const StudentInfo = z.object({
  id: z.number(),
  previous_university_studies: z.array(StudentPreviousStudy),
  enrollment_question_response: z.array(EnrollmentQA),
  admission_test_result: z.array(TestResult),
  name: z.string(),
  place_of_birth: z.string(),
  date_of_birth: z.string().date(),
  nationality: z.string(),
  marital_status: z
    .enum(["single", "married", "divorced", "widowed"])
    .nullable(),
  religious_affiliation: z.string(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  name_of_secondary_school: z.string(),
  country_of_secondary_school: z.string(),
  province_of_secondary_school: z.string(),
  territory_or_municipality_of_school: z.string(),
  section_followed: z.string(),
  father_name: z.string(),
  father_phone_number: z.string().nullable(),
  mother_name: z.string(),
  mother_phone_number: z.string().nullable(),
  current_city: z.string(),
  current_municipality: z.string(),
  current_neighborhood: z.string(),
  country_of_origin: z.string(),
  province_of_origin: z.string(),
  territory_or_municipality_of_origin: z.string(),
  physical_ability: z.enum(["normal" | "disabled"]).nullable(),
  professional_activity: z.string(),
  spoken_language: z.string(),
  year_of_diploma_obtained: z.string(),
  diploma_number: z.string(),
  diploma_percentage: z.number(),
  is_foreign_registration: z.boolean().nullable(),
  house: House.nullable(),
  application_documents: z.array(ApplicationDocument),
});

export type StudentInfo = z.infer<typeof StudentInfo>;

export const PrematureEnd = {
  id: number(),
  student: Enrollment,
  reason: z.string(),
};

export type PrematureEnd = z.infer<typeof PrematureEnd>;

export const Application = Enrollment.merge(StudentInfo).extend({
  surname: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  gender: z.enum(["M", "F"]),
  email: z.string().email(),
  status: z.enum(["pending", "validated", "reoriented", "rejected"]).nullable(),
  avatar: z.string().nullable(),
  pending_avatar: z.string().nullable(),
  is_former_student: z.boolean(),
  former_year_enrollment_id: z.number().nullable(),
  former_matricule: z.string().nullable(),
  date_of_submission: z.string().date(),
});

export type Application = z.infer<typeof Application>;

export type ApplicationFormDataType = Omit<
  Application,
  | "id"
  | "academic_year"
  | "cycle"
  | "faculty"
  | "field"
  | "departement"
  | "class_year"
  | "previous_university_studies"
  | "enrollment_question_response"
  | "admission_test_result"
  | "name"
  | "house"
  | "user"
  | "common_enrollment_infos"
  | "date_of_submission"
  | "spoken_language"
  | "application_documents"
  | "date_of_enrollment"
> & {
  year_id: number;
  cycle_id: number;
  faculty_id: number;
  field_id: number;
  department_id: number;
  class_id: number;
  spoken_languages: string[];
  student_previous_studies: Omit<StudentPreviousStudy, "id">[];
  enrollment_q_a: Omit<EnrollmentQA, "id" | "registered_enrollment_question">[];
  test_result: Omit<TestResult, "id">[];
  application_documents: Omit<
    ApplicationDocument,
    "id" | "required_document"
  >[];
};

const Step1ApplicationFormDataType = z.object({
  former_matricule: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  surname: z.string(),
  gender: z.enum(["M", "F"]),
  place_of_birth: z.string(),
  date_of_birth: z.string(),
  nationality: z.string(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  religious_affiliation: z.string(),
  physical_ability: z.enum(["normal", "disabled"]),
  spoken_languages: z.array(z.string()),
  email: z.string().email(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
});

export type Step1ApplicationFormDataType = z.infer<
  typeof Step1ApplicationFormDataType
>;

const Step2ApplicationFormDataType = z.object({
  father_name: z.string(),
  mother_name: z.string(),
  father_phone_number: z.string().optional(),
  mother_phone_number: z.string().optional(),
});

export type Step2ApplicationFormDataType = z.infer<
  typeof Step2ApplicationFormDataType
>;

const Step3ApplicationFormDataType = z.object({
  country_of_origin: z.string(),
  province_of_origin: z.string(),
  territory_or_municipality_of_origin: z.string(),
  is_foreign_registration: z.boolean(),
});

export type Step3ApplicationFormDataType = z.infer<
  typeof Step3ApplicationFormDataType
>;

const Step4ApplicationFormDataType = z.object({
  current_city: z.string(),
  current_municipality: z.string(),
  current_neighborhood: z.string(),
});

export type Step4ApplicationFormDataType = z.infer<
  typeof Step4ApplicationFormDataType
>;

const Step5ApplicationFormDataType = z.object({
  name_of_secondary_school: z.string().nonempty(),
  country_of_secondary_school: z.string().nonempty(),
  province_of_secondary_school: z.string().nonempty(),
  territory_or_municipality_of_school: z.string(),
  section_followed: z.string(),
  year_of_diploma_obtained: z.string(),
  diploma_number: z.string(),
  diploma_percentage: z.number().min(0).max(100),
});

export type Step5ApplicationFormDataType = z.infer<
  typeof Step5ApplicationFormDataType
>;

const Step6ApplicationFormDataType = z.object({
  professional_activity: z.string(),
  previous_university_studies: z.array(StudentPreviousStudy.omit({ id: true })),
});

export type Step6ApplicationFormDataType = z.infer<
  typeof Step6ApplicationFormDataType
>;

const Step7ApplicationFormDataType = z.object({
  year_id: z.number(),
  cycle_id: z.number(),
  field_id: z.number(),
  faculty_id: z.number(),
  department_id: z.number(),
  class_id: z.number(),
});

export type Step7ApplicationFormDataType = z.infer<
  typeof Step7ApplicationFormDataType
>;

const Step8ApplicationFormDataType = z.object({
  enrollment_q_a: z.array(
    EnrollmentQA.omit({
      id: true,
      registered_enrollment_question: true,
    }).merge(z.object({ registered_enrollment_question: z.number() }))
  ),
});

export type Step8ApplicationFormDataType = z.infer<
  typeof Step8ApplicationFormDataType
>;

const Step9ApplicationFormDataType = z.object({
  application_documents: z.array(
    ApplicationDocument.omit({ id: true, required_document: true }).merge(
      z.object({ required_document: z.number() })
    )
  ),
});

export type Step9ApplicationFormDataType = z.infer<
  typeof Step9ApplicationFormDataType
>;

export type ApplicationEditFormDataType = Omit<
  Application,
  | "id"
  | "academic_year"
  | "cycle"
  | "faculty"
  | "field"
  | "departement"
  | "class_year"
  | "spoken_language"
  | "application_documents"
  | "enrollment_question_response"
  | "admission_test_result"
> & {
  year_id: number;
  cycle_id: number;
  faculty_id: number;
  field_id: number;
  department_id: number;
  class_id: number;
  spoken_languages: string[];
  application_documents: Array<
    Omit<ApplicationDocument, "id" | "required_document"> & {
      id: number | null;
      required_document: number | null;
    }
  >;
  enrollment_question_response: Array<
    Omit<EnrollmentQA, "registered_enrollment_question"> & {
      registered_enrollment_question: number | null;
    }
  >;
  admission_test_result: Array<
    Omit<TestResult, "id" | "course_test"> & {
      id: number | null;
      course_test: number | null;
    }
  >;
};

export const ApplicationDocument = z.object({
  id: z.number(),
  exist: z.boolean(),
  status: z.enum(["pending", "rejected", "validated"]),
  file_url: z.string().nullable(),
  required_document: RequiredDocument.nullable(),
});

export type ApplicationDocument = z.infer<typeof ApplicationDocument>;

export const RequiredDocument = z.object({
  id: z.number(),
  title: z.string(),
  enabled: z.boolean(),
  required: z.boolean(),
});

export type RequiredDocument = z.infer<typeof RequiredDocument>;

export const Teacher = z.object({
  id: z.number(),
  user: User,
  gender: z.enum(["M", "F"]),
  institution_of_origin: z.string(),
  academic_title: z.string(),
  academic_grade: z.string(),
  other_responsabilities: z.string().nullable(),
  nationality: z.string(),
  place_of_birth: z.string().nullable(),
  date_of_birth: z.string().date().nullable(),
  address: z.string(),
  city_or_territory: z.string(),
  physical_ability: z.enum(["normal" | "disabled"]).nullable(),
  religious_affiliation: z.string().nullable(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  field_of_study: z.string(),
  education_level: z.string(),
  is_foreign_country_teacher: z.boolean().nullable(),
});

export type Teacher = z.infer<typeof Teacher>;

export const Step1TeacherFormDataType = z.object({
  matricule: z.string().optional(),
  first_name: z.string(),
  last_name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  gender: z.enum(["M", "F"]),
  city_or_territory: z.string(),
  place_of_birth: z.string(),
  date_of_birth: z.string().date(),
  address: z.string(),
  is_foreign_country_teacher: z.boolean().nullable(),
  religious_affiliation: z.string(),
  nationality: z.string(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  physical_ability: z.enum(["normal", "disabled"]),
});

export type Step1TeacherFormDataType = z.infer<typeof Step1TeacherFormDataType>;

export const Step2TeacherFormDataType = z.object({
  field_of_study: z.string(),
  academic_title: z.string(),
  academic_grade: z.string(),
  education_level: z.string(),
  other_responsabilities: z.string(),
});

export type Step2TeacherFormDataType = z.infer<typeof Step2TeacherFormDataType>;

export const Jury = z.object({
  id: z.number(),
  academic_year: Year,
  faculties: z.array(Faculty),
  chairperson: Teacher,
  secretary: Teacher,
  members: z.array(Teacher),
  name: z.string(),
});

export type Jury = z.infer<typeof Jury>;

export const LetterGrading = z.object({
  id: z.number(),
  grade_letter: z.string(),
  lower_bound: z.number(),
  upper_bound: z.number(),
  appreciation: z.string(),
  description: z.string(),
});

export type LetterGrading = z.infer<typeof LetterGrading>;
export const GradeClass = z.object({
  id: z.number(),
  student: PeriodEnrollment,
  jury: Jury,
  course: TaughtCourse,
  continuous_assessment: z.number().nullable(),
  exam: z.number().nullable(),
  total: z.number(),
  grade_letter: LetterGrading,
  earned_credits: z.number(),
  validation: z.enum(["validated", "no_validated"]),
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  status: z.enum(["validated", "pending"]),
  is_retaken: z.boolean(),
});

export type GradeClass = z.infer<typeof GradeClass>;

export type NewGradeClass = Omit<
  GradeClass,
  | "id"
  | "status"
  | "is_retaken"
  | "moment"
  | "session"
  | "validation"
  | "earned_credits"
  | "grade_letter"
  | "total"
  | "course"
  | "jury"
  | "continuous_assessment"
  | "exam"
  | "student"
> & {
  id?: number;
  status?: "validated" | "pending";
  is_retaken?: boolean;
  moment?: "before_appeal" | "after_appeal";
  session?: "main_session" | "retake_session";
  validation?: "validated" | "no_validated";
  earned_credits?: number;
  grade_letter?: LetterGrading;
  total?: number;
  course?: TaughtCourse;
  jury?: Jury;
  continuous_assessment?: number | null;
  exam?: number | null;
  student?: PeriodEnrollment;
};

export const TeachingUnitGrades = z.object({
  id: z.number(),
  jury: Jury,
  student: PeriodEnrollment,
  teaching_unit: TeachingUnit,
  course_grades_list: z.array(GradeClass),
  credit_sum: z.number(),
  validated_credit_sum: z.number(),
  unvalidated_credit_sum: z.number(),
  weighted_average: z.number(),
  percentage: z.number(),
  grade_letter: LetterGrading,
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  validated_courses_sum: z.number(),
  unvalidated_courses_sum: z.number(),
  validation_status: z.enum(["validated", "no_validated"]),
});

export type TeachingUnitGrades = z.infer<typeof TeachingUnitGrades>;

export const PeriodGrades = z.object({
  id: z.number(),
  jury: Jury,
  student: PeriodEnrollment,
  period: Period,
  teaching_unit_grades_list: z.array(TeachingUnitGrades),
  credit_sum: z.number(),
  validated_credit_sum: z.number(),
  unvalidated_credit_sum: z.number(),
  weighted_average: z.number(),
  percentage: z.number(),
  grade_letter: LetterGrading,
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  validated_TU_sum: z.number(),
  unvalidated_TU_sum: z.number(),
  period_decision: z.enum(["passed", "postponed"]),
});

export type PeriodGrades = z.infer<typeof PeriodGrades>;

export const YearGrades = z.object({
  id: z.number(),
  student: Enrollment,
  jury: Jury,
  period_grade_list: z.array(PeriodGrades),
  credit_sum: z.number(),
  validated_credit_sum: z.number(),
  unvalidated_credit_sum: z.number(),
  weighted_average: z.number(),
  percentage: z.number(),
  grade_letter: LetterGrading,
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  validated_TU_sum: z.number(),
  unvalidated_TU_sum: z.number(),
  final_decision: z.enum(["passed", "postponed"]),
});

export type YearGrades = z.infer<typeof YearGrades>;

export const Announcement = z.object({
  id: z.number(),
  academic_year: Year,
  period: Period,
  faculty: Faculty,
  departement: Department,
  class_year: Class,
  total_students: z.number(),
  graduated_students: z.number(),
  non_graduated_students: z.number(),
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  date_created: z.string(),
  date_updated: z.string(),
  status: z.enum(["locked", "unlocked"]),
  mode:z.enum(["ALL-STUDENTS", "SOME-STUDENTS"])
});

export type Announcement = z.infer<typeof Announcement>;


export const RetakeCourseReason = z.object({
  id: z.number(),
  reason: z.enum(["low_attendance", "missing_course", "failed_course"]),
  academic_year: Year,
  available_course: Course,
  class_year: Class,
});

export type RetakeCourseReason = z.infer<typeof RetakeCourseReason>;

export const RetakeCourse = z.object({
  id: z.number(),
  user: User,
  retake_course_list: z.array(RetakeCourseReason),
  retake_course_done_list: z.array(RetakeCourseReason),
  faculty: Faculty,
  departement: Department,
});

export type RetakeCourse = z.infer<typeof RetakeCourse>;

export const ResultGrid = z.object({
  HeaderData: z.object({
    no_retaken: z.object({
      course_list: z.array(z.array(TaughtCourse)),
      credits: z.array(z.array(z.number())),
      period_list: z.array(
        z.object({
          course_counter: z.number(),
          period: Period,
          teaching_unit_counter: z.number(),
        })
      ),
      teaching_unit_list: z.array(
        z.array(
          z.object({
            course_counter: z.number(),
            course_id_list: z.array(z.number()),
            teaching_unit: TeachingUnit,
          })
        )
      ),
    }),
    retaken: z.object({
      course_list: z.array(TaughtCourse),
      credits: z.array(number),
      header: z.array(
        z.object({
          course_counter: z.number(),
          retake_title: z.string(),
          teaching_unit_counter: z.number(),
        })
      ),
      teaching_unit_list: z.array(
        z.object({
          course_counter: z.number(),
          course_id_list: z.array(number),
          teaching_unit: TeachingUnit,
        })
      ),
    }),
  }),
  BodyDataList: z.array(
    z.object({
      credit_sum: z.number(),
      decision: z.enum(["passed", "postponed"]),
      first_name: z.string(),
      gender: z.enum(["M", "F"]),
      grade_letter: z.string(),
      id: z.number(),
      last_name: z.string(),
      matricule: z.string(),
      year_enrollment_id: z.number(),
      user_id: z.number(),
      percentage: z.number(),
      surname: z.string(),
      unvalidated_TU_count: z.number(),
      unvalidated_credit_sum: z.number(),
      validated_TU_count: z.number(),
      validated_courses_count: z.number(),
      unvalidated_courses_count: z.number(),
      validated_credit_sum: z.number(),
      weighted_average: z.number(),
      no_retaken: z.object({
        continuous_assessments: z.array(z.array(z.number())),
        course_decisions: z.array(
          z.array(z.enum(["validated", "no_validated"]))
        ),
        earned_credits: z.array(z.array(z.number())),
        exams: z.array(z.array(z.number())),
        grade_letters: z.array(z.array(z.string())),
        teaching_unit_decisions: z.array(
          z.array(
            z.object({
              cols_counter: z.number(),
              name: z.string(),
              value: z.enum(["validated", "no_validated"]),
            })
          )
        ),
        teaching_units: z.array(z.array(z.number())),
        totals: z.array(z.array(z.number())),
      }),
      retaken: z.object({
        continuous_assessments: z.array(z.number()),
        course_decisions: z.array(z.enum(["validated", "no_validated"])),
        earned_credits: z.array(z.number()),
        exams: z.array(z.number()),
        grade_letters: z.array(string),
        teaching_unit_decisions: z.array(
          z.object({
            cols_counter: z.number(),
            name: z.string(),
            value: z.enum(["validated", "no_validated"]),
          })
        ),
        teaching_units: z.array(z.number()),
        totals: z.array(z.number()),
      }),
    })
  ),
});

export type ResultGrid = z.infer<typeof ResultGrid>;


export const Appeal = z.object({
  id: z.number(),
  student: Enrollment,
  jury: Jury,
  subject: z.string(),
  description: z.string(),
  submission_date: z.string(),
  courses: z.array(TaughtCourse),
  status: z.enum([
    "submitted",
    "in_progress",
    "processed",
    "rejected",
    "archived",
  ]),
  response: z.string().nullable(),
  file: z.string().nullable(),
  session: z.enum(["main_session", "retake_session"]),
});

export type Appeal = z.infer<typeof Appeal>;


export type PeriodResultPresentionItem={
    decision: "passed" | "postponed";
    expected_total_credit: number;
    first_name: string;
    gender: "M" | "F";
    grade: string;
    id: number;
    id_user_obj: number;
    last_name: string;
    matricule: string;
    percentage: number;
    surname: string;
    unvalidated_credit_sum: number;
    validated_credit_sum: number;
    weighted_average: number;
  }

export type YearResultPresentationItem = {
  decision: "passed" | "postponed";
  expected_total_credit: number;
  first_name: string;
  gender: "M" | "F";
  grade: string;
  id: number;
  id_user_obj: number;
  last_name: string;
  matricule: string;
  percentage: number;
  period_0_acronym: string;
  period_0_total_credit: number;
  period_0_validated_credit_sum: number;
  period_0_weighted_average: number;
  period_1_acronym: string;
  period_1_total_credit: number;
  period_1_validated_credit_sum: number;
  period_1_weighted_average: number;
  period_2_acronym: string;
  period_2_total_credit: number;
  period_2_validated_credit_sum: number;
  period_2_weighted_average: number;
  surname: string;
  validated_credit_total: number;
  weighted_average: number;
};

const DeliberationMinutesDataBodyItem = z.object({
  title: z.string(),
  student_list: z.array(
    z.object({
      decision: z.enum(["passed", "postponed"]),
      first_name: z.string(),
      gender: z.enum(["M", "F"]),
      grade: z.string(),
      id: z.number(),
      last_name: z.string(),
      matricule: z.string(),
      percentage: z.number(),
      surname: z.string(),
      weighted_average: z.number(),
    })
  ),
});

export const DeliberationMinutesData = z.object({
  body: z.object({
    A: DeliberationMinutesDataBodyItem,
    B: DeliberationMinutesDataBodyItem,
    C: DeliberationMinutesDataBodyItem,
    D: DeliberationMinutesDataBodyItem,
    E: DeliberationMinutesDataBodyItem,
    F: DeliberationMinutesDataBodyItem,
    G: DeliberationMinutesDataBodyItem,
  }),
  general_statistics: z.object({
    female_count: z.number(),
    male_count: z.number(),
    passed_count: z.number(),
    postponed_count: z.number(),
    total_class_announced: z.number(),
    total_class_enrolled: z.number(),
  }),
  grade_statistics: z.object({
    A: z.object({ count: z.number(), percentage: z.number() }),
    B: z.object({ count: z.number(), percentage: z.number() }),
    C: z.object({ count: z.number(), percentage: z.number() }),
    D: z.object({ count: z.number(), percentage: z.number() }),
    E: z.object({ count: z.number(), percentage: z.number() }),
    F: z.object({ count: z.number(), percentage: z.number() }),
    G: z.object({ count: z.number(), percentage: z.number() }),
  }),
});
export type DeliberationMinutesData = z.infer<typeof DeliberationMinutesData>;

export const GradeReportResponse = z.object({
  academic_general_secretary: z.array(Teacher),
  academic_year: z.string(),
  body_semesters: z.array(PeriodGrades),
  class_year: z.string(),
  cycle: z.string(),
  departement: z.string(),
  field: z.string(),
  faculty_name: z.string(),
  faculty_acronym: z.string(),
  first_name: z.string(),
  generale_average: z.object({
    credit_sum: z.number(),
    decision: z.enum(["passed", "postponed"]),
    grade_letter: LetterGrading,
    percentage: z.number(),
    unvalidated_credit_sum: z.number(),
    validated_credit_sum: z.number(),
    weighted_average: z.number(),
  }),
  id: z.number(),
  id_user_obj: z.number(),
  last_name: z.string(),
  matricule: z.string(),
  surname: z.string(),
});

export type GradeReportResponse = z.infer<typeof GradeReportResponse>;
