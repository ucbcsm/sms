"use client";
import { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, message, Modal, Checkbox, Descriptions, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  validateEditedApplication,
} from "@/lib/api";
import {
  ApplicationEditFormDataType,
} from "@/types";
import { getEnrollmentFeesStatusName } from "@/lib/utils";
import { BulbOutlined } from "@ant-design/icons";

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
        styles={{ body: { paddingTop: 16 } }}
      >
        <Alert
          description="Rassurez vous avoir vérifié attentivement toutes les informations de la candidature avant de procéder à sa validation."
          type="info"
          showIcon
          icon={<BulbOutlined />}
          style={{ border: 0, marginBottom: 16 }}
        />
        <Descriptions
          title="Synthèse"
          bordered
          size="small"
          column={1}
          items={[
            {
              key: "test",
              label: "Resultat de test d'admission",
              children: [],
            },
            {
              key: "fees",
              label: "Frais d'inscription",
              children: getEnrollmentFeesStatusName(
                editedApplication.enrollment_fees || ""
              ),
            },
            {
              key: "diploma",
              label: "% examen d'état",
              children: `${editedApplication.diploma_percentage}%`,
            },
          ]}
          style={{ marginBottom: 20 }}
        />
        <Alert
          description={
            <div>
              Êtes-vous sûr de vouloir valider l&apos;inscription de{" "}
              <Typography.Text strong>
                {editedApplication.surname} {editedApplication.last_name}{" "}
                {editedApplication.first_name}
              </Typography.Text>{" "}
              tenant compte des informations qu&apos;il a fourni et de votre
              devoir de vérification?
            </div>
          }
          type="warning"
          showIcon
          style={{ border: 0, marginBottom: 24 }}
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
