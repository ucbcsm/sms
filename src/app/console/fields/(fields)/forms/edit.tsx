"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Form, message, Modal } from "antd";
import { Field } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateField } from "@/utils";

type FormDataType = Omit<Field, "id">;

interface EditFieldFormProps {
  field: Field;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditFieldForm: React.FC<EditFieldFormProps> = ({
  field,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateField,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: field.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["fields"] });
          messageApi.success("Domaine modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du domaine"
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Modifier le domaine"
        centered
        okText="Mettre à jour"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_field_form"
            layout="vertical"
            form={form}
            name="edit_field_form"
            initialValues={field}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      ></Modal>
    </>
  );
};
