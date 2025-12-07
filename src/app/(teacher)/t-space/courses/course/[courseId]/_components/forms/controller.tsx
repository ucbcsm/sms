"use client";

import { AttendanceItemFromCourseEnrollment } from "@/lib/api";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import { Alert, Button, Popover, Space, Tag, theme } from "antd";
import { FC } from "react";

type AttendanceControllerProps = {
  record: AttendanceItemFromCourseEnrollment;
  index: number;
  editRecordStatus: (
    status: "present" | "absent" | "justified",
    index: number
  ) => void;
};

export const AttendanceController: FC<AttendanceControllerProps> = ({
  record,
  editRecordStatus,
  index,
}) => {
  const {
    token: { colorTextDisabled, colorSuccess, colorError },
  } = theme.useToken();
  return (
    <Space size={0}>
      <Tag
        icon={<CheckCircleOutlined />}
        color={
          record.status === "present"
            ? record.exempted
              ? "default"
              : "success"
            : "default"
        }
        onClick={() => editRecordStatus("present", index)}
        bordered={false}
        style={{
          cursor: "pointer",

          color:
            record.status !== "present" || record.exempted
              ? colorTextDisabled
              : colorSuccess,
          background: record.status !== "present" ? "transparent" : "",
        }}
      />
      <Tag
        icon={<CloseCircleOutlined />}
        color={
          record.status === "absent"
            ? record.exempted
              ? "default"
              : "error"
            : "default"
        }
        onClick={() => !record.exempted && editRecordStatus("absent", index)}
        bordered={false}
        style={{
          cursor: "pointer",

          marginRight: 0,
          color: record.status !== "absent" ? colorTextDisabled : colorError,
          background: record.status !== "absent" ? "transparent" : "",
        }}
      />
      {record.exempted && (
        <Popover
          content={
            <Alert
              type="info"
              showIcon
              description="L'étudiant est exempté de toute présence pour ce cours. Son statut ne peut pas être modifié."
              style={{ border: 0, maxWidth: 400 }}
            />
          }
          title="Exempté de présence"
        >
          <Button type="text">
            <InfoCircleTwoTone />
          </Button>
        </Popover>
      )}
    </Space>
  );
};
