"use client";

import { Avatar, Button, Space, Table, Typography } from "antd";
import { FC } from "react";
// import { CourseInProgramActionsBar } from "./action-bar";
import { AttendanceListItem } from "@/types";
import { getHSLColor } from "@/lib/utils";
import { PlusCircleOutlined } from "@ant-design/icons";

type ListAttendanceListItemProps = {
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[];
};

export const ListAttendanceListItem: FC<ListAttendanceListItemProps> = ({
  items,
}) => {
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{marginBottom:0}}>Liste de présence</Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Button type="link" icon={<PlusCircleOutlined />}>
              Ajouter
            </Button> */}
          </Space>
        </header>
      )}
      dataSource={items}
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
          title: "Status",
          key: "actions",
          render: (_, record, index) => (
            // <CourseInProgramActionsBar
            //   record={record}
            //   removerCourseRecord={removerCourseRecord}
            //   editCourseRecord={editCourseRecord}
            //   courses={courses}
            //   index={index}
            //   currentsCoursesOfProgram={coursesOfProgram}
            // />
            <></>
          ),
        },
      ]}
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
    />
  );
};
