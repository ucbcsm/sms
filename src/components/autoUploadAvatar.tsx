"use client";

import React, { useState, useEffect } from "react";
import { Upload, Avatar, Button, App, Tooltip, theme, Form, Space } from "antd";
import type { UploadProps, FormInstance } from "antd";
import { RcFile } from "antd/es/upload";
import {
  CameraOutlined,
  DeleteOutlined,
  LoadingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { uploadFile } from "@/actions/uploadFile";
import { getPublicR2Url } from "@/lib/utils";

interface AutoUploadAvatarProps {
  /** Nom du champ du formulaire */
  name: string | (string | number)[];
  /** Instance du formulaire Ant Design */
  form: FormInstance;
  /** Préfixe R2 facultatif (ex: 'users/avatars') */
  prefix?: string;
  /** Taille max du fichier (par défaut 5MB) */
  maxSize?: number;
  /** Callback déclenché après suppression */
  onReset?: () => void;
  /** Valeur initiale */
  initialValue?: string | null;
  /** Taille de l’avatar */
  size?: number;
  /** Label facultatif pour un Form.Item externe */
  label?: string;
  disabled?: boolean;
}

/**
 * AutoUploadAvatar
 * ---
 * Composant d’upload d’avatar élégant, complet et réutilisable
 * - Upload automatique avec aperçu
 * - Suppression avec confirmation
 * - Synchronisé avec les formulaires Ant Design
 */
export const AutoUploadAvatar: React.FC<AutoUploadAvatarProps> = ({
  name,
  form,
  prefix = "users/avatars",
  maxSize = 5 * 1024 * 1024,
  onReset,
  initialValue = null,
  size = 100,
  label,
  disabled = false,
}) => {
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();
  const { message, modal } = App.useApp();
  const watchedValue = Form.useWatch(name, form);

  const [preview, setPreview] = useState<string | null>(
    getPublicR2Url(form.getFieldValue(name)) ||
      getPublicR2Url(initialValue) ||
      null
  );
  const [uploading, setUploading] = useState(false);

  /** Nettoyer les blobs */
  const revokeIfBlob = (url?: string | null) => {
    if (url?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
    }
  };

  /** Synchroniser la valeur du form → preview */
  useEffect(() => {
    const current = watchedValue ?? form.getFieldValue(name) ?? initialValue;
    if (current && current !== preview) {
      setPreview(getPublicR2Url(current));
    }
  }, [watchedValue, form, name]);

  /** Nettoyage lors du démontage */
  useEffect(() => {
    return () => {
      revokeIfBlob(preview);
    };
  }, [preview]);

  /** Upload handler */
  const handleBeforeUpload = async (file: RcFile) => {
    if (file.size > maxSize) {
      message.error("L’image dépasse la taille maximale autorisée (5MB).");
      return Upload.LIST_IGNORE;
    }

    revokeIfBlob(preview);
    const blobPreview = URL.createObjectURL(file);
    setPreview(blobPreview);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadFile(formData, prefix);
      form.setFieldValue(name, url);
      setPreview(getPublicR2Url(url));
      message.success("Avatar mis à jour avec succès.");
    } catch (err) {
      console.error(err);
      message.error("Erreur lors du téléversement de l’avatar.");
    } finally {
      setUploading(false);
    }

    return Upload.LIST_IGNORE;
  };

  /** Supprimer l'avatar */
  const handleReset = () => {
    modal.confirm({
      title: "Supprimer l’avatar",
      content: "Voulez-vous supprimer la photo de profil actuelle ?",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => {
        revokeIfBlob(preview);
        setPreview(null);
        form.setFieldValue(name, undefined);
        message.info("Avatar supprimé.");
        onReset?.();
      },
    });
  };

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: handleBeforeUpload,
    disabled: uploading,
    accept: "image/*",
  };

  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileUrl"
      layout="vertical"
    >
      <div className="flex flex-col items-center gap-2">
        <Avatar
          size={size}
          src={preview || undefined}
          icon={
            !preview ? (
              uploading ? (
                <LoadingOutlined />
              ) : (
                <UserOutlined />
              )
            ) : (
              <UserOutlined />
            )
          }
          style={{
            border: `1px solid ${colorBorderSecondary}`,
          }}
        />
        <Space>
          {preview && (
            <Tooltip title="Supprimer l’avatar">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                type="text"
                danger
                onClick={handleReset}
                style={{ fontSize: 13 }}
              >
                Supprimer
              </Button>
            </Tooltip>
          )}
          <Upload {...uploadProps}>
            <Tooltip title="Changer la photo de l'étudiant">
              <Button
                icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                color="primary"
                type="dashed"
                disabled={uploading ||disabled}
                style={{ boxShadow: "none" }}
              >
                {uploading ? "Upload en cours..." : "Changer la photo"}
              </Button>
            </Tooltip>
          </Upload>
        </Space>
      </div>
    </Form.Item>
  );
};
