"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseEnrollment } from "@/types";
import { updateSingleCourseEnrollment } from "@/lib/api";

type ExemptSingleCourseEnrollmentFormProps = {
  enrollment: CourseEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ExemptSingleCourseEnrollmentForm: FC<
  ExemptSingleCourseEnrollmentFormProps
> = ({ enrollment, open, setOpen }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateSingleCourseEnrollment,
  });

  const onFinish = () => {
    if (enrollment) {
      const isCurrentlyExempted = enrollment.exempted_on_attendance;
      mutateAsync(
        {
          id: enrollment.id,
          student_id: enrollment.student.id,
          course_id: enrollment.course.id,
          status: enrollment.status || "validated",
          exempted_on_attendance: !isCurrentlyExempted, // Toggle exemption
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["course_enrollments"],
            });
            messageApi.success(
              isCurrentlyExempted
                ? "L'exemption d'assiduité a été retirée avec succès !"
                : "L'étudiant a été exempté d'assiduité avec succès !"
            );
            setOpen(false);
          },
          onError: (error) => {
            if ((error as any).status === 403) {
              messageApi.error(
                `Vous n'avez pas la permission d'effectuer cette action`
              );
            } else if ((error as any).status === 401) {
              messageApi.error(
                "Vous devez être connecté pour effectuer cette action."
              );
            } else {
              messageApi.error(
                isCurrentlyExempted
                  ? "Une erreur s'est produite lors du retrait de l'exemption d'assiduité."
                  : "Une erreur s'est produite lors de l'exemption d'assiduité."
              );
            }
          }
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={
          enrollment.exempted_on_attendance
            ? "Retirer l'exemption d'assiduité"
            : "Exempter l'étudiant d'assiduité"
        }
        centered
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        onOk={onFinish}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
      >
        <Alert
          title="Confirmation requise"
          description={
            <p>
              Êtes-vous sûr de vouloir{" "}
              <b>
                {enrollment.exempted_on_attendance
                  ? "retirer l'exemption d'assiduité de"
                  : "exempter l'assiduité de"}
              </b>{" "}
              <b>
                {enrollment.student.year_enrollment.user.first_name}{" "}
                {enrollment.student.year_enrollment.user.last_name}{" "}
                {enrollment.student.year_enrollment.user.surname}
              </b>{" "}
              au cours :{" "}
              <b>
                {enrollment.course.available_course.name} (
                {enrollment.course.available_course.code})
              </b>{" "}
              ?
            </p>
          }
          type={enrollment.exempted_on_attendance ? "warning" : "success"}
          showIcon
        />
      </Modal>
    </>
  );
};
