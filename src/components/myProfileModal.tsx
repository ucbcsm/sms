"use client";

import { updateUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  theme,
} from "antd";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import { AutoUploadAvatar } from "./autoUploadAvatar";
import { User } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MyProfileModalProps = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  user?: User | null;
};

export const MyProfileModal: FC<MyProfileModalProps> = ({
  open,
  setOpen,
  user,
}) => {
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const router= useRouter()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUser,
  });
  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: { avatar: string; email: string }) => {
    if (!user) return;
    mutateAsync(
      {
        id: user.id,
        params: {
          ...user,
          avatar: values.avatar || null,
          email: values.email || user.email,
        },
      },
      {
        onSuccess: () => {
          router.refresh();
          message.success("Profil mis à jour avec succès.");
          setOpen(false);
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
                "Une erreur s'est produite lors de la mise à jour. Veuillez réessayer."
            );
          }
        },
      }
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      avatar: user?.avatar,
      matricule: user?.matricule,
      surname: user?.surname,
      last_name: user?.last_name,
      first_name: user?.first_name,
      email: user?.email,
    });
  }, [user]);

  return (
    <Modal
      title={`Profile ${user?.matricule}`}
      loading={!user}
      styles={{
        header: {
          paddingBottom: 8,
          //   borderBottom: `1px solid ${colorBorderSecondary}`,
        },
        body: { paddingTop: 8 },
      }}
      open={open}
      centered
      onCancel={onClose}
      //   maskClosable={false}
      modalRender={(dom) => (
        <Form
          form={form}
          onFinish={onFinish}
          disabled={isPending}
          labelCol={{ span: 6 }}
        >
          {dom}
        </Form>
      )}
      okText="Enregistrer"
      okButtonProps={{
        htmlType: "submit",
        style: { boxShadow: "none" },
        loading: isPending,
      }}
      cancelButtonProps={{ style: { boxShadow: "none" } }}
      footer={(_, { OkBtn, CancelBtn }) => (
        <Flex justify="space-between" align="center">
          <Link
            href="/auth/reset-password"
            style={{ color: colorBorderSecondary, fontSize: 14 }}
          >
            <Button type="link">Changer le mot de passe</Button>
          </Link>
          <Space>
            <CancelBtn />
            <OkBtn />
          </Space>
        </Flex>
      )}
    >
      <Form.Item label="Photo" name="avatar" layout="vertical">
        <AutoUploadAvatar
          form={form}
          name="avatar"
          prefix={
            user?.is_staff
              ? `teachers/${user.id}/avatars`
              : `students/${user?.id}/avatars`
          }
          initialValue={user?.avatar}
        />
      </Form.Item>
      <Card>
        <Form.Item
          label="Matricule"
          name="matricule"
          rules={[{ required: true }]}
        >
          <Input placeholder="Matricule" disabled />
        </Form.Item>
        <Form.Item label="Nom" name="surname" rules={[{ required: true }]}>
          <Input placeholder="Nom" disabled />
        </Form.Item>
        <Form.Item
          label="Postnom"
          name="last_name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Postnom" disabled />
        </Form.Item>
        <Form.Item
          label="Prénom"
          name="first_name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Prénom" disabled />
        </Form.Item>
        <Form.Item
          label="Adresse mail"
          name="email"
          rules={[{ required: true }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
      </Card>
    </Modal>
  );
};
