import { Button, Form, Input, Space } from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import { z } from "zod";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

const formSchema = z.object({
  current_city: z.string().nonempty("Ville actuelle est requise"),
  current_municipality: z
    .string()
    .nonempty("Municipalité actuelle est requise"),
  current_neighborhood: z.string().nonempty("Adresse actuelle est requise"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const Step4: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<FormSchemaType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d4");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data,
      });
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
        localStorage.setItem("d4", compressedData);
        setStep(4);
      }}
    >
      <Form.Item
        label="Ville actuelle"
        name="current_city"
        rules={[{ required: true }]}
      >
        <Input placeholder="Ville actuelle" />
      </Form.Item>
      <Form.Item
        label="Municipalité actuelle"
        name="current_municipality"
        rules={[{ required: true }]}
      >
        <Input placeholder="Municipalité actuelle" />
      </Form.Item>
      <Form.Item
        label="Adresse actuel"
        name="current_neighborhood"
        rules={[{ required: true }]}
      >
        <Input placeholder="Quartier ou Avenue et No" />
      </Form.Item>

      <Form.Item
        style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
      >
        <Space>
          <Button onClick={() => setStep(2)} style={{ boxShadow: "none" }}>
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
