"use client";
import { getHSLColor } from "@/lib/utils";
import { Class, CourseEnrollment, Department, PeriodEnrollment, TaughtCourse } from "@/types";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  Typography,
} from "antd";
import { FC } from "react";
import { NewCourseEnrollmentForm } from "./forms/new";

type ListCourseStudentsProps = {
  courseEnrollments?: CourseEnrollment[];
  course?: TaughtCourse;
  periodEnrollments?: PeriodEnrollment[];
  departments?: Department[];
    classes?: Class[]; // Promotions
};

export const ListCourseStudents: FC<ListCourseStudentsProps> = ({
  courseEnrollments,
  course,
  periodEnrollments,
  classes,
  departments
}) => {
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Validées
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Input.Search placeholder="Rechercher ..." />
            <NewCourseEnrollmentForm
              course={course}
              periodEnrollments={periodEnrollments}
              courseEnrollments={courseEnrollments}
              departments={departments}
              classes={classes}
            />
            <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
              Imprimer
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "pdf",
                    label: "PDF",
                    icon: <FilePdfOutlined />,
                    title: "Exporter en PDF",
                  },
                  {
                    key: "excel",
                    label: "EXCEL",
                    icon: <FileExcelOutlined />,
                    title: "Exporter vers Excel",
                  },
                ],
              }}
            >
              <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                Exporter
              </Button>
            </Dropdown>
          </Space>
        </header>
      )}
      dataSource={courseEnrollments}
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record, __) => (
            <Avatar
              style={{
                backgroundColor: getHSLColor(
                  `${record.student.year_enrollment.user.first_name} ${record.student.year_enrollment.user.last_name} ${record.student.year_enrollment.user.surname}`
                ),
              }}
            >
              {record.student.year_enrollment.user.first_name
                ?.charAt(0)
                .toUpperCase()}
              {record.student.year_enrollment.user.last_name
                ?.charAt(0)
                .toUpperCase()}
            </Avatar>
          ),
          width: 58,
          align: "center",
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          width: 92,
          render: (_, record, __) =>
            record.student.year_enrollment.user.matricule.padStart(6, "0"),
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "available_course",
          key: "available_course",
          render: (_, record) => (
            <>
              {record.student.year_enrollment.user.first_name}{" "}
              {record.student.year_enrollment.user.last_name}{" "}
              {record.student.year_enrollment.user.surname}
            </>
          ),
        },
        {
          key: "class",
          dataIndex: "class",
          title: "Promotion",
          render: (_, record, __) =>
            `${record.student.year_enrollment.class_year.acronym} ${record.student.year_enrollment.departement.name}`,
        },
        {
          title: "Date d'inscription",
          dataIndex: "date",
          key: "date",
          render: (_, record, __) =>
            record.date
              ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                  new Date(`${record.date}`)
                )
              : "",
        },
      ]}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
      }}
    />
  );
};
