"use client";

import React, { useState } from "react";
import { Button, Form, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Field } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createField } from "@/utils";

type FormDataType = Omit<Field, "id">;

export const NewFieldForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createField,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["fields"] });
        messageApi.success("Domaine créé avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création du domaine."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="shadow-none"
         title="Ajouter un domaine"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouveau domaine"
        centered
        okText="Créer"
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
            key="create_new_field"
            layout="vertical"
            form={form}
            name="create_new_field"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      ></Modal>
    </>
  );
};
