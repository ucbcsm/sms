import { updateSingleApplicationDocument } from "@/lib/api";
import { filterOption } from "@/lib/utils";
import { ApplicationDocument, RequiredDocument } from "@/types";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, message, Modal, Select, Switch } from "antd";
import { FC, useEffect, useState } from "react";

type EditDocumentProps = {
  doc: ApplicationDocument;
  documents?: RequiredDocument[];
  currentDocuments?: ApplicationDocument[];
};

export const EditDocument: FC<EditDocumentProps> = ({
  doc,
  documents,
  currentDocuments,
}) => {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateSingleApplicationDocument,
  });

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const getDocumentsAsOptions = () => {
    return documents?.map((doc) => ({
      label: `${doc.title}${doc.required ? " (Obligatoire)" : ""}`,
      value: doc.id,
      disabled:
        currentDocuments?.some((d) => d.required_document?.id === doc.id) ||
        !doc.enabled,
    }));
  };

  const onFinish = (values: {
    docsIds: number[];
    exist: boolean;
    status: "pending" | "rejected" | "validated";
  }) => {
    mutateAsync(
      {
        id: doc.id,
        params: {
          required_document: Number(doc.required_document?.id),
          exist: values.exist,
          status: values.status,
          file_url: doc.file_url,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["year_enrollments"],
          });
          queryClient.invalidateQueries({
            queryKey: ["enrollment"],
          });
          messageApi.success("Le document a été modifié avec succès.");

          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification. Veuillez réessayer."
          );
        },
      }
    );
  };
  useEffect(() => {
    if (doc) {
      form.setFieldsValue({
        docsIds: [doc.required_document?.id],
        exist: doc.exist,
        status: doc.status,
      });
    }
  }, [doc]);

  return (
    <>
      {contextHolder}
      <Button
        type="text"
        icon={<EditOutlined />}
        title="Modifier le document du dossier"
        onClick={() => setOpen(true)}
      />
      <Modal
        destroyOnHidden
        closable={!isPending}
        maskClosable={!isPending}
        open={open}
        onCancel={onClose}
        title="Modifier le document du dossier"
        styles={{ body: { paddingTop: 16 } }}
        okButtonProps={{
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading: isPending,
        }}
        cancelButtonProps={{ style: { boxShadow: "none" } }}
        modalRender={(dom) => (
          <Form form={form} onFinish={onFinish} disabled={isPending}>
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="docsIds"
          label="Document"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner un ou plusieurs document",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Sélectionner un ou plusieurs documents"
            options={getDocumentsAsOptions()}
            optionFilterProp="children"
            filterOption={filterOption}
            mode="multiple"
            disabled
          />
        </Form.Item>
        <Form.Item
          name="exist"
          label="Version papier"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: "Veuillez indiquer si le document physique est présent",
            },
          ]}
          initialValue={true}
        >
          <Switch checkedChildren="✓ Présent" unCheckedChildren="✗ Absent" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Statut de vérification"
          rules={[
            { required: true, message: "Veuillez sélectionner un statut" },
          ]}
          initialValue="validated"
        >
          <Select
            placeholder="Sélectionner un statut"
            options={[
              { value: "pending", label: "En attente" },
              { value: "validated", label: "Validé" },
              { value: "rejected", label: "Rejeté" },
            ]}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
