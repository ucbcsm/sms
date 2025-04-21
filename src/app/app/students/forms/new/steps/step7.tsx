import {
  Button,
  Form,
  Input,
  Select,
  Space,
  DatePicker,
  Checkbox,
  Radio,
} from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step7: FC<Props> = ({ setStep }) => {
  const onFinish = (values: any) => {
    setStep(7);
  };

  return (
    <Form style={{ width: 500 }} onFinish={onFinish}>
      <Form.Item
        label="Année académique"
        name="academic_year"
      >
        <Input placeholder="2024-2025" disabled variant="borderless" />
      </Form.Item>
      <Form.Item
        label="Cycle"
        name="cycle"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Radio.Group
          options={[
            { value: "licence", label: "Licence" },
            { value: "master", label: "Master" },
            { value: "doctorat", label: "Doctorat" },
          ]}
        />
        {/* <Input placeholder="Cycle" /> */}
      </Form.Item>
      <Form.Item
        label="Filière ou Domaine"
        name="field"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          options={[
            { value: "sciences", label: "Science" },
            { value: "Art", label: "Art" },
            { value: "Droit", label: "Droit" },
            { value: "Théologie", label: "Théologie" },
          ]}
        />
      </Form.Item>

      {/* <Form.Item label="Ancien matricule" name="former_matricule">
        <Input placeholder="Ancien matricule" />
      </Form.Item> */}
      <Form.Item
        label="Faculté"
        name="faculty"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Faculté"
          options={[
            { value: "Faculte 1", label: "Faculté 1" },
            { value: "Faculte 2", label: "Faculté 2" },
            { value: "Faculte 3", label: "Faculté 3" },
            { value: "Faculte 4", label: "Faculté 4" },
            { value: "Faculte 5", label: "Faculté 5" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Département"
        name="departement"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select placeholder="Département" options={[
            { value: "Département 1", label: "Département 1" },
            { value: "Département 2", label: "Département 2" },
            { value: "Département 3", label: "Département 3" },
            { value: "Département 4", label: "Département 4" },
            { value: "Département 5", label: "Département 5" },
        ]} />
      </Form.Item>
      <Form.Item
        label="Promotion"
        name="class_year"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select placeholder="Promotion ou classe" options={[
            { value: "Promotion 1", label: "Promotion 1" },
            { value: "Promotion 2", label: "Promotion 2" },
            { value: "Promotion 3", label: "Promotion 3" },
            { value: "Promotion 4", label: "Promotion 4" },
            { value: "Promotion 5", label: "Promotion 5" },
        ]} />
      </Form.Item>
      <Form.Item
        label="Période"
        name="period"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select placeholder="Période" options={[
            { value: "Semester 1", label: "Semester 1" },
            { value: "Semester 2", label: "Semester 2" },
        ]} />
      </Form.Item>
      {/* <Form.Item
        label="Date de soumission"
        name="date_of_submission"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item> */}
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
            Suivant
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
