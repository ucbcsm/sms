"use client";

import { getStudentGradeReport } from "@/lib/api/grade-report";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Result, Space, Typography } from "antd";
import {  parseAsInteger, useQueryState } from "nuqs";
import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";

type ViewPeriodGradeReportProps = {
 periodGradeId: number;
};

export const ViewPeriodGradeReport: FC<ViewPeriodGradeReportProps> = ({
 periodGradeId
}) => {

  const refToPrint = useRef<HTMLDivElement | null>(null);
   const [openId, setOpenId] = useQueryState(
     "view-period-report",
     parseAsInteger
   );
  const printReport = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `Rélevés-de-notes-`,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      "period_grades_report",
      periodGradeId
    ],
    queryFn: () =>
      getStudentGradeReport({
        period_grade__id: periodGradeId,
        mode: "PERIOD-GRADE",
      }),
    enabled:!!periodGradeId
  });

   console.log(data);

  const onClose = () => {
    setOpenId(null);
  };

  return (
    <>
      <Button
        color="primary"
        variant="dashed"
        style={{ boxShadow: "none" }}
        onClick={() => setOpenId(periodGradeId)}
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
              Rélevé de notes:
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
          body: { padding: "0 0 40px 0" },
        }}
        style={{ padding: 0 }}
        loading={isPending}
        open={openId === periodGradeId}
        onClose={onClose}
        footer={false}
        closable={false}
        extra={
          <Space>
            <Typography.Text type="secondary">Année: </Typography.Text>
            <Typography.Text strong></Typography.Text>
            <Divider type="vertical" />
            <Typography.Text type="secondary">Session: </Typography.Text>
            <Typography.Text strong></Typography.Text>
            <Divider type="vertical" />
            <Typography.Text type="secondary">Moment: </Typography.Text>
            <Typography.Text strong></Typography.Text>
            <Divider type="vertical" />
            <Button
              style={{
                boxShadow: "none",
              }}
              icon={<PrinterOutlined />}
              color="primary"
              variant="dashed"
              onClick={printReport}
              disabled={isPending || data?.BodyDataList?.length === 0}
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
      </Drawer>
    </>
  );
};
