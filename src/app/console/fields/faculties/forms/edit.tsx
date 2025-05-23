"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { Faculty, Field } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentFieldsAsOptions, updateFaculty } from "@/lib/api";

type FormDataType = Omit<Faculty, "id" | "field"> & { field_id: number };

interface EditFacultyFormProps {
  faculty: Faculty;
  fields?: Field[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditFacultyForm: React.FC<EditFacultyFormProps> = ({
  faculty,
  fields,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateFaculty,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: faculty.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["faculties"] });
          messageApi.success("Faculté modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la faculté"
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
        title="Modifier la faculté"
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
            key="edit_faculty_form"
            layout="vertical"
            form={form}
            name="edit_faculty_form"
            initialValues={{ field_id: faculty.field.id, ...faculty }}
            onFinish={onFinish}
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
