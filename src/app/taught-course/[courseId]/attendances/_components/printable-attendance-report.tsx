"use client";

import { DocHeader } from "@/components/doc-header";
import { TaughtCourse } from "@/types";
import { Card, Descriptions, Table, Tag } from "antd";
import { FC, RefObject } from "react";

type PrintableAttendanceReportProps = {
  ref: RefObject<HTMLDivElement | null>;
  data?: any[];
  course?: TaughtCourse;
};
export const PrintableAttendanceReport: FC<PrintableAttendanceReportProps> = ({
  ref,
  data,
  course,
}) => {
  return (
    <div className="hidden">
      <div ref={ref} className=" ">
        <DocHeader />

        <Card style={{ marginBottom: 28 }}>
          <Descriptions
            title="Rapport d'assiduité"
            size="small"
            column={2}
            items={[
              {
                key: "course",
                label: "Cours",
                children: `${course?.available_course.name} (${course?.available_course.code})`,
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
            ]}
          />
        </Card>

        <Table
          dataSource={data}
          columns={[
            {
              key: "matricule",
              dataIndex: "matricule",
              title: "Maticule",
              width: 72,
              align: "right",
            },
            {
              title: "Noms",
              dataIndex: "name",
              key: "date",
              render: (_, record, __) => record.student,
            },
            {
              key: "class_year",
              dataIndex: "class_year",
              title: "Promotion",
              render: (_, record, __) =>
                `${record.class_year} ${record.departement}`,
            },
            {
              key: "percentage",
              dataIndex: "percentage",
              title: "Assiduité",
              render: (value) => `${value || 0}%`,
              width: 74,
              align: "right",
            },
            {
              key: "required_attendance_reached",
              dataIndex: "required_attendance_reached",
              title: "Requis",
              render: (_, record, __) => (
                <Tag
                  color={
                    record.required_attendance_reached ? "success" : "error"
                  }
                  bordered={false}
                  style={{ marginRight: 0, width: "100%", textAlign: "center" }}
                >
                  {record.required_attendance_reached ? "OUI" : "NON"}
                </Tag>
              ),
              width: 64,
            },
          ]}
          rowKey="id"
          rowClassName={`bg-[#f5f5f5] odd:bg-white`}
          size="small"
          pagination={false}
          bordered
        />
      </div>
    </div>
  );
};
