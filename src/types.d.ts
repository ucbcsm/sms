import {  string, z } from "zod";

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
  // coordinator: null,
  // secretary: null,
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
  // chair_person: null,
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

export type Currency=z.infer<typeof Currency>

export const PaymentMethod = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
});

export type PaymentMethod=z.infer<typeof PaymentMethod>

export const User = z.object({
  id: z.number(),
  user_permissions: z.array(),
  groups: z.array(),
  last_login: z.string().datetime(),
  is_superuser: z.boolean(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  is_staff: z.boolean(),
  is_active: z.boolean(),
  date_joined: z.string().datetime(),
  surname: z.string().nullable(),
  username: z.string(),
  email: z.string().email(),
  matricule: z.string(),
  avatar: z.string().nullable(),
  pending_avatar: z.string().nullable(),
  roles: z.array(),
});

export type User = z.infer<typeof User>;


export const Classroom = z.object({
  id:z.number(),
  name: z.string(),
  room_type: z.enum([]).nullable(),
  capacity: z.number().nullable(),
  code: z.string(),
  status: z.enum([ "occupied","unoccupied"]).nullable(),
});

export type Classroom = z.infer<typeof Classroom>;