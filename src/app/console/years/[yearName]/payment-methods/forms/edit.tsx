'use client'

import React, { Dispatch, SetStateAction } from "react";
import { Form, Input, message, Modal, Switch } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentMethod } from "@/utils";
import { PaymentMethod } from "@/types";

type FormDataType = Omit<PaymentMethod, "id">;

type EditPaymentMethodFormProps = {
  paymentMethod: PaymentMethod;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditPaymentMethodForm: React.FC<EditPaymentMethodFormProps> = ({
  paymentMethod,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePaymentMethod,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: paymentMethod.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
          messageApi.success("Méthode de paiement modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la méthode de paiement."
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
        title="Modification méthode de paiement"
        centered
        okText="Mettre à jour"
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
            labelCol={{ span: 8 }}
            name="edit_payment_method_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={paymentMethod}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="Nom"
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder="Nom de la méthode de paiement" />
        </Form.Item>
        <Form.Item name="enabled" label="Activé" rules={[]}>
          <Switch />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea placeholder="Description de la méthode de paiement" />
        </Form.Item>
      </Modal>
    </>
  );
};
