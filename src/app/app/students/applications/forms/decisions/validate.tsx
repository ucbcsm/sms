"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal, Checkbox } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplication } from "@/lib/api"; // <-- Remplacer par la fonction d'API de validation
import { Application } from "@/lib/types";

type FormDataType = {
  confirmation: string;
  validated: boolean;
};

type ValidateStudentRegistrationFormProps = {
  application: Application;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ValidateApplicationForm: FC<
  ValidateStudentRegistrationFormProps
> = ({ application, open, setOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateApplication, // <-- Fonction pour valider l'inscription
  });

  const onFinish = (values: FormDataType) => {
    if (!values.validated) {
      messageApi.error(
        "Vous devez cocher la case pour confirmer la validation."
      );
      return;
    }
    if (values.confirmation.trim() === "Je confirme") {
      // mutateAsync({id:application.id,params:{...application}}, {
      //     onSuccess: () => {
      //         queryClient.invalidateQueries({ queryKey: ["applications"] });
      //         messageApi.success("Inscription validée avec succès !");
      //         setOpen(false);
      //     },
      //     onError: () => {
      //         messageApi.error(
      //             "Une erreur s'est produite lors de la validation de l'inscription."
      //         );
      //     },
      // });
    } else {
      messageApi.error(
        'Vous devez écrire exactement "Je confirme" pour valider.'
      );
    }
  };

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
        destroyOnClose
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
          description={`Êtes-vous sûr de vouloir valider l'inscription de "${application.name}" en ${application.class_year.acronym} ${application.departement.name} ?`}
          type="info"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="confirmation"
          label='Veuillez saisir "Je confirme" pour valider l’inscription.'
          rules={[
            { required: true, message: 'Veuillez saisir "Je confirme".' },
          ]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder="Je confirme" />
        </Form.Item>
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
