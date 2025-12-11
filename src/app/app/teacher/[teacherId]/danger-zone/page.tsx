"use client";

import { usePrevPathname } from "@/hooks/usePrevPathname";
import { deleteTeacher, getTeacher } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  App,
  Button,
  Card,
  Input,
  Modal,
  Typography,
} from "antd";
import { redirect, useParams } from "next/navigation";
import { useState, useMemo } from "react";

export default function TeacherDangerZonePage() {
  const {message}=App.useApp()
  const { teacherId } = useParams();
  const { prevPathname } = usePrevPathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const { mutateAsync, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteTeacher,
  });

  const {
      data: teacher,
      isPending,
      isError,
    } = useQuery({
      queryKey: ["teacher", teacherId],
      queryFn: ({ queryKey }) => getTeacher(Number(queryKey[1])),
      enabled: !!teacherId,
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
    mutateAsync(Number(teacherId), {
      onSuccess: () => {
        message.success(
          "Le compte enseignant a été supprimé avec succès."
        );
        redirect(prevPathname);
      },
      onError: (error) => {
        if ((error as any).status === 403) {
          message.error(
            `Vous n'avez pas la permission d'effectuer cette action`
          );
        } else if ((error as any).status === 401) {
          message.error(
            "Vous devez être connecté pour effectuer cette action."
          );
        } else {
          message.error(
            (error as any)?.response?.data?.message ||
              "Une erreur est survenue lors de la suppression du compte enseignant."
          );
        }
      },
    });
  };

  return (
    <>
      <Card loading={isPending}>
        <Typography.Title level={3} type="danger">
          Zone de danger - Suppression du compte enseignant
        </Typography.Title>

        {teacher && (
          <div style={{ marginBottom: "16px" }}>
            <Typography.Text strong>Enseignant: </Typography.Text>
            <Typography.Text>
              {teacher.user.surname} {teacher.user.last_name}{" "}
              {teacher.user.first_name}
              {teacher.user.matricule && ` (Matr. ${teacher.user.matricule})`}
            </Typography.Text>
            <br />
            <Typography.Text strong>Email: </Typography.Text>
            <Typography.Text>{teacher.user.email}</Typography.Text>
          </div>
        )}

        <Alert
          title="Cette action supprimera définitivement le compte enseignant."
          description="L'enseignant perdra l'accès à tous ses cours, évaluations et données associées. Cette action affectera également tous les étudiants inscrits à ses cours."
          type="warning"
          showIcon
          style={{ marginBottom: "20px" }}
        />

        <Button
          type="primary"
          danger
          disabled={!teacher}
          onClick={handleDeleteClick}
        >
          Supprimer le compte enseignant
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
        closable={!isPendingDelete}
        maskClosable={!isPendingDelete}
        okText="Supprimer définitivement"
        okButtonProps={{
          danger: true,
          type: "primary",
          disabled: !isDeleteConfirmed || isPendingDelete,
          loading: isPendingDelete,
        }}
        onOk={handleConfirmDelete}
        cancelText="Annuler"
        centered
      >
        <Alert
          title="ATTENTION - Action irréversible"
          description="Cette suppression est définitive et ne peut pas être annulée. L'enseignant perdra immédiatement l'accès à tous ses cours et données. Tous les étudiants inscrits à ses cours seront affectés."
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />

        <Typography.Paragraph>
          Êtes-vous absolument certain de vouloir supprimer le compte de{" "}
          <strong>
            {teacher?.user.surname} {teacher?.user.last_name}{" "}
            {teacher?.user.first_name}
          </strong>{" "}
          ?
        </Typography.Paragraph>

        <Typography.Paragraph>
          Pour confirmer cette action, tapez <strong>DELETE</strong> ci-dessous
          :
        </Typography.Paragraph>

        <Input
          placeholder="Tapez DELETE pour confirmer"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          disabled={isPendingDelete}
        />
      </Modal>
    </>
  );
}
