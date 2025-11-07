"use client";

import { deleteYearEnrollment, getYearEnrollment } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Input,
  Layout,
  message,
  Modal,
  Typography,
} from "antd";
import { redirect, useParams } from "next/navigation";
import { useState, useMemo } from "react";

export default function StudentDangerZonePage() {
  const { studentId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const { mutateAsync, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteYearEnrollment,
  });

  const {
    data: enrolledStudent,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["enrollment", studentId],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!studentId,
  });

  const isDeleteConfirmed = useMemo(() => {
    return confirmationText === "DELETE";
  }, [confirmationText]);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setConfirmationText("");
  };

  const handleConfirmDelete = () => {
    mutateAsync(Number(studentId), {
      onSuccess: () => {
        messageApi.success(
          "L'inscription de l'étudiant a été supprimée avec succès."
        );
        redirect("/app/students");
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
              "Une erreur est survenue lors de la suppression de l'inscription."
          );
        }
      },
    });
    setIsModalOpen(false);
    setConfirmationText("");
  };

  return (
    <Layout>
      {contextHolder}
      <Layout.Content style={{ padding: 28 }}>
        <Card loading={isPending}>
          <Typography.Title level={3}>
            Zone de danger - Suppression de l&apos;inscription
          </Typography.Title>

          {enrolledStudent && (
            <div style={{ marginBottom: "16px" }}>
              <Typography.Text strong>Étudiant: </Typography.Text>
              <Typography.Text>
                {enrolledStudent.user.surname} {enrolledStudent.user.last_name}{" "}
                {enrolledStudent.user.first_name} (Matr.
                {enrolledStudent.user.matricule})
              </Typography.Text>
              <br />
              <Typography.Text strong>
                Date d&apos;inscription:{" "}
              </Typography.Text>
              <Typography.Text>
                {new Date(
                  enrolledStudent.date_of_enrollment
                ).toLocaleDateString()}
              </Typography.Text>
            </div>
          )}

          <Alert
            message={`Cette action supprimera définitivement l'inscription de l'étudiant pour l'année académique ${enrolledStudent?.academic_year.name}.`}
            description="L'étudiant perdra l'accès à tous les cours et données associés à cette inscription."
            type="warning"
            showIcon
            style={{ marginBottom: "20px" }}
          />

          <Button
            type="primary"
            danger
            disabled={!enrolledStudent}
            onClick={handleDeleteClick}
          >
            Supprimer l&apos;inscription
          </Button>
        </Card>

        <Modal
          title={
            <Typography.Title level={5} type="danger">
              Confirmer la suppression
            </Typography.Title>
          }
          open={isModalOpen}
          onCancel={handleModalCancel}
          closable={{ disabled: isPendingDelete }}
          maskClosable={!isPendingDelete}
          okText="Supprimer définitivement"
          okButtonProps={{
            danger: true,
            type: "primary",
            disabled: !isDeleteConfirmed || isPendingDelete,
          }}
          onOk={handleConfirmDelete}
          cancelText="Annuler"
          centered
        >
          <Alert
            message="ATTENTION - Action irréversible"
            description="Cette suppression est définitive et ne peut pas être annulée. L'étudiant perdra immédiatement l'accès à tous ses cours et données."
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />

          <Typography.Paragraph>
            Êtes-vous absolument certain de vouloir supprimer l&apos;inscription
            de{" "}
            <strong>
              {enrolledStudent?.user.surname} {enrolledStudent?.user.last_name}{" "}
              {enrolledStudent?.user.first_name}
            </strong>{" "}
            pour l&apos;année académique{" "}
            <strong>{enrolledStudent?.academic_year.name}</strong> ?
          </Typography.Paragraph>

          <Typography.Paragraph>
            Pour confirmer cette action, tapez <strong>DELETE</strong>{" "}
            ci-dessous :
          </Typography.Paragraph>

          <Input
            placeholder="Tapez DELETE pour confirmer"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
