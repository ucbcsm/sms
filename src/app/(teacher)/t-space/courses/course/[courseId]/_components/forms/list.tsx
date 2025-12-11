"use client";

import { Avatar, Flex, List, theme, Typography } from "antd";
import { FC } from "react";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import { AttendanceController } from "./controller";
import { AttendanceItemFromCourseEnrollment } from "@/lib/api";

type ListItemProps = {
  item: AttendanceItemFromCourseEnrollment;
  index: number;
  editRecordStatus?: (
    status: "present" | "absent" | "justified",
    index: number
  ) => void;
};

const ListItem: FC<ListItemProps> = ({ item, index, editRecordStatus }) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();
  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <Avatar
            src={getPublicR2Url(item.student.user.avatar)}
            style={{
              backgroundColor: item.exempted
                ? colorTextDisabled
                : getHSLColor(
                    `${item.student.user.surname} ${item.student.user.last_name} ${item.student.user.first_name}`
                  ),
            }}
          >
            {item.student.user.first_name?.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography.Text
            style={{
              color: item.exempted ? colorTextDisabled : "",
            }}
          >
            {item.student.user.surname} {item.student.user.last_name}{" "}
            {item.student.user.first_name}
          </Typography.Text>
        }
        description={
          <Flex justify="space-between" align="center">
            <Typography.Text type="secondary" disabled={item.exempted}>
              Matr. {item.student.user.matricule}
            </Typography.Text>
            <AttendanceController
              record={item}
              index={index}
              editRecordStatus={editRecordStatus!}
            />
          </Flex>
        }
      />
    </List.Item>
  );
};

type ListAttendanceProps = {
  items?: AttendanceItemFromCourseEnrollment[];
  editRecordStatus?: (
    status: "present" | "absent" | "justified",
    index: number
  ) => void;
};

export const ListAttendance: FC<ListAttendanceProps> = ({
  items,
  editRecordStatus,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <List
      header={
        <Flex justify="space-between">
          <Typography.Text strong>Étudiant</Typography.Text>
          <Typography.Text strong>Statut</Typography.Text>
        </Flex>
      }
      dataSource={items}
      bordered
      size="small"
      style={{background:colorBgContainer}}
      renderItem={(item, index) => (
        <ListItem
          key={index}
          index={index}
          item={item}
          editRecordStatus={editRecordStatus}
        />
      )}
      // columns={[
      //   {
      //     title: "Photo",
      //     dataIndex: "avatar",
      //     key: "avatar",
      //     render: (_, record, __) => (
      //       <Avatar
      //         style={{
      //           backgroundColor: getHSLColor(
      //             `${record.student.year_enrollment.user.first_name} ${record.student.year_enrollment.user.last_name} ${record.student.year_enrollment.user.surname}`
      //           ),
      //         }}
      //       >
      //         {record.student.year_enrollment.user.first_name
      //           ?.charAt(0)
      //           .toUpperCase()}
      //         {record.student.year_enrollment.user.last_name
      //           ?.charAt(0)
      //           .toUpperCase()}
      //       </Avatar>
      //     ),
      //     width: 58,
      //     align: "center",
      //   },
      //   {
      //     title: "Matricule",
      //     dataIndex: "matricule",
      //     key: "matricule",
      //     width: 92,
      //     render: (_, record, __) =>
      //       record.student.year_enrollment.user.matricule.padStart(6, "0"),
      //     align: "center",
      //   },
      //   {
      //     title: "Noms",
      //     dataIndex: "available_course",
      //     key: "available_course",
      //     render: (_, record) => (
      //       <>
      //         {record.student.year_enrollment.user.first_name}{" "}
      //         {record.student.year_enrollment.user.last_name}{" "}
      //         {record.student.year_enrollment.user.surname}
      //       </>
      //     ),
      //   },
      //   {
      //     title: "Status",
      //     key: "actions",
      //     render: (_, record, index) => (
      //       <AttendanceController
      //         record={record}
      //         index={index}
      //         editRecordStatus={editRecordStatus!}
      //       />
      //     ),
      //   },
      // ]}
      // rowKey="id"
      // rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      // size="small"
      pagination={false}
    />
  );
};
