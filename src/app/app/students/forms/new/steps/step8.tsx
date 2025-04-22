import { Button, Form, Input, Space } from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect, useState } from "react";
import { z } from "zod";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

// Zod schema for form validation
const formSchema = z.object({
  q0: z.string().min(1, "Ce champ est requis"),
  q1: z.string().min(1, "Ce champ est requis"),
  q2: z.string().min(1, "Ce champ est requis"),
  q3: z.string().min(1, "Ce champ est requis"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const Step8: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<FormSchemaType>();

  const [questions, setQuestions] = useState<
    { question: string; response: string }[]
  >([
    {
      question:
        "Donnez une brève description de vous-même sur tous les points de vue possibles : Social, relationnel, intellectuel, physique, spirituel (croyance), etc. (Write a brief description about yourself in all aspects like social, relational, intellectual, physical, spiritual ...)",
      response: "",
    },
    {
      question:
        "Pourquoi avez-vous choisi l'UCBC pour faire vos études universitaires ? (Why did you choose UCBC for your university studies?)",
      response: "",
    },
    {
      question:
        "Quel est votre grand rêve après vos études ? (What is your big dream?)",
      response: "",
    },
    {
      question:
        "Comment l'UCBC peut-elle vous aider à atteindre ce grand rêve ? (How can UCBC help you meet that big dream?)",
      response: "",
    },
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem("d8");
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
      layout="vertical"
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d8", compressedData);
        setStep(8);
      }}
    >
      {questions.map((q, index) => (
        <Form.Item
          key={index}
          label={q.question}
          name={`q${index}`}
          rules={[{ required: true, message: "Ce champ est requis" }]}
        >
          <Input.TextArea placeholder="" />
        </Form.Item>
      ))}
      <Form.Item
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 20,
        }}
      >
        <Space>
          <Button onClick={() => setStep(6)} style={{ boxShadow: "none" }}>
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
