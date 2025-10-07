"use client";

import {
  formatAdmissionTestResultsForEdition,
  formatApplicationDocumentsForEdition,
  formatEnrollmentQuestionResponseForEdition,
  updateStudentInfo,
} from "@/lib/api";
import { filterOption } from "@/lib/utils";
import { ApplicationDocument, Enrollment, RequiredDocument } from "@/types";
import { FileAddOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, message, Modal, Select, Switch } from "antd";
import { FC, useState } from "react";

type ButtonAddNewDocumentProps = {
  documents?: RequiredDocument[];
  currentDocuments?: ApplicationDocument[];
  yearEnrollment?: Enrollment;
};

export const ButtonAddNewDocument: FC<ButtonAddNewDocumentProps> = ({
  documents,
  currentDocuments,
  yearEnrollment,
}) => {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateStudentInfo,
  });

  const getDocumentsAsOptions = () => {
    return documents?.map((doc) => ({
      label: doc.title,
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
    if (!yearEnrollment) {
      messageApi.error("Aucune donnée disponible pour la mise à jour.");
    } else {
      mutateAsync(
        {
          id: Number(yearEnrollment?.common_enrollment_infos.id),
          params: {
            ...values,
            user: {
              id: yearEnrollment?.user.id,
              first_name: yearEnrollment.user.first_name!,
              last_name: yearEnrollment.user.last_name!,
              surname: yearEnrollment.user.surname!,
              email: yearEnrollment.user.email,
              avatar: yearEnrollment?.user.avatar,
              matricule: yearEnrollment.user.matricule,
              pending_avatar: yearEnrollment?.user.pending_avatar,
              is_active: yearEnrollment?.user.is_active,
              is_staff: yearEnrollment?.user.is_staff,
              is_student: yearEnrollment?.user.is_student,
              is_superuser: yearEnrollment?.user.is_superuser,
              is_permanent_teacher: yearEnrollment?.user.is_permanent_teacher,
            },
            application_documents: [
              ...formatApplicationDocumentsForEdition(
                yearEnrollment?.common_enrollment_infos.application_documents
              ),
            ],
            enrollment_question_response:
              formatEnrollmentQuestionResponseForEdition(
                yearEnrollment?.common_enrollment_infos
                  .enrollment_question_response
              ),
            admission_test_result: formatAdmissionTestResultsForEdition(
              yearEnrollment?.common_enrollment_infos.admission_test_result
            ),
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["year_enrollments"],
            });
            queryClient.invalidateQueries({
              queryKey: ["enrollment", Number(yearEnrollment.id)],
            });
            messageApi.success("Le document a été ajouté avec succès.");

            setOpen(false);
          },
          onError: () => {
            messageApi.error(
                "Une erreur s'est produite lors de l'ajout. Veuillez réessayer."
            );
          },
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<FileAddOutlined />}
        variant="dashed"
        color="primary"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter des documents
      </Button>

      <Modal
        destroyOnHidden
        open={open}
        onCancel={() => setOpen(false)}
        title="Ajouter des documents au dossier"
        styles={{ body: { paddingTop: 16 } }}
        okButtonProps={{ htmlType: "submit", style: { boxShadow: "none" } }}
        cancelButtonProps={{ style: { boxShadow: "none" } }}
        modalRender={(dom) => <Form form={form}>{dom}</Form>}
      >
        <Form.Item
          name="docsIds"
          label="Documents"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner un ou plusieurs document",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Sélectionner un document"
            options={getDocumentsAsOptions()}
            optionFilterProp="children"
            filterOption={filterOption}
            mode="multiple"
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
        >
          <Switch checkedChildren="✓ Présent" unCheckedChildren="✗ Absent" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Statut"
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
