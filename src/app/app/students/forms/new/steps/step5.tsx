'use client'
import { Button, DatePicker, Form, Input, InputNumber, Select, Space, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Step5ApplicationFormDataType } from "@/lib/types";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step5: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step5ApplicationFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d5");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({ ...data });
    }
  }, []);

  return (
    <Form
      form={form}
      style={{ width: 500 }}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d5", compressedData);
        setStep(5);
      }}
    >
      <Form.Item
        label="Nom de l'école secondaire"
        name="name_of_secondary_school"
        rules={[{ required: true }]}
      >
        <Input placeholder="Nom de l'école secondaire" />
      </Form.Item>
      <Form.Item
        label="Pays de l'école secondaire"
        name="country_of_secondary_school"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Pays de l'école secondaire"
          options={[
            { value: "afghanistan", label: "Afghanistan" },
            { value: "afrique_du_sud", label: "Afrique du Sud" },
            { value: "albanie", label: "Albanie" },
            { value: "algerie", label: "Algérie" },
            { value: "allemagne", label: "Allemagne" },
            // ... (reste des options)
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Province de l'école secondaire"
        name="province_of_secondary_school"
        rules={[{ required: true }]}
      >
        <Input placeholder="Province de l'école secondaire" />
      </Form.Item>
      <Form.Item
        label="Territoire ou municipalité de l'école"
        name="territory_or_municipality_of_school"
        rules={[{ required: true }]}
      >
        <Input placeholder="Territoire ou municipalité de l'école" />
      </Form.Item>
      <Form.Item
        label="Section ou option suivie aux humanités"
        name="section_followed"
        rules={[{ required: true }]}
      >
        <Input placeholder="Section suivie" />
      </Form.Item>
      <Form.Item
        label="Année d'obtention du diplôme"
        name="year_of_diploma_obtained"
        rules={[{ required: true }]}
      >
        <Input  placeholder="Année d'obtention du diplôme" />
      </Form.Item>
      <Form.Item
        label="Numéro du diplôme"
        name="diploma_number"
        rules={[{ required: true }]}
      >
        <Input placeholder="Numéro du diplôme" />
      </Form.Item>
      <Form.Item
        label="Pourcentage obtenu au diplôme"
        name="diploma_percentage"
        rules={[{ required: true }]}
      >
        <InputNumber
          placeholder="Pourcentage obtenu au diplôme"
          step={0.01}
          suffix="%"
          min={0}
          max={100}
        />
      </Form.Item>
      <Form.Item label="Fichier du diplôme" name="diploma_file">
        <Upload>
          <Button icon={<UploadOutlined />}>Télécharger le fichier</Button>
        </Upload>
      </Form.Item>
      <Form.Item label="Autres documents" name="other_documents">
        <Upload>
          <Button icon={<UploadOutlined />}>Télécharger les documents</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 20,
        }}
      >
        <Space>
          <Button onClick={() => setStep(3)} style={{ boxShadow: "none" }}>
            Précédent
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ boxShadow: "none" }}
          >
            Suivant
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
