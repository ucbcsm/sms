"use client";

import React, { useState } from "react";
import { Button, Form, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Class } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass } from "@/utils";

type FormDataType = Omit<Class, "id">;

export const NewClassForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createClass,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        messageApi.success("Promotion créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de la promotion."
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
        title="Ajouter une promotion"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle promotion"
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
            key="create_new_class"
            layout="vertical"
            form={form}
            name="create_new_class"
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
