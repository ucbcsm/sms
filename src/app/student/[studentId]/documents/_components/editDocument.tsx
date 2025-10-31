import { uploadFile } from "@/actions/uploadFile";
import { AutoUpload } from "@/components/autoUpload";
import { AutoUploadFormItem } from "@/components/autoUploadItem";
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
  userId?: number;
};

export const EditDocument: FC<EditDocumentProps> = ({
  doc,
  documents,
  currentDocuments,
  userId,
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
    file_url?: string;
  }) => {
  
    mutateAsync(
      {
        id: doc.id,
        params: {
          required_document: Number(doc.required_document?.id),
          exist: values.exist,
          status: values.status,
          file_url: values.file_url || null,
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
                "Une erreur s'est produite lors de la modification. Veuillez réessayer."
            );
          }
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        type="text"
        icon={<EditOutlined />}
        title="Modifier le document du dossier"
        onClick={() => {
          form.setFieldsValue({
            docsIds: [doc.required_document?.id],
            exist: doc.exist,
            status: doc.status,
            file_url: doc.file_url,
          });
          setOpen(true);
        }}
      />
      <Modal
        destroyOnHidden
        closable={!isPending}
        maskClosable={!isPending}
        open={open}
        onCancel={onClose}
        title="Modifier l'elément du dossier"
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
        <Form.Item name="file_url" label="Version électronique">
          <AutoUploadFormItem
            name="file_url"
            form={form}
            prefix={`students/${userId}/documents`}
            accept="image/*,application/pdf"
          />
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
