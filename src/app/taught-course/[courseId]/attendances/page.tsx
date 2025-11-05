"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import {
  getAttendanceAbsentCount,
  getAttendancePresentCount,
  getAttendancesListByCourse,
  getCourseEnrollments,
  getCourseEnrollmentsByStatus,
  getTaughtCours,
} from "@/lib/api";
import { AttendanceList, CourseEnrollment, TaughtCourse } from "@/types";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Dropdown,
  Layout,
  Space,
  Table,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { DeleteAttendanceListForm } from "./_components/forms/delete";
import { NewAttendanceListForm } from "./_components/forms/new";
import { EditAttendanceListForm } from "./_components/forms/edit";
import { useYid } from "@/hooks/use-yid";
import { AttendanceCourseReport } from "./_components/attendance-course-report";

type ActionsBarProps = {
  record: AttendanceList;
  course?: TaughtCourse;
  enrollments?:CourseEnrollment[]
};

const ActionsBar: FC<ActionsBarProps> = ({ record, course, enrollments }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditAttendanceListForm
        attendanceList={record}
        course={course}
        open={openEdit}
        setOpen={setOpenEdit}
        courseEnrollements={enrollments}
      />
      <DeleteAttendanceListForm
        attendanceList={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <Button
        color="primary"
        variant="dashed"
        style={{ boxShadow: "none" }}
        onClick={() => setOpenEdit(true)}
      >
        Gérer la liste
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
  const { courseId } = useParams();
  const {yid}=useYid()
  const { data, isPending, isError } = useQuery({
    queryKey: ["attendances-lists", courseId],
    queryFn: ({ queryKey }) => getAttendancesListByCourse(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: course } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: enrollments, isPending: isPendingEnrollments } = useQuery({
    queryKey: ["course_enrollments", yid, course?.faculty.id, courseId],
    queryFn: ({ queryKey }) =>
      getCourseEnrollments({
        academicYearId: Number(queryKey[1]),
        facultyId: Number(queryKey[2]),
        courseId: Number(queryKey[3]),
      }),
    enabled: !!yid && !!course?.faculty.id && !!courseId,
  });

  // if (isPending) {
  //   return <DataFetchPendingSkeleton variant="table" />;
  // }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Layout.Content style={{ padding: "16px 16px 0 16px" }}>
      <Layout.Header
        style={{
          background: "#f5f5f5",
          padding: 0,
        }}
      >
        <Space>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            Listes des présences
          </Typography.Title>
        </Space>
      </Layout.Header>
      <Table
        bordered
        title={() => (
          <header className="flex pb-3">
            <Space>
              <DatePicker
                variant="filled"
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
              />
            </Space>
            <div className="flex-1" />
            <Space>
              <NewAttendanceListForm
                course={course}
                courseEnrollements={getCourseEnrollmentsByStatus(
                  enrollments,
                  "validated"
                )}
              />
              <AttendanceCourseReport course={course} />
              {/* <Dropdown
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
            </Dropdown> */}
            </Space>
          </header>
        )}
        dataSource={data}
        columns={[
          {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (_, record, __) =>
              record.date
                ? new Intl.DateTimeFormat("fr", { dateStyle: "short" }).format(
                    new Date(`${record.date}`)
                  )
                : "",
            width: 100,
          },
          {
            title: "Heure",
            dataIndex: "time",
            key: "time",
            render: (_, record, __) => record?.time.substring(0, 5),
          },
          {
            title: "Présences",
            dataIndex: "presence_count",
            key: "presence_count",
            render: (_, record, __) =>
              getAttendancePresentCount(record.student_attendance_status),
          },
          {
            title: "Absences",
            dataIndex: "absence_count",
            key: "absence_count",
            render: (_, record, __) =>
              getAttendanceAbsentCount(record.student_attendance_status),
          },
          // {
          //   title: "Justifiées",
          //   dataIndex: "justified_count",
          //   key: "justified_count",
          //   render: (_, record, __) =>
          //     getAttendanceJustifiedCount(record.student_attendance_status),
          // },
          {
            title: "Étudiants",
            dataIndex: "students",
            key: "students",
            render: (_, record, __) => record.student_attendance_status.length,
          },
          {
            title: "Opérateur",
            dataIndex: "operator",
            key: "operator",
            render: (_, record, __) =>
              `${record.verified_by.first_name} ${record.verified_by.last_name} ${record.verified_by.surname}`,
            // <Space>
            //   {record.verified_by && (
            //     <Avatar
            //       style={{
            //         backgroundColor: getHSLColor(
            //           `${record.verified_by.first_name} ${record.verified_by.last_name} ${record.verified_by.surname}`
            //         ),
            //       }}
            //     >
            //       {record.verified_by.first_name?.charAt(0).toUpperCase()}
            //       {record.verified_by.last_name?.charAt(0).toUpperCase()}
            //     </Avatar>
            //   )}{" "}
            //   {record.verified_by.surname}
            // </Space>
            ellipsis: true,
          },
          {
            title: "",
            key: "actions",
            render: (_, record, __) => {
              return (
                <ActionsBar
                  record={record}
                  course={course}
                  enrollments={enrollments}
                />
              );
            },
            width: 174,
          },
        ]}
        rowKey="id"
        rowClassName={`bg-[#f5f5f5] odd:bg-white`}
        rowSelection={{
          type: "checkbox",
        }}
        loading={isPending}
        size="small"
        pagination={{
          defaultPageSize: 25,
          pageSizeOptions: [25, 50, 75, 100],
          size: "small",
        }}
      />
    </Layout.Content>
  );
}
