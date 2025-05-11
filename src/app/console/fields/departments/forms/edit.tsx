"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Form, message, Modal } from "antd";
import { Department } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartment } from "@/utils";

type FormDataType = Omit<Department, "id">;

interface EditDepartmentFormProps {
  department: Department;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({
  department,
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
            initialValues={department}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      ></Modal>
    </>
  );
};
