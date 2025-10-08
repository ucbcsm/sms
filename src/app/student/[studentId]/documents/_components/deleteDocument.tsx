import { deleteSingleApplicationDocument } from "@/lib/api";
import { ApplicationDocument } from "@/types";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Form, Input, message, Modal } from "antd";
import { FC, useState } from "react";

type DeleteDocumentProps = {
  doc: ApplicationDocument;
};

export const DeleteDocument: FC<DeleteDocumentProps> = ({ doc }) => {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteSingleApplicationDocument,
  });

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: { confirm: string }) => {
    if (values.confirm !== "DELETE") {
      messageApi.error("Veuillez saisir DELETE pour confirmer la suppression.");
      return;
    }
    await mutateAsync(doc.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["year_enrollments"] });
        queryClient.invalidateQueries({ queryKey: ["enrollment"] });
        messageApi.success("Le document a été supprimé avec succès.");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la suppression. Veuillez réessayer."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        title="Supprimer le document du dossier"
        onClick={() => setOpen(true)}
      />
      <Modal
        destroyOnHidden
        closable={!isPending}
        maskClosable={!isPending}
        open={open}
        onCancel={onClose}
        title="Supprimer le document du dossier"
        styles={{ body: { paddingTop: 16 } }}
        okButtonProps={{
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading: isPending,
          danger:true
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        okText="Supprimer"
        modalRender={(dom) => (
          <Form
            form={form}
            onFinish={onFinish}
            disabled={isPending}
            layout="vertical"
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          type="warning"
          message={doc.required_document?.title}
          description={`Pour confirmer la suppression du document "${doc.required_document?.title}", veuillez saisir "DELETE" ci-dessous.`}
          style={{ border: 0, marginBottom: 16 }}
        />

        <Form.Item
          name="confirm"
          label="Confirmation"
          rules={[
            {
              required: true,
              //   message: "Veuillez saisir DELETE pour confirmer.",
            },
            {
              validator: (_, value) =>
                value === "DELETE"
                  ? Promise.resolve()
                  : Promise.reject("Vous devez saisir DELETE pour confirmer."),
            },
          ]}
        >
          <Input placeholder="DELETE" autoFocus />
        </Form.Item>
      </Modal>
    </>
  );
};
