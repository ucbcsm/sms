"use client";

import React, { useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Faculty, Field } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFaculty, getCurrentFieldsAsOptions } from "@/lib/api";

type FormDataType = Omit<Faculty, "id" | "field"> & { field_id: number };
type NewFacultyFormProps = {
  fields?: Field[];
};
export const NewFacultyForm: React.FC<NewFacultyFormProps> = ({ fields }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createFaculty,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["faculties"] });
        messageApi.success("Faculté créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de la faculté."
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
        title="Ajouter une faculté"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle faculté"
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
            key="create_new_faculty"
            layout="vertical"
            form={form}
            name="create_new_faculty"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Nom"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer un nom de la faculté",
                },
              ]}
            >
              <Input placeholder="Entrez le nom" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="acronym"
              label="Acronyme"
              rules={[
                { required: true, message: "Veuillez entrer un acronyme" },
              ]}
            >
              <Input placeholder="Entrez l'acronyme" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="field_id"
          label="Domaine"
          rules={[
            { required: true, message: "Veuillez sélectionner un  domaine" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un domaine"
            options={getCurrentFieldsAsOptions(fields)}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
