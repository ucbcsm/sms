"use client";
import React, { useState } from "react";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRequiredDocument } from "@/lib/api";
import { RequiredDocument } from "@/lib/types";

type FormDataType = Omit<RequiredDocument, "id">;

export const NewRequiredDocumentForm: React.FC = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createRequiredDocument,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["required-documents"] });
        messageApi.success("Elément créé avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de l'élément du dossier."
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
        title="Ajouter"
        onClick={() => setOpen(true)}
        style={{ boxShadow: "none" }}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvel élément du dossier"
        centered
        okText="Créer"
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
        destroyOnClose
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="create_required_document_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="title"
          label="Titre du document"
          rules={[{ required: true }]}
        >
          <Input placeholder="Elément du dossier" />
        </Form.Item>

        <Form.Item name="enabled" label="Visible">
          <Switch />
        </Form.Item>
      </Modal>
    </>
  );
};
