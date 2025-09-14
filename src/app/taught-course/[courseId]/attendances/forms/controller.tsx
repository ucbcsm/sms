"use client";

import { AttendanceListItem } from "@/types";
import { Radio, Space } from "antd";
import { FC } from "react";

type AttendanceControllerProps = {
  record: Omit<AttendanceListItem, "id" & { id?: number,  }>;
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
        // disabled={record.exempted_on_attendance}
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
    </Space>
  );
};
