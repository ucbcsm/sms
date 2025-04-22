import { Button, Checkbox, Form, Input, Space, Table } from "antd";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect, useState } from "react";
import { z } from "zod";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};


const formSchema = z.object({
  spoken_language: z.string(),
  professional_activity: z.string(),
  is_foreign_registration: z.boolean().optional(),
  previous_university_studies: z.array(
    z.object({
      year: z.string(),
      school: z.string(),
      track: z.string(),
      result: z.string(),
    })
  ).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>

export const Step6: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<FormSchemaType>();
  const [previous_university_studies, setPrevious_university_studies] =
    useState<any>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("d6");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({ ...data });
    }
  }, []);

  return (
    <Form form={form} style={{ width: 500 }} onFinish={(values)=>{
      const compressedData= compressToEncodedURIComponent(JSON.stringify(values))
      localStorage.setItem("d6", compressedData)
      setStep(6)
    }}>
      <Form.Item
        label="Langues parlées"
        name="spoken_language"
        rules={[{ required: true }]}
      >
        <Input placeholder="Langues parlées" />
      </Form.Item>
      <Form.Item
        label="Activités professionnelles"
        name="professional_activity"
        rules={[{ required: true }]}
      >
        <Input.TextArea placeholder="Activités professionnelles" />
      </Form.Item>
      <Form.Item
        label="Études universitaires précédentes"
        name="is_foreign_registration"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item>
        <Button type="link" htmlType="button">Ajouter une ligne</Button>
      </Form.Item>

      <Table
        columns={[
          { key: "year", dataIndex: "year", title: "Année académique" },
          { key: "school", dataIndex: "school", title: "Etablissement" },
          {
            key: "track",
            dataIndex: "track",
            title: "Année d'études et faculté",
          },
          { key: "result", dataIndex: "result", title: "Résultat" },
        ]}
        dataSource={previous_university_studies}
      />
      <Form.Item
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 20,
        }}
      >
        <Space>
          <Button onClick={() => setStep(4)} style={{ boxShadow: "none" }}>
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
