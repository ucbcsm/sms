import api from "@/lib/fetcher";
import {
  BulkStudentApplicationItem,
  Class,
  Cycle,
  Department,
  Enrollment,
  Faculty,
} from "@/types";
import ExcelJS from "exceljs";
import { forEach } from "lodash";

export async function getYearEnrollments(searchParams: {
  yearId?: number;
  cycleId?: number;
  facultyId?: number;
  departmentId?: number;
  classId?: number;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const {
    yearId,
    cycleId,
    facultyId,
    departmentId,
    classId,
    page,
    pageSize,
    search,
  } = searchParams;
  const query = new URLSearchParams();
  if (yearId !== undefined) {
    query.append("academic_year__id", yearId.toString());
  }
  if (cycleId !== undefined) {
    query.append("cycle__id", cycleId.toString());
  }

  if (facultyId !== undefined) {
    query.append("faculty__id", facultyId.toString());
  }
  if (departmentId !== undefined) {
    query.append("departement__id", departmentId.toString());
  }
  if (classId !== undefined) {
    query.append("class_year__id", classId.toString());
  }
  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    query.append("page_size", pageSize.toString());
  }
  if (search !== undefined && search.trim() !== "") {
    query.append("search", search.trim());
  }

  const res = await api.get(`/apparitorat/year-enrollment?${query.toString()}`);
  return res.data as {
    results: Enrollment[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getAllFacultyYearEnrollments(
  yearId: number,
  facultyId: number
) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}&faculty__id=${facultyId}&get_all=true`
  );
  return res.data as Enrollment[];
}

export async function getYearEnrollmentsByFacultyId(
  yearId: number,
  facultyId: number
) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}&faculty__id=${facultyId}`
  );

  return res.data.results as Enrollment[];
}

export async function getAllYearEnrollmentsByFaculty(
  yearId: number,
  facultyId: number
) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}&faculty__id=${facultyId}&get_all=true`
  );

  return res.data as Enrollment[];
}

export async function getYearEnrollmentsByDepatmentId(
  yearId: number,
  depatmentId: number
) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}&departement__id=${depatmentId}/`
  );
  return res.data.results as Enrollment[];
}

export async function getYearEnrollment(id: number) {
  const res = await api.get(`/apparitorat/year-enrollment/${id}/`);
  return res.data as Enrollment;
}

export async function deleteYearEnrollment(id: number) {
  const res = await api.delete(`/apparitorat/year-enrollment/${id}/`);
  return res.data;
}

export async function getStudentDashboard(
  yearId: number,
  yearEnrollmentId: number
) {
  const res = await api.get(
    `/student/student-dashboard/?academic_year__id=${yearId}&year_enrollment__id=${yearEnrollmentId}`
  );
  return res.data as {
    student_infos: Enrollment;
  };
}

export function getYearEnrollementsAsOptions(data?: Enrollment[]) {
  const options = data?.map((enrollment) => ({
    value: enrollment.id,
    label: `${enrollment.user.surname} ${enrollment.user.last_name} ${enrollment.user.first_name}`,
  }));

  return options;
}

interface ExcelFont {
  size?: number; // Taille de police optionnelle
  bold?: boolean; // Gras optionnel
  // Autres propriétés possibles : name, italic, color, etc.
}

function estimateCellWidth(text: string, font: ExcelFont = {}): number {
  const DEFAULT_CHAR_WIDTH = 1.2;
  const BOLD_MULTIPLIER = 1.2;
  const FONT_SIZE_FACTOR = (font.size || 11) / 11;

  let width = 0;
  if (text) {
    width = text.length * DEFAULT_CHAR_WIDTH;
    if (font.bold) width *= BOLD_MULTIPLIER;
    width *= FONT_SIZE_FACTOR;
  }
  return width;
}

// Fonction pour ajuster automatiquement la largeur des colonnes
function autoFitColumns(worksheet: ExcelJS.Worksheet) {
  worksheet.columns.forEach((column) => {
    if (!column || !column.eachCell) return; // Sécurité

    let maxWidth = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      // Estimer la largeur en fonction du contenu
      const cellValue = cell.value ? cell.value.toString() : "";
      const cellWidth = estimateCellWidth(cellValue, cell.font);

      if (cellWidth > maxWidth) {
        maxWidth = cellWidth;
      }
    });

    // Appliquer la largeur calculée (+ un petit buffer)
    column.width = Math.min(Math.max(maxWidth + 2, 10), 50); // Limiter entre 10 et 50
  });
}

export async function downloadStudentImportTemplate({
  onStart,
  onSuccess,
  fileName = "students-form-template.xlsx",
  inputs,
}: {
  inputs: {
    cycle: Cycle;
    faculty: Faculty;
    department: Department;
    classes: Class[];
  };
  onStart?: () => void;
  onSuccess?: () => void;
  fileName: string;
}) {
  if (onStart) {
    onStart();
  }
  const workbook = new ExcelJS.Workbook();

  const createStudentImportTemplateSheet = (
    workbook: ExcelJS.Workbook,
    options: {
      sheetName: string;
      cycle: Cycle;
      faculty: Faculty;
      department: Department;
      classYear: Class;
    }
  ) => {
    const worksheet = workbook.addWorksheet(
      `${options.sheetName}-${options.department.acronym}`,
      {
        headerFooter: { oddFooter: "Page &P / &N" },
      }
    );

    worksheet.addRow([
      `Étudiants de ${options.classYear.acronym} ${options.department.name}`,
    ]); // row 1
    worksheet.getRow(1).font = { bold: true, size: 16, name: "Arial" };
    worksheet.addRow([]); // row 2
    worksheet.addRow(["Cycle", `${options.cycle.name}`]); // row 3
    worksheet.addRow(["Domaine", `${options.faculty.field.name}`]); // row 4
    worksheet.addRow(["Filière:", `${options.faculty.name}`]); // row 5
    worksheet.addRow(["Mention:", `${options.department.name}`]); // row 6
    worksheet.addRow([
      "Promotion",
      `${options.classYear.acronym} (${options.classYear.name})`,
    ]); // row 7
    worksheet.addRow([
      options.cycle.id,
      options.faculty.field.id,
      options.faculty.id,
      options.department.id,
      options.classYear.id,
    ]); //row 8 (for keeping hidden data like ids)
    worksheet.getRow(8).hidden = true;
    worksheet.addRow([]); //row 9
    worksheet.addRow([
      "Type d'inscription",
      "Frais d'inscription",
      "Matricule",
      "Nom",
      "Postnom",
      "Prénom",
      "Genre (M/F)",
      "Lieu de naissance",
      "Date de naissance",
      "Nationalité",
      "Statut matrimonial",
      "Aptitude physique",
      "Affiliation religieuse",
      "Langues parlées",
      "Email",
      "Téléphone 1",
      "Téléphone 2",
      "Nom du père",
      "Téléphone du père",
      "Nom de la mère",
      "Téléphone de la mère",
      "Pays d'origine",
      "Province d'origine",
      "Ville ou Territoire d'origine",
      "Est-il étranger?",
      "Ville actuelle",
      "Commune actuelle",
      "Adresse actuelle",
      "Nom de l'école secondaire",
      "Pays de l'école secondaire",
      "Province de l'école secondaire",
      "Territoire ou commune de l'école",
      "Section suivie",
      "Année d'obtention du diplôme",
      "Numéro du diplôme",
      "Pourcentage du diplôme",
      "Activité professionnelle",
    ]); // row 10

    worksheet.getRow(10).eachCell((cell, colNumber) => {
      cell.font = {
        color: { argb: "FFFFFFFF" },
        bold: true,
        size: 12,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF008367" },
      };
    });

    autoFitColumns(worksheet);

    for (let row = 11; row <= 1500; row++) {
      // colonne 1 type d'insciption
      worksheet.getCell(`A${row}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [
          '"Nouvelle candidature,Réinscription,Enregistrement ancienne candidature"',
        ],
        showErrorMessage: true,
        showInputMessage: true,
        errorStyle: "stop",
        errorTitle: "Valeur non valide",
        error: "Veuillez sélectionner une vraie valeur",
        promptTitle: "Type d'inscription",
        prompt:"Veuillez sélectionner le type d'inscription dans la liste déroulante",
      };
      // colonne 2 frais d'inscription
      worksheet.getCell(`B${row}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ['"Payé,Partiellement payé,Non payé"'],
        showErrorMessage: true,
        showInputMessage: true,
        errorStyle: "stop",
        errorTitle: "Valeur non valide",
        error: "Veuillez sélectionner une vraie valeur",
        promptTitle: "Frais d'inscription",
        prompt:"Veuillez sélectionner le statut des frais d'inscription dans la liste déroulante",
      };
      // Colonne 6 = Genre (M/F)
      worksheet.getCell(`G${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"M,F"'],
        showErrorMessage: true,
        showInputMessage: true,
        errorStyle: "stop",
        errorTitle: "Valeur non valide",
        error: "Veuillez sélectionner une valeur M ou F dans la liste.",
        promptTitle: "Genre",
        prompt: "Veuillez sélectionner le genre dans la liste déroulante.",
      };

      //Validation date de naissance (colonne I)
      const cell = worksheet.getCell(`I${row}`);

      cell.dataValidation = {
        type: "date",
        operator: "between",
        formulae: [new Date(1900, 0, 1), new Date()],
        allowBlank: true,
        showErrorMessage: true,
        showInputMessage: true,
        errorStyle: "stop",
        errorTitle: "Date non valide",
        error:
          "Veuillez entrer une date valide entre 1900 et aujourd'hui au format JJ/MM/AAAA.",
        promptTitle: "Format de date",
        prompt:
          "Veuillez entrer la date au format JJ/MM/AAAA (par exemple, 25/12/2000).",
      };

      // Forcer le format d'affichage
      cell.numFmt = "dd/mm/yyyy";

      // Colonne 9 = Statut matrimonial
      worksheet.getCell(`K${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"Célibataire,Marié(e),Divorcé(e),Veuf/Veuve"'],
        showErrorMessage: true,
        showInputMessage: true,
        errorStyle: "stop",
        errorTitle: "Valeur non valide",
        error:
          "Choisissez une valeur parmi Célibataire, Marié(e), Divorcé(e), Veuf/Veuve dans la liste proposée.",
        promptTitle: "Statut matrimonial",
        prompt:
          "Veuillez sélectionner le statut matrimonial dans la liste déroulante.",
      };

      // Colonne 10 = Aptitude physique
      worksheet.getCell(`V${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"Normale,Handicapé"'],
        showErrorMessage: true,
        showInputMessage: true,
        errorStyle: "stop",
        errorTitle: "Valeur non valide",
        error: "Choisissez Normale ou Handicapé dans la liste.",
        promptTitle: "Aptitude physique",
        prompt:
          "Veuillez sélectionner l'aptitude physique dans la liste déroulante.",
      };

      // Colonne 23 = Est-il étranger ?
      worksheet.getCell(`Y${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"Oui,Non"'],
        showErrorMessage: true,
        showInputMessage: true,
        errorStyle: "stop",
        errorTitle: "Valeur non valide",
        error: "Choisissez Oui ou Non.",
        promptTitle: "Est-il étranger ?",
        prompt: "Veuillez sélectionner Oui ou Non dans la liste déroulante.",
      };
    }
    //Déverrouiller toutes les cellules
    // worksheet.eachRow({ includeEmpty: true }, (row) => {
    //   row.eachCell({ includeEmpty: true }, (cell) => {
    //     cell.protection = { locked: false }; // toutes déverrouillées
    //   });
    // });

    // Verrouiller uniquement les lignes 1 à 10 (en-têtes)
    // for (let rowIndex = 1; rowIndex <= 10; rowIndex++) {
    //   const row = worksheet.getRow(rowIndex);
    //   row.eachCell({ includeEmpty: true }, (cell) => {
    //     cell.protection = { locked: true };
    //   });
    // }

    // Activer la protection du worksheet
    // worksheet.protect("", {
    //   selectLockedCells: true, // permet de sélectionner les cellules verrouillées
    //   selectUnlockedCells: true, // permet de sélectionner les cellules déverrouillées
    //   formatCells: false, // empêche la modification du format des cellules
    // });
  };

  forEach(inputs.classes, (cls) => {
    createStudentImportTemplateSheet(workbook, {
      sheetName: `${cls.acronym}`,
      cycle: inputs.cycle,
      faculty: inputs.faculty,
      department: inputs.department,
      classYear: cls,
    });
  });

  // Génération du fichier en mémoire
  const buffer = await workbook.xlsx.writeBuffer();

  // Téléchargement dans le navigateur
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (onSuccess) {
    onSuccess();
  }
}

export function getMaritalStatus(value?: string) {
  if (!value) return null;

  const v = value.trim();

  switch (v) {
    case "Célibataire":
      return "single";

    case "Marié(e)":
      return "married";

    case "Divorcé(e)":
      return "divorced";

    case "Veuf/Veuve":
      return "widowed";

    default:
      return null; // Valeur par défaut si non reconnue
  }
}

export function getTypeOfEnrollment(value?: string) {
   if (!value) return null;

  switch (value) {
    case "Nouvelle candidature":
      return "new_application";
    case "Réinscription":
      return "reapplication";
    case "Enregistrement ancienne candidature":
      return "former_application";
    default:
      return null;
  }
}

export function getTypeOfEnrollmentText(
  value: "new_application" | "reapplication" | "former_application" | string
) {
  switch (value) {
    case "new_application":
      return "Nouvelle candidature";
    case "reapplication":
      return "Réinscription";
    case "former_application":
      return "Enregistrement ancienne candidature";
    default:
      return "";
  }
}

export function getPhysicalAbility(value?: string) {
  if (!value) return null;
  switch (value) {
    case "Normale":
      return "normal";
    case "Handicapé":
      return "disabled";
    default:
      return null;
  }
}

export function getEnrollmentFeesStatus(value?: string) {
  if (!value) return null;
    switch (value) {
    case "Payé":
      return "paid";
    case "Partiellement payé":
      return "partially_paid";
    case "Non payé":
      return "unpaid";
    default:
      return null;
  }
}

export function ddMMyyyyToIsoDate(dateStr: string): string | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Les mois sont indexés à partir de 0
  const year = parseInt(parts[2], 10);
  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) {
    return null; // Date invalide
  }
  return date.toISOString().split("T")[0]; // Retourne au format YYYY-MM-DD
}

export async function importStudentsFromExcel(file: File): Promise<
  {
    sheetName: string;
    departmentAcronym: string;
    cycleId: number;
    fieldId: number;
    facultyId: number;
    departmentId: number;
    classYearId: number;
    students: BulkStudentApplicationItem[];
  }[]
> {
  const workbook = new ExcelJS.Workbook();
  const fileContent = await file.arrayBuffer();
  await workbook.xlsx.load(fileContent);

  const worksheets = workbook.worksheets;
  const HEADER_ROW_INDEX = 10;
  const parsedSheets: {
    sheetName: string;
    departmentAcronym: string;
    cycleId: number;
    fieldId: number;
    facultyId: number;
    departmentId: number;
    classYearId: number;
    students: BulkStudentApplicationItem[];
  }[] = [];
  forEach(worksheets, (sheet) => {
    let parsedStudents: BulkStudentApplicationItem[] = [];
    const secretRow = sheet.getRow(8); // La ligne 8 contient les données secrètes (IDs)
    const secretRowValues = Array.isArray(secretRow.values)
      ? secretRow.values.slice(1) // Supprimer la première valeur vide
      : [];

    const [cycleId, fieldId, facultyId, departmentId, classYearId] =
      secretRowValues;
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber <= HEADER_ROW_INDEX) return; // Ignorer les lignes d'en-tête
      const rowValues = Array.isArray(row.values)
        ? row.values.slice(1) // Supprimer la première valeur vide
        : [];
      const [
        type_of_enrollment,
        enrollment_fees,
        former_matricule,
        surname,
        last_name,
        first_name,
        gender,
        place_of_birth,
        date_of_birth,
        nationality,
        marital_status,
        physical_ability,
        religious_affiliation,
        spoken_language,
        email,
        phone_number_1,
        phone_number_2,
        father_name,
        father_phone_number,
        mother_name,
        mother_phone_number,
        country_of_origin,
        province_of_origin,
        territory_or_municipality_of_origin,
        is_foreign_registration,
        current_city,
        current_municipality,
        current_neighborhood,
        name_of_secondary_school,
        country_of_secondary_school,
        province_of_secondary_school,
        territory_or_municipality_of_school,
        section_followed,
        year_of_diploma_obtained,
        diploma_number,
        diploma_percentage,
        professional_activity,
      ] = rowValues;

      if (cycleId && fieldId && facultyId && departmentId && classYearId) {
        parsedStudents.push({
          first_name: first_name?.toString() || "",
          last_name: last_name?.toString() || "",
          surname: surname?.toString() || "",
          gender: (gender?.toString() as "M" | "F") || null,
          former_matricule: former_matricule?.toString() || "",
          type_of_enrollment:
            getTypeOfEnrollment(type_of_enrollment?.toString()) ||
            "new_application",
          email:
            typeof email === "object"
              ? (email as { hyperlink: string; text: string })?.text || ""
              : email?.toString() || "",
          date_of_birth:
            typeof date_of_birth === "object"
              ? (date_of_birth as Date).toISOString().split("T")[0]
              : date_of_birth?.toString() || "",
          place_of_birth: place_of_birth?.toString() || "",
          nationality: nationality?.toString() || "",
          marital_status: getMaritalStatus(marital_status?.toString()),
          religious_affiliation: religious_affiliation?.toString() || "",
          phone_number_1: phone_number_1?.toString() || "",
          phone_number_2: phone_number_2?.toString() || "",
          name_of_secondary_school: name_of_secondary_school?.toString() || "",
          country_of_secondary_school:
            country_of_secondary_school?.toString() || "",
          province_of_secondary_school:
            province_of_secondary_school?.toString() || "",
          territory_or_municipality_of_school:
            territory_or_municipality_of_school?.toString() || "",
          section_followed: section_followed?.toString() || "",
          father_name: father_name?.toString() || "",
          father_phone_number: father_phone_number?.toString() || null,
          mother_name: mother_name?.toString() || "",
          mother_phone_number: mother_phone_number?.toString() || null,
          current_city: current_city?.toString() || "",
          current_municipality: current_municipality?.toString() || "",
          current_neighborhood: current_neighborhood?.toString() || "",
          country_of_origin: country_of_origin?.toString() || "",
          province_of_origin: province_of_origin?.toString() || "",
          territory_or_municipality_of_origin:
            territory_or_municipality_of_origin?.toString() || "",
          physical_ability: getPhysicalAbility(physical_ability?.toString()),
          professional_activity: professional_activity?.toString() || "",
          spoken_language: spoken_language?.toString() || "",
          year_of_diploma_obtained: year_of_diploma_obtained?.toString() || "",
          diploma_number: diploma_number?.toString() || "",
          diploma_percentage: Number(diploma_percentage?.toString() || ""),
          is_foreign_registration:
            is_foreign_registration?.toString() === "Oui" ? true : false,
          avatar: null,
          pending_avatar: null,
          enrollment_fees:
            getEnrollmentFeesStatus(enrollment_fees?.toString()) || "unpaid",
        });
      }
    });
    parsedSheets.push({
      sheetName: sheet.name,
      departmentAcronym: sheet.name.split("-")[1],
      cycleId: Number(secretRow.getCell(1).value),
      fieldId: Number(secretRow.getCell(2).value),
      facultyId: Number(secretRow.getCell(3).value),
      departmentId: Number(secretRow.getCell(4).value),
      classYearId: Number(secretRow.getCell(5).value),
      students: parsedStudents,
    });
  });

  return parsedSheets;
}

export async function createBulkStudents(data: {
  academic_year: number;
  cycle: number;
  field: number;
  faculty: number;
  departement: number;
  data: { class_year: number; students: BulkStudentApplicationItem[] }[];
}) {
  const res = await api.post(
    `/apparitorat/year-enrollment/import-from-excel/`,
    data
  );
  return res.data;
}
