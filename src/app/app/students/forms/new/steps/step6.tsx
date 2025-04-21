import { Button, Checkbox, Form, Input, Space, Table } from "antd";
import { Options } from "nuqs";
import { FC, useState } from "react";

type Props = {
    setStep: (
        value: number | ((old: number) => number | null) | null,
        options?: Options
    ) => Promise<URLSearchParams>;
};

export const Step6: FC<Props> = ({ setStep }) => {
const [previous_university_studies, setPrevious_university_studies]= useState<any>([]);

    const onFinish = (values: any) => {
        setStep(6);
    };

    return (
      <Form style={{ width: 500 }} onFinish={onFinish}>
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
        <Form.Item
        >
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
