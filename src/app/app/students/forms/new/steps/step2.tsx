import { Button, Form, Input, Space } from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step2: FC<Props> = ({ setStep }) => {
  const onFinish = (values: any) => {
    setStep(2);
  };
  return (
    <Form style={{ width: 500 }} onFinish={onFinish}>
      <Form.Item
        label="Nom du père"
        name="father_name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Nom du père" />
      </Form.Item>
      <Form.Item
        label="Nom de la mère"
        name="mother_name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Nom de la mère" />
      </Form.Item>
      <Form.Item
        label="Téléphone du père"
        name="father_phone_number"
        rules={[]}
      >
        <Input placeholder="Téléphone du père" />
      </Form.Item>
      <Form.Item
        label="Téléphone de la mère"
        name="mother_phone_number"
        rules={[]}
      >
        <Input placeholder="Téléphone de la mère" />
      </Form.Item>
      <Form.Item
        style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
      >
        <Space>
          <Button onClick={() => setStep(0)} style={{ boxShadow: "none" }}>
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
