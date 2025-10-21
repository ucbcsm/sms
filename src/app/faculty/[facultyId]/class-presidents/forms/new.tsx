"use client";

import React, { useState } from "react";
import { Button, Form, Modal, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createClassPresident,
  getCurrentClassesAsOptions,
  getCurrentDepartmentsAsOptions,
  getYearEnrollementsAsOptions,
} from "@/lib/api";
import { Class, Department, Enrollment } from "@/types";
import { DebounceEnrollmentSelect } from "./debounceSelectStudent";
import { useYid } from "@/hooks/use-yid";
import { useParams } from "next/navigation";

type FormDataType = {
  class_year_id: number;
  department_id: number;
  student_id: number;
};

type NewClassPresidentFormProps = {
  classes?: Class[];
  departments?: Department[];
  students?: Enrollment[];
};

export const NewClassPresidentForm: React.FC<NewClassPresidentFormProps> = ({
  classes,
  departments,
  students,
}) => {
  const { yid } = useYid();
  const { facultyId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createClassPresident,
  });

  const onFinish = (values: FormDataType) => {
   
    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["class_presidents"] });
        messageApi.success("Délégué de classe créé avec succès !");
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
          (error as any)?.response?.data?.message ||
            "Une erreur s'est produite lors de la création du délégué."
        );}
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
        title="Ajouter un délégué"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouveau délégué de classe"
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
        closable={{ disabled: isPending }}
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_class_president"
            layout="vertical"
            form={form}
            name="create_new_class_president"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="department_id"
          label="Mention"
          rules={[
            { required: true, message: "Veuillez sélectionner une mention" },
          ]}
        >
          <Select
            placeholder="Sélectionnez une mention"
            options={getCurrentDepartmentsAsOptions(departments)}
          />
        </Form.Item>
        <Form.Item
          name="class_year_id"
          label="Promotion"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner une année promotion",
            },
          ]}
        >
          <Select
            placeholder="Sélectionnez une année"
            options={getCurrentClassesAsOptions(classes)}
          />
        </Form.Item>
        <Form.Item
          name="student_id"
          label="Chef de promotion (CP)"
          rules={[
            { required: true, message: "Veuillez sélectionner un étudiant" },
          ]}
        >
          {/* <Select
            placeholder="Sélectionnez un étudiant"
            options={getYearEnrollementsAsOptions(students)}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          /> */}
          <DebounceEnrollmentSelect
            placeholder="Rechercher ou Sélectionnez un étudiant"
            facultyId={Number(facultyId)}
            yearId={yid}
            debounceTimeout={400}
            onChange={(value) => {
              return value;
            }}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
