import api from "@/lib/fetcher";
import {
  BulkStudentItem,
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
  facultyId?: number;
  departmentId?: number;
  classId?: number;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const { yearId, facultyId, departmentId, classId, page, pageSize, search } =
    searchParams;
  const query = new URLSearchParams();
  if (yearId !== undefined) {
    query.append("academic_year__id", yearId.toString());
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

    worksheet.addRow([`Liste des étudiants: ${options.classYear.acronym} ${options.department.name}`]); // row 1
    worksheet.getRow(1).font = { bold: true, size: 16, name: "Arial" };
    worksheet.addRow([]); // row 2
    worksheet.addRow(["Filière:", `${options.faculty.name}`]); // row 3
    worksheet.addRow(["Mention:", `${options.department.name}`]); // row 4
    worksheet.addRow([
      "Promotion",
      `${options.classYear.acronym} (${options.classYear.name})`,
    ]); // row 5
    worksheet.addRow([]) //row 6
    worksheet.addRow([
      "Type d'inscription",
      "Matricule",
      "Nom",
      "Postnom",
      "Prénom",
      "Lieu de naissance",
      "Date de naissance",
      "Email",
      "Téléphone",
      "Adresse",
      "Genre (M/F)",
      "Nationalité",
      "Statut matrimonial",
      "Aptitude physique",
      "Affiliation religieuse",
    ]); // row 7
    worksheet.getRow(7).eachCell((cell, colNumber) => {
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

      if (colNumber === 4 || colNumber === 5 || colNumber === 6) {
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }
    });

     // Activer la protection de la feuille (sans mot de passe)
  worksheet.protect("", {
    selectLockedCells: true, // Permet la sélection en lecture seule
    selectUnlockedCells: true, // Permet l'édition des cellules déverrouillées
    formatCells: false, // Empêche la modification des styles
  });

    autoFitColumns(worksheet);
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

export async function importStudentsFromExcel(
  file: File
): Promise<BulkStudentItem[]> {
  return [];
}

export async function createBulkStudents() {
  const res = await api.post(`/apparitorat/year-enrollment/bulk-create/`, {});
  return res.data;
}
