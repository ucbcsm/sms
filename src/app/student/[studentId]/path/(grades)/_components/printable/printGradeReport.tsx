"use client";

import { DocHeader } from "@/components/doc-header";
import { getDecisionText, getShortGradeValidationText } from "@/lib/api";
import {
  GradeReportResponse,
  Institute,
} from "@/types";
import { Descriptions, Typography } from "antd";
import React, { FC, Fragment, RefObject } from "react";
import { SecretarySignaturePlaceholder } from "../signature";

type PrintableGradeReportProps = {
  ref: RefObject<HTMLDivElement | null>;
  mode: "PERIOD-GRADE" | "YEAR-GRADE";
  data: GradeReportResponse;
  institution?: Institute;
};

const currentYear= new Date().getFullYear()

export const PrintableGradeReport: FC<PrintableGradeReportProps> = ({
  ref,
  mode,
  data,
  institution,
}) => {
  return (
    <div className="hidden">
      <div ref={ref} className=" ">
        <DocHeader />
        {mode === "PERIOD-GRADE" && (
          <Descriptions
            title={`Rélevé des Notes et des Matières`}
            extra={`No ${data.id}/${data.matricule}/${data.faculty_acronym}/${institution?.acronym}/${currentYear}`}
            size="small"
            bordered
            column={2}
            items={[
              {
                key: "names",
                label: "Nom & Post-nom",
                children: `${data.surname} ${data.last_name} ${data.first_name}`,
              },
              {
                key: "matricule",
                label: "Matricule",
                children: `${data.matricule}`,
              },
              {
                key: "cycle",
                label: "Niveau",
                children: `${data.class_year} ${data.cycle} - LMD`,
              },
              {
                key: "field",
                label: "Domaine",
                children: `${data.field}`,
              },
              {
                key: "faculty",
                label: "Filière",
                children: `${data.faculty_name}`,
              },
              {
                key: "department",
                label: "Mention",
                children: `${data.departement}`,
              },
              {
                key: "year",
                label: "Année académique",
                children: `${data.academic_year}`,
              },
            ]}
            style={{ marginBottom: 28 }}
          />
        )}

        {mode === "YEAR-GRADE" && (
          <Descriptions
            title={`Rélevé des Notes et des Matières`}
            column={2}
            extra={`No ${data.id}/${data.matricule}/${data.faculty_acronym}/${institution?.acronym}/${currentYear}`}
            bordered
            items={[
              {
                key: "names",
                label: "Nom & Post-nom",
                children: `${data.surname} ${data.last_name} ${data.first_name}`,
              },
              {
                key: "matricule",
                label: "Matricule",
                children: `${data.matricule}`,
              },
              {
                key: "cycle",
                label: "Niveau",
                children: `${data.class_year} ${data.cycle} - LMD`,
              },
              {
                key: "field",
                label: "Domaine",
                children: `${data.field}`,
              },
              {
                key: "faculty",
                label: "Filière",
                children: `${data.faculty_name}`,
              },
              {
                key: "department",
                label: "Mention",
                children: `${data.departement}`,
              },
              {
                key: "year",
                label: "Année académique",
                children: `${data.academic_year}`,
              },
            ]}
            style={{ marginBottom: 28 }}
          />
        )}

        <table className="min-w-full divide-y divide-gray-200 [&_th]:whitespace-nowrap [&_th]:p-1 [&_th]:border [&_th]:border-gray-300 [&_td]:whitespace-nowrap [&_td]:p-1 [&_td]:border [&_td]:border-gray-300">
          <thead className="">
            <tr className=" bg-gray-50 font-normal">
              <th className="text-left">
                Intitulés des Unités d&apos;Enseignement (UE) et Eléments
                Constitutifs (EC)
              </th>
              <th>Crédits</th>
              <th>Note/20</th>
              <th>Grade</th>
              <th>Validation EC</th>
              <th>Crédits validés</th>
            </tr>
          </thead>
          <tbody>
            {data.body_semesters.map((periodData) => (
              <Fragment key={periodData.id}>
                <tr>
                  <td
                    className="text-center font-semibold uppercase"
                    colSpan={6}
                  >
                    {periodData.period.name}
                  </td>
                </tr>
                {periodData.teaching_unit_grades_list.map(
                  (TUData, tu_index) => (
                    <Fragment key={TUData.id}>
                      <tr className="bg-gray-50 font-semibold">
                        <td>
                          UE{tu_index + 1}: {TUData.teaching_unit.name}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      {TUData.course_grades_list.map((courseData) => (
                        <tr key={courseData.id}>
                          <td>{courseData.course.available_course.name}</td>
                          <td className=" text-right">
                            {courseData.course.credit_count}
                          </td>
                          <td className=" text-right">{courseData.total}</td>
                          <td className=" text-center bg-blue-100 font-semibold">
                            {courseData.grade_letter.grade_letter}
                          </td>
                          <td className=" text-center">
                            {getShortGradeValidationText(courseData.validation)}
                          </td>
                          <td className=" text-right">
                            {courseData.earned_credits}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  )
                )}
                <tr className="bg-blue-100 font-semibold">
                  <td>Moyenne semestrielle</td>
                  <td className="text-right">{periodData.credit_sum}</td>
                  <td className="text-right">{periodData.weighted_average}</td>
                  <td className="text-center bg-blue-100 font-semibold">
                    {periodData.grade_letter.grade_letter}
                  </td>
                  <td className="text-center">
                    {getDecisionText(periodData.period_decision)}
                  </td>
                  <td className="text-right">
                    {periodData.validated_credit_sum}
                  </td>
                </tr>
              </Fragment>
            ))}
            {data.body_semesters.length > 1 && (
              <tr className=" font-semibold">
                <td>Moyenne générale</td>
                <td className="text-right">
                  {data.generale_average.credit_sum}
                </td>
                <td className="text-right">
                  {data.generale_average.weighted_average}
                </td>
                <td className="text-center bg-blue-100 font-semibold">
                  {data.generale_average.grade_letter.grade_letter}
                </td>
                <td className="text-center">
                  {getDecisionText(data.generale_average.decision)}
                </td>
                <td className="text-right">
                  {data.generale_average.validated_credit_sum}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="grid grid-cols-2 pt-4">
          <div className="flex flex-col">
            <Typography.Text>
              Crédits validés: {data?.generale_average.validated_credit_sum}
            </Typography.Text>
            <Typography.Text>
              Poucentage: {data?.generale_average.percentage}%
            </Typography.Text>
            <Typography.Text>
              Grade: {data?.generale_average.grade_letter.grade_letter} (
              {data?.generale_average.grade_letter.appreciation})
            </Typography.Text>
            <Typography.Text>
              Décision: {getDecisionText(data?.generale_average.decision!)}
            </Typography.Text>
          </div>
          <div>
            Fait à {institution?.city}, le{" "}
            {new Date().toLocaleDateString("fr-FR")}
            <br />
            Le secrétaire général académique, chargé des enseignements et suivi
            du programme des cours
            <div className="mt-6">
              <SecretarySignaturePlaceholder
                data={data?.academic_general_secretary}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
