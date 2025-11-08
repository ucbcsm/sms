"use client";

import { deleteCourseEnrollment } from "@/lib/api";
import { CourseEnrollment } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, App, Form, Input, Modal } from "antd";
import { Dispatch, FC, SetStateAction } from "react";

type FormDataType = {
  validate: string;
};

type DeleteSingleCourseEnrollmentFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  enrollment: CourseEnrollment;
};

export const DeleteSingleCourseEnrollmentForm: FC<
  DeleteSingleCourseEnrollmentFormProps
> = ({ open, setOpen, enrollment }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteCourseEnrollment,
  });
  const onFinish = (values: FormDataType) => {
    if (values.validate === "DELETE") {
      mutateAsync(enrollment.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applications"] });
          message.success("Candidature supprimée avec succès !");
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
              (error as any).response.data.message ||
                "Une erreur s'est produite lors de la suppression de l'inscription."
            );
          }
        },
      });
    } else {
      message.error(
        'Le texte de confirmation est incorrect. Veuillez taper "DELETE" pour confirmer.'
      );
    }
  };
  return (
    <Modal
      open={open}
      title="Suppression de l'inscription au cours"
      centered
      okText="Supprimer"
      cancelText="Annuler"
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
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      destroyOnHidden
      closable={{ disabled: isPending }}
      maskClosable={!isPending}
      modalRender={(dom) => (
        <Form
          form={form}
          layout="vertical"
          name="delete_application_form"
          onFinish={onFinish}
          disabled={isPending}
          initialValues={{ enabled: true }}
        >
          {dom}
        </Form>
      )}
    >
      <Alert
        message="Attention"
        description={`Êtes-vous sûr de vouloir supprimer l'inscription de l'étudiant ${enrollment.student.year_enrollment.user.surname} ${enrollment.student.year_enrollment.user.last_name} ${enrollment.student.year_enrollment.user.first_name} au cours ${enrollment.course.available_course.name} ? Cette action est irréversible.`}
        type="warning"
        showIcon
        style={{ border: 0 }}
      />
      <Form.Item
        name="validate"
        label={`Confirmez la suppression en tapant "DELETE" ci-dessous`}
        rules={[{ required: true }]}
        style={{ marginTop: 24 }}
      >
        <Input placeholder="Tapez DELETE pour confirmer" />
      </Form.Item>
    </Modal>
  );
};
