"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, message, Modal, Checkbox } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  validateApplication,
  validateEditedApplication,
} from "@/lib/api";
import {
  ApplicationEditFormDataType,
} from "@/types";

type FormDataType = {
  confirmation: string;
  validated: boolean;
};

type ValidateStudentRegistrationFormProps = {
  applicationId:number;
  editedApplication?: ApplicationEditFormDataType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ValidateApplicationForm: FC<
  ValidateStudentRegistrationFormProps
> = ({ applicationId, open, setOpen, editedApplication }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const {
    mutateAsync: mutateAsync,
    isPending: isPending,
  } = useMutation({
    mutationFn: validateEditedApplication,
  });

  const onFinish = (values: FormDataType) => {
    if (!editedApplication) return;
    if (!values.validated) {
      messageApi.error(
        "Vous devez cocher la case pour confirmer la validation."
      );
      return;
    }
     mutateAsync(
          {
           
           id:applicationId,
           params:{...editedApplication}
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["applications"] });
              queryClient.invalidateQueries({ queryKey: ["year_enrollments"] });
              messageApi.success("Inscription validée avec succès !");
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
                  (error as any).response.data.message ||
                    "Une erreur s'est produite lors de la validation de l'inscription."
                );
              }
            }
          }
        );
  };

  if (!editedApplication) return null;

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Validation de l'inscription"
        centered
        okText="Valider"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
          danger: false,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        // destroyOnClose
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="validate_student_registration_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ validated: false }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Confirmation requise"
          description={`Êtes-vous sûr de vouloir valider l'inscription de "${editedApplication.surname} ${editedApplication.last_name} ${editedApplication.first_name}" ?`}
          type="info"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validated"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Vous devez cocher la case pour confirmer la validation."
                      )
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>Je confirme la validation de cette inscription.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
