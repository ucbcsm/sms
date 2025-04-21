import { Button, Form, Input, Space } from "antd";
import { Options } from "nuqs";
import { FC, useState } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step8: FC<Props> = ({ setStep }) => {
  const onFinish = (values: any) => {
    setStep(8);
  };
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

  return (
    <Form style={{ width: 500 }} layout="vertical" onFinish={onFinish}>
      {questions.map((q, index) => (
        <Form.Item
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
