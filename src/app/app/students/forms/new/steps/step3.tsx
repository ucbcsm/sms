import { Button, DatePicker, Form, Input, Radio, Select, Space } from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step3: FC<Props> = ({ setStep }) => {
  const onFinish = (values: any) => {
    setStep(3);
  };
  return (
    <Form style={{ width: 500 }} onFinish={onFinish}>
      <Form.Item
        label="Pays d'origine"
        name="country_of_origin"
        rules={[{ required: true }]}
      >
        <Input placeholder="Pays d'origine" />
      </Form.Item>
      <Form.Item
        label="Province d'origine"
        name="province_of_origin"
        rules={[{ required: true }]}
      >
        <Input placeholder="Province d'origine" />
      </Form.Item>
      <Form.Item
        label="Territoire ou municipalité d'origine"
        name="territory_or_municipality_of_origin"
        rules={[{ required: true }]}
      >
        <Input placeholder="Territoire ou municipalité d'origine" />
      </Form.Item>

      <Form.Item
        style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
      >
        <Space>
        <Button onClick={() => setStep(1)} style={{boxShadow:"none"}}>Precedant</Button>
        <Button type="primary" htmlType="submit" style={{ boxShadow: "none" }}>
          Suivant
        </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
