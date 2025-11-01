"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import {
  getAllCourses,
  getAllTeachers,
  getClassrooms,
  getCurrentDepartmentsAsOptions,
  getCurrentPeriodsAsOptions,
  getDepartmentsByFacultyId,
  getPeriods,
  getTaughtCourses,
  getTeachingUnitsByfaculty,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import {
  Classroom,
  Course,
  Department,
  Period,
  TaughtCourse,
  Teacher,
  TeachingUnit,
} from "@/types";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewTaughtCourseForm } from "./forms/new";
import { DeleteTaughtCourseForm } from "./forms/delete";
import { EditTaughtCourseForm } from "./forms/edit";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import Link from "next/link";

type ActionsBarProps = {
  record: TaughtCourse;
  taughtCourse: TaughtCourse | null;
  departments?: Department[];
  courses?: Course[];
  teachers?: Teacher[];
  periods?: Period[];
  teachingUnits?: TeachingUnit[];
  classrooms?: Classroom[];
};

const ActionsBar: FC<ActionsBarProps> = ({
  record,
  departments,
  periods,
  teachers,
  teachingUnits,
  courses,
  classrooms,
}) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Space size="middle">
      <EditTaughtCourseForm
        taughtCourse={record}
        // faculties={faculties}
        departments={departments}
        periods={periods}
        teachers={teachers}
        courses={courses}
        teachingUnits={teachingUnits}
        classrooms={classrooms}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteTaughtCourseForm
        taughtCourse={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <Link href={`/taught-course/${record.id}`}>
        <Button
          // type="dashed"
          color="primary"
          variant="dashed"
          style={{ boxShadow: "none" }}
          // onClick={() => router.push(`/taught-course/${record.id}`)}
        >
          Gérer
        </Button>
      </Link>
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Modifier",
              icon: <EditOutlined />,
            },
            {
              type: "divider",
            },
            {
              key: "view",
              label: "Voir le cours",
              onClick: () => router.push(`/taught-course/${record.id}`),
              icon: <EyeOutlined />,
            },
            {
              key: "students",
              label: "Étudiants inscrits",
              onClick: () =>
                router.push(`/taught-course/${record.id}/students`),
              icon: <TeamOutlined />,
            },
            {
              key: "attendances",
              label: "Listes de présences",
              onClick: () =>
                router.push(`/taught-course/${record.id}/attendances`),
              icon: <CheckCircleOutlined />,
            },
            {
              key: "hours_tracking",
              label: "Suivi des heures",
              onClick: () =>
                router.push(`/taught-course/${record.id}/hours-tracking`),
              icon: <ClockCircleOutlined />,
            },
            {
              type: "divider",
            },
            {
              key: "delete",
              label: "Supprimer",
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: ({ key }) => {
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { yid } = useYid();
  const { facultyId } = useParams();
  const [departmentId, setDepartmentId] = useQueryState(
    "dep",
    parseAsInteger.withDefault(0)
  );
  const [periodId, setPeriodId] = useQueryState(
    "p",
    parseAsInteger.withDefault(0)
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(0)
  );
  const [search, setSearch] = useQueryState("search");

  const {
    data: taughtCourses,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      "taught_courses",
      `${yid}`,
      facultyId,
      departmentId,
      periodId,
      page,
      pageSize,
      search,
    ],
    queryFn: ({ queryKey }) =>
      getTaughtCourses({
        yearId: Number(queryKey[1]),
        facultyId: Number(queryKey[2]),
        departmentId: departmentId !== 0 ? departmentId : undefined,
        periodId: periodId !== 0 ? periodId : undefined,
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
        search: search !== null && search?.trim() !== "" ? search : undefined,
      }),
    enabled: !!yid && !!facultyId,
  });

  const { data: courses } = useQuery({
    queryKey: ["courses", facultyId, "all"],
    queryFn: ({ queryKey }) =>
      getAllCourses({ facultyId: Number(queryKey[1]) }),
    enabled: !!facultyId,
  });


  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers", facultyId],
    queryFn: getAllTeachers,
    enabled: !!facultyId,
  });

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });

  const { data: teachingUnits } = useQuery({
    queryKey: ["teaching-units", facultyId],
    queryFn: ({ queryKey }) => getTeachingUnitsByfaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
  });

  // if (isPending) {
  //   return <DataFetchPendingSkeleton variant="table" />;
  // }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Cours planifiés
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          
        </Layout.Header>
        {/* <Row gutter={[24, 24]}>
          <Col span={18}> */}
        {/* <Card> */}
        <Table
          title={() => (
            <header className="flex pb-3">
              <Space>
                <Input.Search
                  placeholder="Rechercher un cours dans le catalogue ..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  allowClear
                  variant="filled"
                />
              </Space>
              <div className="flex-1" />
              <Space>
                <Select
                  value={departmentId}
                  onChange={(value) => {
                    setDepartmentId(value);
                  }}
                  options={[
                    { value: 0, label: "Toutes les mentions" },
                    ...(getCurrentDepartmentsAsOptions(departments) || []),
                  ]}
                  variant="filled"
                />
                <Select
                  value={periodId}
                  onChange={(value) => {
                    setPeriodId(value);
                  }}
                  options={[
                    { value: 0, label: "Toutes les périodes" },
                    ...(getCurrentPeriodsAsOptions(periods) || []),
                  ]}
                  variant="filled"
                />
                <NewTaughtCourseForm
                  facultyId={Number(facultyId)}
                  teachingUnits={teachingUnits}
                  periods={periods}
                  courses={courses}
                  departments={departments}
                  teachers={teachers}
                  classrooms={classrooms}
                />
                {/* <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ boxShadow: "none" }}
            >
              Ajouter
            </Button> */}
                <Button
                  icon={<PrinterOutlined />}
                  style={{ boxShadow: "none" }}
                >
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
          dataSource={taughtCourses?.results}
          loading={isPending}
          columns={[
            {
              title: "Titre du cours",
              dataIndex: "title",
              key: "title",
              render: (_, record, __) => record?.available_course?.name,
              ellipsis: true,
            },
            {
              title: "Code",
              dataIndex: "code",
              key: "code",
              render: (_, record, __) => record?.available_course?.code,
              width: 100,
            },
            // {
            //   title: "UE",
            //   dataIndex: "teaching_unit",
            //   key: "teaching_unit",
            //   width: 50,
            //   render: (_, record, __) => record?.teaching_unit?.code,
            //   ellipsis: true,
            // },
            {
              title: "Crédits",
              dataIndex: "credits",
              key: "credits",
              align: "center",
              width: 68,
              render: (_, record, __) => record.credit_count,
            },
            {
              title: "Heures",
              key: "hours",
              dataIndex: "hours",
              render: (_, record, __) =>
                `${
                  Number(record.theoretical_hours) +
                  Number(record.practical_hours)
                }`,
              width: 64,
            },
            // {
            //   title: "Heures théorique",
            //   dataIndex: "theoretical_hours",
            //   key: "theoretical_hours",
            //   //   width: 68,
            //   render: (_, record, __) => record.theoretical_hours,
            //   ellipsis: true,
            // },
            // {
            //   title: "Heures pratique",
            //   dataIndex: "practical_hours",
            //   key: "practical_hours",
            //   //   width: 68,
            //   render: (_, record, __) => record.practical_hours,
            //   ellipsis: true,
            // },
            // {
            //   title: "Date de début",
            //   dataIndex: "start_date",
            //   key: "start_date",
            //   render: (_, record, __) =>
            //     record.start_date
            //       ? new Intl.DateTimeFormat("fr", {
            //           dateStyle: "long",
            //         }).format(new Date(`${record.start_date}`))
            //       : "",
            //   width: 100,
            //   ellipsis: true,
            // },
            // {
            //   title: "Date de fin",
            //   dataIndex: "end_date",
            //   key: "end_date",
            //   render: (_, record, __) =>
            //     record?.end_date
            //       ? new Intl.DateTimeFormat("fr", {
            //           dateStyle: "long",
            //         }).format(new Date(`${record.end_date}`))
            //       : "",
            //   width: 100,
            //   ellipsis: true,
            // },
            // {
            //   title: "Max",
            //   dataIndex: "max_value",
            //   key: "max_value",
            //   render: (_, record, __) => record.max_value,
            //   width: 44,
            //   ellipsis: true,
            //   align: "center",
            // },
            {
              title: "Période",
              dataIndex: "period",
              key: "period",
              render: (_, record, __) => record.period?.acronym,
              width: 64,
              ellipsis: true,
            },
            {
              title: "Enseignant",
              dataIndex: "teacher",
              key: "teacher",
              render: (_, record, __) =>
                `
                  ${record.teacher?.user.surname} ${record.teacher?.user.last_name}
               `,
              ellipsis: true,
            },
            {
              key: "department",
              dataIndex: "departement",
              title: "Départements",
              render: (_, record) =>
                record.departements.map((dep) => dep.acronym).join(", "),
              ellipsis: true,
            },
            {
              title: "Inscription",
              dataIndex: "status",
              key: "status",
              render: (_, record, __) => (
                <Tag
                  color={getYearStatusColor(`${record.status}`)}
                  style={{ border: 0 }}
                >
                  {getYearStatusName(`${record.status}`)}
                </Tag>
              ),
              width: 100,
              ellipsis: true,
            },
            {
              title: "",
              key: "actions",
              render: (_, record, __) => {
                return (
                  <ActionsBar
                    record={record}
                    taughtCourse={record}
                    departments={departments}
                    courses={courses}
                    periods={periods}
                    teachers={teachers}
                    teachingUnits={teachingUnits}
                    classrooms={classrooms}
                  />
                );
              },
              width: 128,
            },
          ]}
          rowKey="id"
          rowClassName={`bg-white odd:bg-[#f5f5f5]`}
          rowSelection={{
            type: "checkbox",
          }}
          scroll={{ y: "calc(100vh - 329px)" }}
          size="small"
          pagination={{
            defaultPageSize: 25,
            showSizeChanger: true,
            pageSizeOptions: [25, 50, 75, 100],
            size: "small",
            current: pageSize !== 0 ? page : 1,
            pageSize: pageSize !== 0 ? pageSize : 25,
            total: taughtCourses?.count,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Layout.Content>
    </Layout>
  );
}
