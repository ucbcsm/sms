"use client";

import React, { useState } from "react";
import { Upload, message, Progress, Image, Typography } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";

interface AutoUploadProps {
  uploadAction: (formData: FormData, prefix?: string) => Promise<string>; // server action qui retourne l’URL du fichier
  prefix?: string;
  accept?: string; // ex: "image/*,application/pdf"
  maxSize?: number; // taille max en octets
  onUploaded?: (url: string) => void; // callback après succès
}

export function AutoUpload({
  uploadAction,
  prefix = "",
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10 MB
  onUploaded,
}: AutoUploadProps) {
const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload: UploadProps["beforeUpload"] = async (file) => {
    if (file.size > maxSize) {
      messageApi.error(
        `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      );
      return Upload.LIST_IGNORE;
    }

    setUploading(true);
    setProgress(0);

    // Si c’est une image, créer un preview instantané
    if (file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulation d’une progression
      const fakeProgress = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 5 : prev));
      }, 200);

      const fileUrl = await uploadAction(formData, prefix);
      clearInterval(fakeProgress);
      setProgress(100);

      messageApi.success("Fichier uploadé avec succès");
      setUploading(false);

      if (onUploaded) onUploaded(fileUrl);
    } catch (error: any) {
      console.error(error);
      messageApi.error("Échec de l’upload du fichier");
      setUploading(false);
      setProgress(0);
    }

    // empêcher l’upload par défaut d’Ant Design
    return Upload.LIST_IGNORE;
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <Upload.Dragger
          name="file"
          accept={accept}
          multiple={false}
          showUploadList={false}
          beforeUpload={handleUpload}
          disabled={uploading}
          className="max-w-lg w-full bg-white p-6 border-dashed transition-all"
        >
          <InboxOutlined style={{ color: "GrayText", fontSize: 48 }} />
          <Typography.Title
            type="secondary"
            level={5}
            className=""
          >
            Cliquez ou glissez-déposez ici.
          </Typography.Title>
          <Typography.Paragraph
            type="secondary"
            className="text-gray-400 text-sm"
          >
            Le fichier sera directement uploadé
          </Typography.Paragraph>
        </Upload.Dragger>

        {uploading && (
          <div className="w-full max-w-lg">
            <Progress percent={progress} status="active" showInfo />
          </div>
        )}

        {previewUrl && (
          <div className="w-full max-w-sm mt-2">
            <Image
              src={previewUrl}
              alt="Preview"
              className="rounded-lg shadow-sm"
              style={{ maxHeight: 240, objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </>
  );
}
