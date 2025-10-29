"use client";

import { useInstitution } from "@/hooks/use-institution";
import { getDecisionText, getMomentText, getSessionText } from "@/lib/api";
import { getStudentGradeReport } from "@/lib/api/grade-report";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Result, Space, Typography } from "antd";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { GradeTableReport } from "./gradeTableReport";
import { YearGrades } from "@/types";
import { PrintableGradeReport } from "./printable/printGradeReport";
import { SecretarySignaturePlaceholder } from "./signature";

type ViewYearGradeReportProps = {
  yearGradeId: number;
  yearGrade: YearGrades;
};

export const ViewYearGradeReport: FC<ViewYearGradeReportProps> = ({
  yearGradeId,
  yearGrade,
}) => {
  const { data: institution } = useInstitution();
  const refToPrint = useRef<HTMLDivElement | null>(null);
  const [openId, setOpenId] = useQueryState("view-year-report", parseAsInteger);
  const printReport = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `Rélevés-de-notes-`,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["period_grades_report", yearGradeId],
    queryFn: () =>
      getStudentGradeReport({
        year_grade__id: yearGradeId,
        mode: "YEAR-GRADE",
      }),
    enabled: !!yearGradeId,
  });

  const onClose = () => {
    setOpenId(null);
  };

  return (
    <>
      <Button
        color="primary"
        variant="dashed"
        style={{ boxShadow: "none" }}
        onClick={() => setOpenId(yearGradeId)}
      >
        Voir détails
      </Button>

      <Drawer
        width="100%"
        title={
          <Space>
            <Typography.Title
              level={5}
              style={{ marginBottom: 0, textTransform: "uppercase" }}
              type="secondary"
              ellipsis={{}}
            >
              Rélevé de notes
            </Typography.Title>
            <Typography.Title
              level={5}
              style={{ marginBottom: 0 }}
              ellipsis={{}}
            ></Typography.Title>
          </Space>
        }
        styles={{
          header: { borderColor: "#d1d5dc" },
          // body: { padding: "0 0 40px 0" },
        }}
        style={{ padding: 0 }}
        loading={isPending}
        open={openId === yearGradeId}
        onClose={onClose}
        footer={false}
        closable={false}
        extra={
          <Space>
            <Typography.Text type="secondary">Année: </Typography.Text>
            <Typography.Text strong>
              {yearGrade.student.academic_year.name}
            </Typography.Text>
            <Divider type="vertical" />
            <Typography.Text type="secondary">Session: </Typography.Text>
            <Typography.Text strong>
              {getSessionText(yearGrade.session)}
            </Typography.Text>
            <Divider type="vertical" />
            <Typography.Text type="secondary">Moment: </Typography.Text>
            <Typography.Text strong>
              {getMomentText(yearGrade.moment)}
            </Typography.Text>
            <Divider type="vertical" />
            <Button
              style={{
                boxShadow: "none",
              }}
              icon={<PrinterOutlined />}
              color="primary"
              variant="dashed"
              onClick={printReport}
              disabled={isPending || !data}
            >
              Imprimer
            </Button>

            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              title="Fermer la grille"
            />
          </Space>
        }
      >
        <div className=" max-w-4xl mx-auto">
          {data && (
            <div>
              <GradeTableReport data={data} />

              <div className="grid grid-cols-2 pt-4">
                <div className="flex flex-col">
                  <Typography.Text>
                    Crédits validés:{" "}
                    {data.generale_average.validated_credit_sum}
                  </Typography.Text>
                  <Typography.Text>
                    Poucentage: {data.generale_average.percentage}%
                  </Typography.Text>
                  <Typography.Text>
                    Grade: {data.generale_average.grade_letter.grade_letter} (
                    {data.generale_average.grade_letter.appreciation})
                  </Typography.Text>
                  <Typography.Text>
                    Décision: {getDecisionText(data.generale_average.decision!)}
                  </Typography.Text>
                </div>
                <div>
                  Fait à {institution?.city}, le{" "}
                  {new Date().toLocaleDateString("fr-FR")}
                  <br />
                  Le secrétaire général académique, chargé des enseignements et
                  suivi du programme des cours
                  <div className="mt-6">
                    <SecretarySignaturePlaceholder
                      data={data.academic_general_secretary}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <Result
              title="Erreur de récupération des données"
              subTitle={
                error
                  ? (error as any)?.response?.data?.message
                  : "Une erreur est survenue lors de la tentative de récupération des données depuis le serveur. Veuillez réessayer."
              }
              status={"error"}
              extra={
                <Button
                  type="link"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Réessayer
                </Button>
              }
            />
          )}
          {data && (
            <PrintableGradeReport
              ref={refToPrint}
              mode="YEAR-GRADE"
              data={data}
              institution={institution}
            />
          )}
        </div>
      </Drawer>
    </>
  );
};
