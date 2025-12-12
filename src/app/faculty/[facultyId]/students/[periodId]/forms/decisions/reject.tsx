"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PeriodEnrollment } from "@/types";
import { updateSinglePeriodEnrollment } from "@/lib/api";

type RejectSinglePeriodEnrollmentFormProps = {
  enrollment: PeriodEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const RejectSinglePeriodEnrollmentForm: FC<
  RejectSinglePeriodEnrollmentFormProps
> = ({ enrollment, open, setOpen }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateSinglePeriodEnrollment,
  });

  const onFinish = () => {
    if (enrollment) {
      mutateAsync(
        {
          id: enrollment.id,
          year_enrollment_id: enrollment.year_enrollment.id,
          period_id: enrollment.period.id,
          status: "rejected",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["period_enrollments"],
            });
            messageApi.success("Inscription rejetée avec succès !");
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
                  "Une erreur s'est produite lors du rejet de l'inscription."
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
        title="Rejeter l'inscription"
        centered
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
          danger:true
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
              Êtes-vous sûr de vouloir <b>rejeter</b> l&apos;inscription de{" "}
              <b>
                {enrollment.year_enrollment.user.first_name}{" "}
                {enrollment.year_enrollment.user.last_name}{" "}
                {enrollment.year_enrollment.user.surname}
              </b>{" "}
              à la période :{" "}
              <b>
                {enrollment.period.name} ({enrollment.period.acronym})
              </b>
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