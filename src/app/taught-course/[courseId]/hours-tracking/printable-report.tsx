'use client';

import { DocHeader } from "@/components/doc-header";
import { getHourTrackingActivityTypeName } from "@/lib/api";
import { HourTracking, TaughtCourse } from "@/types";
import { PrinterOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Descriptions, Space, Table, Typography } from "antd";
import { FC, RefObject, useRef } from "react";
import { useReactToPrint } from "react-to-print";

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
            serviceName="Sécretariat General académique"
            showContactInfo={false}
          />
          <Card style={{ marginBottom: 28 }}>
            <Descriptions
              title="Fiche de suivi des heures"
              size="small"
              bordered
              column={3}
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
                  children: course?.departements
                    .map((dep) => dep.name)
                    .join(","),
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
          </Card>

          <Table
            bordered
            size="small"
            dataSource={data}
            columns={[
              {
                title: "Jour/Date",
                dataIndex: "date",
                key: "date",
                render: (_, record, __) =>
                  record.date
                    ? new Intl.DateTimeFormat("fr", {
                        dateStyle: "full",
                      }).format(new Date(`${record.date}`))
                    : "",
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
              column={4}
              //   size="small"
              items={[
                {
                  key: "duration",
                  label: "Durée de prestation",
                  children: ".........",
                },
                {
                  key: "start_date",
                  label: "Date de début",
                  children: ".........",
                },
                {
                  key: "end_date",
                  label: "Date de fin",
                  children: ".........",
                },
                {
                  key: "deadline",
                  label: "Deadline du dernier TP",
                  children: ".........",
                },
              ]}
            />
          </div>
          <div className="mt-12">
            <Descriptions
              title="Evaluation du cours par les étudiants"
              bordered
              column={2}
              //   size="small"
              items={[
                {
                  key: "date",
                  label: "Date d'évaluation",
                  children: "....../......./.............",
                },
                {
                  key: "participation",
                  label: "Nombre de participants",
                  children: "",
                },
                {
                  key: "male_participation",
                  label: "Hommes",
                  children: "",
                },
                {
                  key: "female_participation",
                  label: "Femmes",
                  children: "",
                },
                {
                  key: "average",
                  label: "Cote finale",
                  children: (
                    <Space>
                      <Checkbox disabled> Excellent</Checkbox>
                      <Checkbox disabled> Très bien</Checkbox>
                      <Checkbox disabled> Bien</Checkbox>
                      <Checkbox disabled> Assez bien</Checkbox>
                      <Checkbox disabled> Médiocre</Checkbox>
                    </Space>
                  ),
                },
              ]}
            />
          </div>
          <div className=" mt-10">
            <Typography.Text>
              Fait à .........................., le .........................
            </Typography.Text>
          </div>
          <div className="flex justify-between mt-12">
            <div className="text-center">
              <Typography.Text>Coordonnateur de la filière</Typography.Text>
              <div className="h-12" />
              <p>................................</p>
            </div>
            <div className="text-center">
              <Typography.Text>Course evaluation manager</Typography.Text>
              <div className="h-12" />
              <Typography.Text>
                ................................
              </Typography.Text>
            </div>
            <div className="text-center">
              <Typography.Text>Sécretaire Géneral Académique</Typography.Text>
              <div className="h-12" />
              <Typography.Text>
                ................................
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};