"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Form, message, Modal } from "antd";
import { Class } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClass } from "@/utils";

type FormDataType = Omit<Class, "id">;

interface EditClassFormProps {
  classe: Class;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditClassForm: React.FC<EditClassFormProps> = ({
  classe,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateClass,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: classe.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["classes"] });
          messageApi.success("Promotion modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la promotion"
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
        title="Modifier la promotion"
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
            key="edit_class_form"
            layout="vertical"
            form={form}
            name="edit_field_form"
            initialValues={classe}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      ></Modal>
    </>
  );
};
