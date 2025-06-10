"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import {
  getClassrooms,
  getCoursesByFacultyId,
  getCycles,
  getDepartmentsByFacultyId,
  getFaculties,
  getPeriods,
  getTaughtCoursesByFacultyId,
  getTeachersByFaculty,
  getTeachingUnitsByfaculty,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import {
  Classroom,
  Course,
  Department,
  Faculty,
  Period,
  TaughtCourse,
  Teacher,
  TeachingUnit,
} from "@/types";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewTaughtCourseForm } from "./forms/new";
import { DeleteTaughtCourseForm } from "./forms/delete";
import { EditTaughtCourseForm } from "./forms/edit";
import { useRouter } from "next/navigation";
import { ListTeachingUnits } from "../courses/teaching-units/list";

type ActionsBarProps = {
  record: TaughtCourse;
  taughtCourse: TaughtCourse | null;
  departments?: Department[];
  faculties?: Faculty[];
  courses?: Course[];
  teachers?: Teacher[];
  periods?: Period[];
  teachingUnits?: TeachingUnit[];
  classrooms?: Classroom[];
};

const ActionsBar: FC<ActionsBarProps> = ({
  record,
  faculties,
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
        faculties={faculties}
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
      <Button
        // type="dashed"
        color="primary"
        variant="dashed"
        style={{ boxShadow: "none" }}
        onClick={() => router.push(`/app/taught-course/${record.id}`)}
      >
        Gérer
      </Button>
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Modifier",
              icon: <EditOutlined />,
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
  const { yid } = useYid();
  const { facultyId } = useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["taught_courses", `${yid}`, facultyId],
    queryFn: ({ queryKey }) =>
      getTaughtCoursesByFacultyId(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });

  const { data: courses } = useQuery({
    queryKey: ["courses", facultyId],
    queryFn: ({ queryKey }) => getCoursesByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers", facultyId],
    queryFn: ({ queryKey }) => getTeachersByFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
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

    const { data: cycles } = useQuery({
          queryKey: ["cycles"],
          queryFn: getCycles,
        });
    

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={18}>
        <Table
          title={() => (
            <header className="flex pb-3">
              <Space>
               <Typography.Title level={3}>Cours planifiés</Typography.Title>
              </Space>
              <div className="flex-1" />
              <Space>
                 <Input.Search placeholder="Rechercher un cours dans le catalogue ..." />
                <NewTaughtCourseForm
                  faculties={faculties}
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
          dataSource={data}
          columns={[
            {
              title: "Titre du cours",
              dataIndex: "title",
              key: "title",
              render: (_, record, __) => record?.available_course?.name,
            },
            {
              title: "Code",
              dataIndex: "code",
              key: "code",
              render: (_, record, __) => record?.available_course?.code,
              width: 100,
            },
            {
              title: "UE",
              dataIndex: "teaching_unit",
              key: "teaching_unit",
              width: 50,
              render: (_, record, __) => record?.teaching_unit?.code,
              ellipsis: true,
            },
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
            {
              title: "Date de début",
              dataIndex: "start_date",
              key: "start_date",
              render: (_, record, __) =>
                record.start_date
                  ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                      new Date(`${record.start_date}`)
                    )
                  : "",
              width: 100,
              ellipsis: true,
            },
            {
              title: "Date de fin",
              dataIndex: "end_date",
              key: "end_date",
              render: (_, record, __) =>
                record?.end_date
                  ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                      new Date(`${record.end_date}`)
                    )
                  : "",
              width: 100,
              ellipsis: true,
            },
            {
              title: "Max",
              dataIndex: "max_value",
              key: "max_value",
              render: (_, record, __) => record.max_value,
              width: 44,
              ellipsis: true,
              align: "center",
            },
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
              render: (_, record, __) => (
                <Space>
                  {record.teacher && (
                    <Avatar
                      style={{
                        backgroundColor: getHSLColor(
                          `${record.teacher?.user.first_name} ${record.teacher?.user.last_name} ${record.teacher?.user.surname}`
                        ),
                      }}
                    >
                      {record.teacher?.user.first_name?.charAt(0).toUpperCase()}
                      {record.teacher?.user.last_name?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}{" "}
                  {record.teacher?.user.surname}
                </Space>
              ),
              ellipsis: true,
            },
            {
              key: "department",
              dataIndex: "departement",
              title: "Département",
              render: (_, record) => record.departement.name,
              ellipsis: true,
            },
            {
              title: "Statut",
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
                    faculties={faculties}
                    departments={departments}
                    courses={courses}
                    periods={periods}
                    teachers={teachers}
                    teachingUnits={teachingUnits}
                    classrooms={classrooms}
                  />
                );
              },
              width: 120,
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
      </Col>
      <Col span={6}>
       <ListTeachingUnits cycles={cycles} departments={departments}/>
      </Col>
    </Row>
  );
}
