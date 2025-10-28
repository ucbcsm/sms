"use client";

import { getDecisionText, getShortGradeValidationText } from "@/lib/api";
import { GradeReportResponse } from "@/types";
import { FC, Fragment } from "react";

type GradeTableReportProps = {
  data: GradeReportResponse[];
};

export const GradeTableReport: FC<GradeTableReportProps> = ({ data }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 [&_th]:whitespace-nowrap [&_th]:p-1 [&_th]:border [&_th]:border-gray-300 [&_td]:whitespace-nowrap [&_td]:p-1 [&_td]:border [&_td]:border-gray-300">
      <thead className="">
        <tr className="sticky z-10 -top-6 bg-gray-50 font-normal">
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
        {data?.map((yearData) => (
          <Fragment key={yearData.id}>
            {yearData.body_semesters.map((periodData) => (
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
            {yearData.body_semesters.length > 1 && (
              <tr className=" font-semibold">
                <td>Moyenne générale</td>
                <td className="text-right">
                  {yearData.generale_average.credit_sum}
                </td>
                <td className="text-right">
                  {yearData.generale_average.weighted_average}
                </td>
                <td className="text-center bg-blue-100 font-semibold">
                  {yearData.generale_average.grade_letter.grade_letter}
                </td>
                <td className="text-center">
                  {getDecisionText(yearData.generale_average.decision)}
                </td>
                <td className="text-right">
                  {yearData.generale_average.validated_credit_sum}
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};
