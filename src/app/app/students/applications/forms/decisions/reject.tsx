"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, message, Modal, Checkbox } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectEditedApplication } from "@/lib/api";
import { Application, ApplicationEditFormDataType } from "@/types";

type FormDataType = {
  rejected: boolean;
};

type RejectApplicationFormProps = {
  applicationId:number;
  EditedApplication?: ApplicationEditFormDataType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const RejectApplicationForm: FC<RejectApplicationFormProps> = ({
  applicationId,
  EditedApplication,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: rejectEditedApplication,
  });

  const onFinish = (values: FormDataType) => {

    if (!EditedApplication) return;

    if (!values.rejected) {
      messageApi.error("Vous devez confirmer le rejet de l'inscription.");
      return;
    }
   
      mutateAsync(
        { id:applicationId,params:{...EditedApplication} },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
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
                (error as any).response.data.message ||
                  "Une erreur s'est produite lors du rejet de l'inscription."
              );
            }
          }
        }
      );
  };

  if (!EditedApplication) return null;

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Rejet de l'inscription"
        centered
        okText="Rejeter"
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
        onCancel={() => setOpen(false)}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="reject_application_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ rejected: false }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={`Êtes-vous sûr de vouloir rejeter l'inscription "${EditedApplication.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="rejected"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Vous devez cocher la case pour confirmer le rejet."
                      )
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>Je confirme le rejet de cette inscription.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
