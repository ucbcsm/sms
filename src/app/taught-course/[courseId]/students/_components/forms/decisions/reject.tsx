"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseEnrollment } from "@/types";
import { updateSingleCourseEnrollment } from "@/lib/api";

type RejectSingleCourseEnrollmentFormProps = {
  enrollment: CourseEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const RejectSingleCourseEnrollmentForm: FC<
  RejectSingleCourseEnrollmentFormProps
> = ({ enrollment, open, setOpen }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateSingleCourseEnrollment,
  });

  const onFinish = () => {
    if (enrollment) {
      mutateAsync(
        {
          id: enrollment.id,
          student_id: enrollment.student.id,
          course_id: enrollment.course.id,
          status: "rejected",
          exempted_on_attendance:enrollment.exempted_on_attendance
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["course_enrollments"],
            });
            messageApi.success("Inscription au cours rejetée avec succès !");
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
              (error as any)?.response?.data?.message ||
                "Une erreur s'est produite lors du rejet de l'inscription au cours."
            );
          }}
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Rejeter l'inscription au cours"
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
          message="Confirmation requise"
          description={
            <p>
              Êtes-vous sûr de vouloir <b>rejeter</b> l&apos;inscription de{" "}
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
          type="error"
          showIcon
        />
      </Modal>
    </>
  );
};