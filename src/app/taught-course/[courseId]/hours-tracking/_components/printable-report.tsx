'use client';

import { DocHeader } from "@/components/doc-header";
import { getHourTrackingActivityTypeName } from "@/lib/api";
import { HourTracking, TaughtCourse } from "@/types";
import { PrinterOutlined } from "@ant-design/icons";
import { Button, Checkbox, Descriptions, Space, Table, Typography } from "antd";
import { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";

dayjs.locale("fr");

type PrintableHoursTrackingReportProps = {
  //   ref: RefObject<HTMLDivElement | null>;
  data?: HourTracking[];
  course?: TaughtCourse;
};
export const PrintableHoursTrackingReport: FC<PrintableHoursTrackingReportProps> = ({
  data,
  course,
}) => {
  const refToPrint = useRef<HTMLDivElement | null>(null);

  const printReport = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `Rapport-suivi-des-heures-${course?.available_course.name.replaceAll(
      " ",
      "-"
    )}-${course?.academic_year?.name}`,
  });
  return (
    <div>
      <Button
        icon={<PrinterOutlined />}
        style={{ boxShadow: "none" }}
        onClick={printReport}
        title="Imprimer le rapport"
      >
        Imprimer le rapport
      </Button>
      <div className="hidden">
        <div ref={refToPrint} className=" ">
          <DocHeader
            serviceName="Secrétariat General académique"
            showContactInfo={false}
          />
          <Descriptions
            title="Fiche de suivi des heures"
            styles={{
              title: { textTransform: "uppercase", textAlign: "center" },
            }}
            size="small"
            bordered
            column={3}
            style={{ marginBottom: 28 }}
            items={[
              {
                key: "course",
                label: "Cours",
                children: `${course?.available_course.name}`,
              },
              {
                key: "code",
                label: "Code",
                children: course?.available_course.code || "",
              },
              {
                key: "credits",
                label: "Crédits",
                children: course?.credit_count || "",
              },
              {
                key: "hours",
                label: "Heures totales",
                children:
                  Number(course?.practical_hours) +
                    Number(course?.theoretical_hours) || "",
              },
              {
                key: "practical_hours",
                label: "Heures pratiques",
                children: course?.practical_hours || "",
              },
              {
                key: "theoretical_hours",
                label: "Heures théoriques",
                children: course?.theoretical_hours || "",
              },
              {
                key: "year",
                label: "Année académique",
                children: course?.academic_year?.name || "",
              },
              {
                key: "period",
                label: "Période",
                children: `${course?.period?.name || ""} (${
                  course?.period?.acronym || ""
                })`,
              },
              {
                key: "faculty",
                label: "Filière",
                children: course?.faculty?.name || "",
              },
              {
                key: "department",
                label: "Mention(s)",
                children: course?.departements.map((dep) => dep.name).join(","),
              },
              {
                key: "instructor",
                label: "Enseignant(e)",
                children: `${course?.teacher?.user.surname || ""} ${
                  course?.teacher?.user.last_name || ""
                } ${course?.teacher?.user.first_name || ""}`,
              },
              {
                key: "education_level",
                label: "Niveau d'étude",
                children: course?.teacher?.education_level || "",
              },
              {
                key: "academic_grade",
                label: "Grade académique",
                children: course?.teacher?.academic_grade || "",
              },
              {
                key: "field_of_study",
                label: "Domaine de formation",
                children: course?.teacher?.field_of_study || "",
              },
            ]}
          />

          <Table
            title={() => (
              <div className="flex justify-between">
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  {data?.length || ""} séances
                </Typography.Title>
                <Space>
                  <Typography.Text type="secondary">
                    Total heures prestées:
                  </Typography.Text>
                  <Typography.Text strong>
                    {data
                      ?.reduce(
                        (sum, record) => sum + (record.hours_completed || 0),
                        0
                      )
                      .toString()}
                  </Typography.Text>
                  /
                  <Typography.Text strong>
                    {Number(course?.practical_hours || 0) +
                      Number(course?.theoretical_hours || 0)}
                  </Typography.Text>
                </Space>
              </div>
            )}
            bordered
            size="small"
            dataSource={data}
            columns={[
              {
                title: "Jour/Date",
                dataIndex: "date",
                key: "date",
                render: (_, record, __) =>
                  ` ${dayjs(record.date).format("dddd, DD/MM/YYYY")}`,
              },
              {
                title: "Matière",
                dataIndex: "subject",
                key: "subject",
                render: (_, record, __) => record?.lesson,
              },
              {
                title: "Heures",
                key: "hours",
                children: [
                  {
                    title: "Début",
                    dataIndex: "start_time",
                    key: "start_time",
                    render: (_, record, __) =>
                      record?.start_time.substring(0, 5),
                    width: 64,
                  },
                  {
                    title: "Fin",
                    dataIndex: "end_time",
                    key: "end_time",
                    render: (_, record, __) => record?.end_time.substring(0, 5),
                    width: 64,
                  },
                ],
              },
              {
                key: "hours_completed",
                title: "Heures prestées",
                dataIndex: "hours_completed",
                render: (_, record, __) => record?.hours_completed,
                width: 64,
              },
              {
                title: "Type d'activité",
                dataIndex: "activity_type",
                key: "activity_type",
                render: (_, record, __) =>
                  getHourTrackingActivityTypeName(record?.activity_type),
              },
              {
                title: "Signature CP",
                dataIndex: "cp_validation",
                key: "cp_validation",
                render: (_, record, __) => (
                  <Checkbox checked={record?.cp_validation} disabled />
                ),
                width: 100,
              },
              {
                title: "Signature enseignant",
                dataIndex: "teacher_validation",
                key: "teacher_validation",
                render: (_, record, __) => (
                  <Checkbox checked={record?.teacher_validation} disabled />
                ),
                width: 100,
              },
            ]}
            rowKey="id"
            pagination={false}
            style={{ marginBottom: 28 }}
          />
          <div className="">
            <Descriptions
              bordered
              title="Durée et calendrier de prestation"
              column={4}
              size="small"
              items={[
                {
                  key: "duration",
                  label: "Durée de prestation",
                  children: "...... J",
                },
                {
                  key: "start_date",
                  label: "Date de début",
                  children: "...... / .... / ............",
                },
                {
                  key: "end_date",
                  label: "Date de fin",
                  children: "...... / .... / ............",
                },
                {
                  key: "deadline",
                  label: "Deadline du dernier TP",
                  children: "...... / .... / ............",
                },
              ]}
            />
          </div>
          <div className="mt-12">
            <Descriptions
              title="Évaluation du cours par les étudiants"
              bordered
              column={2}
              size="small"
              items={[
                {
                  key: "date",
                  label: "Date d'évaluation",
                  children: "...... / .... / ............",
                },
                {
                  key: "participation",
                  label: "Nombre de participants",
                  children: "",
                },
                {
                  key: "male_participation",
                  label: "Nombre d'hommes",
                  children: "",
                },
                {
                  key: "female_participation",
                  label: "Nombre de femmes",
                  children: "",
                },
                {
                  key: "average",
                  label: "Cote finale",
                  children: (
                    <Space>
                      <Checkbox> Excellent</Checkbox>
                      <Checkbox> Très bien</Checkbox>
                      <Checkbox> Bien</Checkbox>
                      <Checkbox> Assez bien</Checkbox>
                      <Checkbox> Médiocre</Checkbox>
                    </Space>
                  ),
                },
              ]}
            />
          </div>

          <div className="flex justify-between mt-12">
            <div className="text-center">
              <Typography.Title level={5}>
                Coordonnateur de la filière
              </Typography.Title>
              <div className="h-12" />
              <Typography.Text type="secondary">
                ................................
              </Typography.Text>
            </div>
            <div className="text-center">
              <Typography.Title level={5}>
                Course evaluation manager
              </Typography.Title>
              <div className="h-12" />
              <Typography.Text type="secondary">
                ................................
              </Typography.Text>
            </div>
            <div className="text-center">
              <Typography.Title level={5}>
                Secrétaire Géneral Académique
              </Typography.Title>
              <div className="h-12" />
              <Typography.Text type="secondary">
                ................................
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};