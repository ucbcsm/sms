"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, App, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PeriodEnrollment } from "@/types";
import { deleteSinglePeriodEnrollment } from "@/lib/api";

type DeleteSinglePeriodEnrollmentFormProps = {
  enrollment: PeriodEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteSinglePeriodEnrollmentForm: FC<
  DeleteSinglePeriodEnrollmentFormProps
> = ({ enrollment, open, setOpen }) => {
  const {message}=App.useApp()
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteSinglePeriodEnrollment,
  });

  const onFinish = () => {
    if (enrollment) {
      mutateAsync(
        enrollment.id,

        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["period_enrollments"],
            });
            message.success("Inscription supprimée avec succès !");
            setOpen(false);
          },
          onError: (error) => {
            if ((error as any).status === 403) {
              message.error(
                `Vous n'avez pas la permission d'effectuer cette action`
              );
            } else if ((error as any).status === 401) {
              message.error(
                "Vous devez être connecté pour effectuer cette action."
              );
            } else {
              message.error(
                (error as any)?.response?.data?.message ||
                  "Une erreur s'est produite lors de la suppression de l'inscription."
              );
            }
          }
        }
      );
    }
  };

  return (
    
      <Modal
        open={open}
        title="Supprimer l'inscription"
        centered
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
          danger: true,
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
              Êtes-vous sûr de vouloir <b>supprimer</b> l&apos;inscription de{" "}
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
  );
};
