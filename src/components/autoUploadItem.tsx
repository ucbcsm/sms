"use client";

import React, { useState, useEffect } from "react";
import { Upload, Image, Button, Space, Tag, App, Form } from "antd";
import type { UploadProps, FormInstance } from "antd";
import { RcFile } from "antd/es/upload";
import {
  CheckCircleFilled,
  CloseOutlined,
  ExportOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { uploadFile } from "@/actions/uploadFile";
import { getPublicR2Url } from "@/lib/utils";

interface AutoUploadFormItemProps {
  name: string | number | (string | number)[];
  form: FormInstance;
  prefix?: string;
  accept?: string;
  maxSize?: number;
  onReset?: () => void;
  onChange?: (value: string | null) => void; // ✅ pour informer Form.Item
}

export const AutoUploadFormItem: React.FC<AutoUploadFormItemProps> = ({
  name,
  form,
  prefix,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10 MB
  onReset,
  onChange,
}) => {
  const { modal, message } = App.useApp();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  // ✅ Observe automatiquement la valeur du champ dans le formulaire
const watchedValue = Form.useWatch(name, form);
  const [value, setValue] = useState<string | undefined>(form.getFieldValue(name));

  useEffect(() => {
    if (watchedValue !== undefined) {
      setValue(watchedValue);
    }
  }, [watchedValue]);
  // 🔄 Met à jour l’état local quand la valeur du form change (utile au retour sur la page)
  useEffect(() => {
    if (value) {
      setUploaded(true);
      setPreview(getPublicR2Url(value));
    } else {
      setUploaded(false);
      setPreview(null);
    }
  }, [value]);

  // 🧹 Helper: révoque les blob URLs temporaires
  const revokeIfBlob = (url?: string | null) => {
    if (url && url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    }
  };

  // 🖼️ Détermine si l’URL correspond à une image
  const isImageUrl = (url?: string | null) => {
    if (!url) return false;
    const u = url.toLowerCase();
    if (u.startsWith("blob:") || u.startsWith("data:image/")) return true;
    return /\.(png|jpe?g|gif|webp|svg|bmp|avif|heic|heif|ico)(\?.*)?$/.test(u);
  };

  // 📤 Upload handler
  const handleBeforeUpload = async (file: RcFile) => {
    if (file.size > maxSize) {
      message.error("Le fichier dépasse la taille maximale autorisée (10MB).");
      return Upload.LIST_IGNORE;
    }

    // Prévisualisation immédiate si image
    if (file.type.startsWith("image/")) {
      revokeIfBlob(preview);
      const p = URL.createObjectURL(file);
      setPreview(p);
    } else {
      revokeIfBlob(preview);
      setPreview(null);
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadFile(formData, prefix);
      setUploaded(true);
      setPreview(getPublicR2Url(url));

      // ✅ Notifie le Form.Item parent
      if (onChange) onChange(url);

      message.success("Fichier uploadé avec succès.");
    } catch {
      setUploaded(false);
      message.error("Erreur lors du téléversement du fichier.");
    } finally {
      setUploading(false);
    }

    return Upload.LIST_IGNORE; // Empêche l’ajout automatique à la liste AntD
  };

  // ♻️ Réinitialisation du fichier
  const handleReset = () => {
    modal.confirm({
      title: "Confirmer la réinitialisation",
      content: "Êtes-vous sûr de vouloir réinitialiser le fichier téléversé ?",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => {
        revokeIfBlob(preview);
        setPreview(null);
        setUploaded(false);
        setUploading(false);

        if (onChange) onChange(null); // ✅ Notifie le form
        if (onReset) onReset();

        message.info("Fichier réinitialisé.");
      },
    });
  };

  const uploadProps: UploadProps = {
    beforeUpload: handleBeforeUpload,
    showUploadList: false,
    accept,
    disabled: uploading,
  };

  return (
    <div className="flex space-y-2 space-x-2 items-center">
      {!uploaded ? (
        <Upload {...uploadProps}>
          <Button
            disabled={uploading}
            icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
            variant="dashed"
            color="primary"
            style={{ boxShadow: "none" }}
          >
            {uploading ? "Upload en cours..." : "Téléverser un fichier"}
          </Button>
        </Upload>
      ) : (
        <Tag
          icon={<CheckCircleFilled />}
          color="success"
          bordered={false}
          style={{ borderRadius: 10 }}
        >
          Fichier téléversé avec succès
        </Tag>
      )}

      <Space align="center">
        {preview &&
          (isImageUrl(preview) ? (
            <Image
              src={preview}
              alt="preview"
              height={32}
              width="auto"
              className="rounded-md"
              preview
            />
          ) : (
            <a
              href={preview}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Voir le fichier <ExportOutlined />
            </a>
          ))}

        {uploaded && (
          <Button
            icon={<CloseOutlined />}
            type="text"
            size="small"
            title="Réinitialiser le fichier téléversé"
            onClick={handleReset}
            shape="circle"
          />
        )}
      </Space>
    </div>
  );
};

