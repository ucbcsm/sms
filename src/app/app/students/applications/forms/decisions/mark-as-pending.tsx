"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Checkbox, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsPendingEditedApplication } from "@/lib/api";
import { Application, ApplicationEditFormDataType } from "@/types";

type FormDataType = {
  pending: boolean;
};

type MarkAsPendingFormProps = {
  applicationId: number;
  editedApplication?: ApplicationEditFormDataType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const MarkAsPendingForm: FC<MarkAsPendingFormProps> = ({
  applicationId,
  editedApplication,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: markAsPendingEditedApplication,
  });

  const onFinish = (values: FormDataType) => {
    if (!editedApplication) return;
    if (!values.pending) {
      messageApi.error("Vous devez confirmer le marquage en attente.");
      return;
    }
    mutateAsync(
      { id: applicationId, params: { ...editedApplication } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applications"] });
          messageApi.success("Inscription marquée comme en attente !");
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
                "Une erreur s'est produite lors du marquage en attente."
            );
          }
        },
      }
    );
  };
  if (!editedApplication) return null;

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Marquer comme en attente"
        centered
        okText="Marquer en attente"
        cancelText="Annuler"
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
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="mark_as_pending_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ pending: false }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={`Êtes-vous sûr de vouloir marquer l'inscription "${editedApplication.name}" comme en attente ?`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="pending"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Vous devez cocher la case pour confirmer le marquage en attente."
                      )
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>
            Je confirme le marquage en attente de cette inscription.
          </Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
