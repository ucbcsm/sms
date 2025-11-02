"use client";
import { DeleteRetakeReasonForm } from "@/app/jury/[juryId]/[facultyId]/courses-to-retake/_components/deleteRetakeReason";
import { EditRetakeReasonForm } from "@/app/jury/[juryId]/[facultyId]/courses-to-retake/_components/editRetakeReasonForm";
import { InvalidateRetakeCourseForm } from "@/app/jury/[juryId]/[facultyId]/courses-to-retake/_components/invalidateRetakeReasonForm";
import { ValidateRetakeCourseForm } from "@/app/jury/[juryId]/[facultyId]/courses-to-retake/_components/validateRetakeReasonForm";
import { Class, Course, RetakeCourseReason } from "@/types";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { FC, useState } from "react";

type RetakeActionBarProps = {
  itemData: RetakeCourseReason;
  staticData: {
    userRetakeId: number;
    facultyId: number;
    departmentId: number;
    userId: number;
    studentName: string;
    matricule: string;
  };
  type?: "not_done" | "done";
  courses?: Course[];
  classes?: Class[];
  currentRetakeCourseReason: RetakeCourseReason[];
  currentDoneRetakeCourseReason: RetakeCourseReason[];
};

export const RetakeActionBar: FC<RetakeActionBarProps> = ({
  itemData,
  staticData,
  type = "not_done",
  classes,
  courses,
  currentRetakeCourseReason,
  currentDoneRetakeCourseReason,
}) => {
  const [openToValidate, setOpenToValidate] = useState<boolean>(false);
  const [openToInvalidate, setOpenToInvalidate] = useState<boolean>(false);
  const [openToDelete, setOpenToDelete] = useState<boolean>(false);
  const [openToEdit, setOpenToEdit] = useState<boolean>(false);
  return (
    <>
      <Dropdown
        arrow
        menu={{
          items: [
            type === "not_done"
              ? {
                  key: "validate",
                  label: "Marquer comme repris et acquis",
                  icon: <CheckCircleOutlined />,
                  onClick: () => {
                    setOpenToValidate(true);
                  },
                }
              : null,
            type === "done"
              ? {
                  key: "invalidate",
                  label: "Marquer comme à refaire",
                  icon: <CloseCircleOutlined />,
                  onClick: () => {
                    setOpenToInvalidate(true);
                  },
                }
              : null,
            {
              type: "divider",
            },
            {
              key: "edit",
              label: "Modifier",
              icon: <EditOutlined />,
              onClick: () => {
                setOpenToEdit(true);
              },
            },
            {
              key: "delete",
              label: "Supprimer",
              danger: true,
              icon: <DeleteOutlined />,
              onClick: () => {
                setOpenToDelete(true);
              },
            },
          ],
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
      {type === "not_done" && (
        <ValidateRetakeCourseForm
          course={itemData.available_course}
          open={openToValidate}
          setOpen={setOpenToValidate}
          staticData={{
            userRetakeId: staticData.userRetakeId,
            userId: staticData.userId,
            studentName: staticData.studentName,
            facultyId: staticData.facultyId,
            departmentId: staticData.departmentId,
          }}
        />
      )}
      {type === "done" && (
        <InvalidateRetakeCourseForm
          course={itemData.available_course}
          open={openToInvalidate}
          setOpen={setOpenToInvalidate}
          staticData={{
            userRetakeId: staticData.userRetakeId,
            userId: staticData.userId,
            studentName: staticData.studentName,
            facultyId: staticData.facultyId,
            departmentId: staticData.departmentId,
          }}
        />
      )}
      <EditRetakeReasonForm
        retakeCourseReasonToEdit={itemData}
        staticData={{
          matricule: staticData.matricule,
          studentName: staticData.studentName,
          facultyId: staticData.facultyId,
          departmentId: staticData.departmentId,
        }}
        classes={classes}
        courses={courses}
        open={openToEdit}
        setOpen={setOpenToEdit}
        currentDoneRetakeCourseReason={currentDoneRetakeCourseReason}
        currentRetakeCourseReason={currentRetakeCourseReason}
      />
      <DeleteRetakeReasonForm
        retakeReason={itemData}
        studentName={staticData.studentName}
        open={openToDelete}
        setOpen={setOpenToDelete}
        type={type}
      />
    </>
  );
};
