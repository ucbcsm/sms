"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Form, message, Modal } from "antd";
import { Period } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePeriod } from "@/utils";

type FormDataType = Omit<Period, "id">;

interface EditPeriodFormProps {
  period: Period;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditPeriodForm: React.FC<EditPeriodFormProps> = ({
  period,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePeriod,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: period.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["periods"] });
          messageApi.success("Période modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la période"
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
        title="Modifier la période"
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
            key="edit_period_form"
            layout="vertical"
            form={form}
            name="edit_period_form"
            initialValues={period}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      ></Modal>
    </>
  );
};
