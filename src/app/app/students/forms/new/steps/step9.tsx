import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Radio,
  Checkbox,
} from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step9: FC<Props> = ({ setStep }) => {
  const onFinish = (values: any) => {
    setStep(7);
  };

  return (
    <Form style={{ width: 500 }} onFinish={onFinish}>
      <Form.Item
        // label="Année académique"
        name=""
        rules={[{required:true}]}
      >
        <Checkbox >Je certifie sur honneur que les renseignements ci-haut fournis sont exacts</Checkbox>
      </Form.Item>
      <Form.Item
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 20,
        }}
      >
        <Space>
          <Button onClick={() => setStep(5)} style={{ boxShadow: "none" }}>
            Précédent
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ boxShadow: "none" }}
          >
            Soumettre maintenant
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
