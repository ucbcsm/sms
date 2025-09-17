"use client";

import { Avatar, Space, Table, theme, Typography } from "antd";
import { FC } from "react";
import { AttendanceListItem } from "@/types";
import { getHSLColor } from "@/lib/utils";
import { AttendanceController } from "./controller";
import { AttendanceItemFromCourseEnrollment } from "@/lib/api";

type ListAttendanceListItemProps = {
  items?: AttendanceItemFromCourseEnrollment[]; //Omit<AttendanceListItem, "id" & { id?: number; exempted:boolean }>[]
  editRecordStatus?: (
    status: "present" | "absent" | "justified",
    index: number
  ) => void;
};

export const ListAttendanceListItem: FC<ListAttendanceListItemProps> = ({
  items,
  editRecordStatus,
}) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Liste de présence
            </Typography.Title>
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
                backgroundColor: record.exempted
                  ? colorTextDisabled
                  : getHSLColor(
                      `${record.student.user.first_name} ${record.student.user.last_name} ${record.student.user.surname}`
                    ),
              }}
            >
              {record.student.user.first_name?.charAt(0).toUpperCase()}
              {record.student.user.last_name?.charAt(0).toUpperCase()}
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
          render: (_, record, __) => (
            <Typography.Text
              style={{
                color: record.exempted ? colorTextDisabled : "",
              }}
            >
              {record.student.user.matricule.padStart(6, "0")}
            </Typography.Text>
          ),
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "names",
          key: "names",
          render: (_, record) => (
            <Typography.Text
              style={{
                color: record.exempted ? colorTextDisabled : "",
              }}
            >
              {record.student.user.first_name} {record.student.user.last_name}{" "}
              {record.student.user.surname}
            </Typography.Text>
          ),
        },
        {
          title: "Status",
          key: "actions",
          render: (_, record, index) => (
            <AttendanceController
              record={record}
              index={index}
              editRecordStatus={editRecordStatus!}
            />
          ),
        },
      ]}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      scroll={{ y: "calc(100vh - 254px)" }}
      size="small"
      pagination={false}
    />
  );
};
