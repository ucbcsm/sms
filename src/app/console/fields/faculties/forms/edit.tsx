"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Form, message, Modal } from "antd";
import { Faculty} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFaculty } from "@/utils";

type FormDataType = Omit<Faculty, "id">;

interface EditFacultyFormProps {
  faculty: Faculty;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditFacultyForm: React.FC<EditFacultyFormProps> = ({
  faculty,
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
            initialValues={faculty}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      ></Modal>
    </>
  );
};
