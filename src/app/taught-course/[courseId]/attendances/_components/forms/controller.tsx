"use client";

import { AttendanceItemFromCourseEnrollment } from "@/lib/api";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Alert, Button, Popover, Radio, Space } from "antd";
import { FC } from "react";

type AttendanceControllerProps = {
  record: AttendanceItemFromCourseEnrollment; //Omit<AttendanceListItem, "id"> & { id?: number; exempted:boolean }
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
  return (
    <Space size="middle">
      <Radio.Group
        disabled={record.exempted}
        options={[
          { value: "present", label: "Présent" },
          { value: "absent", label: "Absent" },
          // { value: "justified", label: "Justifié" },
        ]}
        onChange={(e) => {
          editRecordStatus(e.target.value, index);
        }}
        defaultValue={record.status}
        value={record.status}
        optionType="button"
        buttonStyle="solid"
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
