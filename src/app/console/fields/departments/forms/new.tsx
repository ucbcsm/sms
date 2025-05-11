"use client";

import React, { useState } from "react";
import { Button, Form, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Department } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "@/utils";

type FormDataType = Omit<Department, "id">;

export const NewDepartmentForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createDepartment,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        messageApi.success("Département créé avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création du département."
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
         title="Ajouter un département"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouveau département"
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
            key="create_new_department"
            layout="vertical"
            form={form}
            name="create_new_department"
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
