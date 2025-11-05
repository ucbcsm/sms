"use client";
import { getHSLColor } from "@/lib/utils";
import {
  Class,
  CourseEnrollment,
  Department,
  PeriodEnrollment,
  TaughtCourse,
} from "@/types";
import {
  CheckOutlined,
  CloseOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  HourglassOutlined,
  MoreOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { FC, useState } from "react";
import { NewCourseEnrollmentForm } from "./forms/new";
import { PendingSingleCourseEnrollmentForm } from "./forms/decisions/pending";
import { RejectSingleCourseEnrollmentForm } from "./forms/decisions/reject";
import { ValidateSingleCourseEnrollmentForm } from "./forms/decisions/validate";
import { getCourseEnrollmentsByStatus } from "@/lib/api";
import { ExemptSingleCourseEnrollmentForm } from "./forms/decisions/exempt";
import { useQueryState } from "nuqs";

type ActionsBarProps = {
  item: CourseEnrollment;
};
const ActionsBar: FC<ActionsBarProps> = ({ item }) => {
  const {
    token: { colorSuccessActive, colorWarningActive, colorErrorActive },
  } = theme.useToken();
  const [openPending, setOpenPending] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);
  const [openExempt, setOpenExempt] = useState<boolean>(false);

  return (
    <>
      <PendingSingleCourseEnrollmentForm
        open={openPending}
        setOpen={setOpenPending}
        enrollment={item}
      />
      <ValidateSingleCourseEnrollmentForm
        open={openValidate}
        setOpen={setOpenValidate}
        enrollment={item}
      />
      <RejectSingleCourseEnrollmentForm
        open={openReject}
        setOpen={setOpenReject}
        enrollment={item}
      />
      <ExemptSingleCourseEnrollmentForm
        open={openExempt}
        setOpen={setOpenExempt}
        enrollment={item}
      />

      <Space>
        <Dropdown
          menu={{
            items: [
              item.status === "pending" || item.status === "rejected"
                ? {
                    key: "validate",
                    label: "Accepter",
                    icon: (
                      <CheckOutlined style={{ color: colorSuccessActive }} />
                    ),
                  }
                : null,
              item.status === "validated"
                ? {
                    key: "exempt",
                    label: item.exempted_on_attendance
                      ? "Retirer l'exonération"
                      : "Exempter d'assiduité",
                    icon: item.exempted_on_attendance ? (
                      <UndoOutlined style={{ color: colorErrorActive }} />
                    ) : (
                      <SafetyCertificateOutlined
                        style={{ color: colorSuccessActive }}
                      />
                    ),
                  }
                : null,
              item.status === "validated" || item.status === "rejected"
                ? {
                    key: "pending",
                    label: "Marquer en attente",
                    icon: (
                      <HourglassOutlined
                        style={{ color: colorWarningActive }}
                      />
                    ),
                  }
                : null,
              item.status === "pending" || item.status === "validated"
                ? {
                    key: "reject",
                    label: "Rejeter",
                    icon: <CloseOutlined />,
                    danger: true,
                  }
                : null,
            ],
            onClick: ({ key }) => {
              if (key === "pending") {
                setOpenPending(true);
              } else if (key === "reject") {
                setOpenReject(true);
              } else if (key === "validate") {
                setOpenValidate(true);
              } else if (key === "exempt") {
                setOpenExempt(true);
              }
            },
          }}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      </Space>
    </>
  );
};

type ListCourseStudentsValidatedProps = {
  courseEnrollments?: CourseEnrollment[];
  course?: TaughtCourse;
  periodEnrollments?: PeriodEnrollment[];
  departments?: Department[];
  classes?: Class[]; // Promotions
  isPending: boolean;
};

export const ListCourseValidatedStudents: FC<
  ListCourseStudentsValidatedProps
> = ({
  courseEnrollments,
  course,
  periodEnrollments,
  classes,
  departments,
  isPending,
}) => {
  const [search, setSearch] = useQueryState("search");
  const [searchResults, setSearchResults] = useState<CourseEnrollment[]>();

  return (
    <Table
      bordered
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Inscriptions validées
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Input.Search
              variant="filled"
              placeholder="Rechercher ..."
              onChange={(e) => {
                e.preventDefault();

                const results = getCourseEnrollmentsByStatus(
                  courseEnrollments,
                  "validated"
                )?.filter(
                  (course) =>
                    course.student.year_enrollment.user.matricule
                      ?.toLowerCase()
                      .includes(e.target.value) ||
                    course.student.year_enrollment.user.first_name
                      ?.toLowerCase()
                      .includes(e.target.value) ||
                    course.student.year_enrollment.user.last_name
                      ?.toLowerCase()
                      .includes(e.target.value) ||
                    course.student.year_enrollment.user.surname
                      ?.toLowerCase()
                      .includes(e.target.value)
                );
                setSearch(e.target.value);
                setSearchResults(results);
              }}
              value={search!}
            />
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
                    label: "Exporter .pdf",
                    icon: <FilePdfOutlined />,
                    title: "Exporter en PDF",
                  },
                  {
                    key: "excel",
                    label: "Exporter .xlsx",
                    icon: <FileExcelOutlined />,
                    title: "Exporter vers Excel",
                  },
                ],
              }}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ boxShadow: "none" }}
              />
            </Dropdown>
          </Space>
        </header>
      )}
      dataSource={
        searchResults
          ? searchResults
          : getCourseEnrollmentsByStatus(courseEnrollments, "validated")
      }
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record, __) => (
            <Avatar
              src={record.student.year_enrollment.user.avatar || null}
              style={{
                backgroundColor: getHSLColor(
                  `${record.student.year_enrollment.user.surname} ${record.student.year_enrollment.user.last_name} ${record.student.year_enrollment.user.first_name}`
                ),
              }}
            >
              {record.student.year_enrollment.user.first_name
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
            record.student.year_enrollment.user.matricule,
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "available_course",
          key: "available_course",
          render: (_, record) => (
            <>
              {record.student.year_enrollment.user.surname}{" "}
              {record.student.year_enrollment.user.last_name}{" "}
              {record.student.year_enrollment.user.first_name}
            </>
          ),
          ellipsis: true,
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
              ? new Intl.DateTimeFormat("fr", { dateStyle: "short" }).format(
                  new Date(`${record.date}`)
                )
              : "",
          width: 120,
          ellipsis: true,
        },
        {
          key: "exempted_on_attendance",
          title: "Exempté(e)",
          dataIndex: "exempted_on_attendance",
          render: (_, record, __) =>
            record.exempted_on_attendance ? (
              <Tag
                color="success"
                bordered={false}
                style={{ marginRight: 0, width: "100%" }}
              >
                Oui
              </Tag>
            ) : (
              <Tag bordered={false} style={{ marginRight: 0, width: "100%" }}>
                Non
              </Tag>
            ),
          width: 92,
        },
        {
          title: "",
          key: "actions",
          render: (_, record, __) => <ActionsBar item={record} />,
          width: 50,
        },
      ]}
      loading={isPending}
      rowKey="id"
      rowClassName={`bg-white odd:bg-[#f5f5f5]`}
      rowSelection={{
        type: "checkbox",
      }}
      scroll={{ y: "calc(100vh - 283px)" }}
      size="small"
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
        showSizeChanger: true,
      }}
    />
  );
};
