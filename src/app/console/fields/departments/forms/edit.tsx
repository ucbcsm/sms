"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { Department, Faculty } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentFacultiesAsOptions, updateDepartment } from "@/lib/api";

type FormDataType = Omit<Department, "id" | "faculty"> & { faculty_id: number };

interface EditDepartmentFormProps {
  department: Department;
  faculties?: Faculty[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({
  department,
  faculties,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateDepartment,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: department.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["departments"] });
          messageApi.success("Département modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du département"
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
        title="Modifier le département"
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
            key="edit_department_form"
            layout="vertical"
            form={form}
            name="edit_department_form"
            initialValues={{ faculty_id: department.faculty.id, ...department }}
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
          name="faculty_id"
          label="Faculté"
          rules={[
            { required: true, message: "Veuillez sélectionner une faculté" },
          ]}
        >
          <Select
            placeholder="Sélectionnez une faculté"
            options={getCurrentFacultiesAsOptions(faculties)}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
