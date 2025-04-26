import { Button, Form, Space, Checkbox, Alert, Radio } from "antd";
import { Options, parseAsBoolean, useQueryState } from "nuqs";
import { FC } from "react";
import { z } from "zod";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

const formSchema = z.object({
  staff_type: z.enum(["permanent", "visitor"], {
    errorMap: () => ({ message: "Type de personnel invalide" }),
  }),
  certified: z.boolean().refine((val) => val === true, {
    message: "Vous devez certifier que les renseignements sont exacts.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const Step3: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<FormSchemaType>();
 const [newTeacher, setNewTeacher]= useQueryState("new", parseAsBoolean)

  return (
    <Form
      form={form}
      style={{ width: 500 }}
      onFinish={(values) => {
        
        setNewTeacher(null)
        setStep(null);
        localStorage.clear();
      }}
    >
      <Form.Item
        label="Type de personnel"
        name="staff_type"
        rules={[{ required: true }]}
      >
        <Radio.Group
          options={[
            { value: "permanent", label: "Permanent" },
            { value: "visitor", label: "Visiteur" },
          ]}
        />
      </Form.Item>
      <Alert
        type="info"
        showIcon
        description="En soumettant ce formulaire, je confirme que les informations fournies sont exactes et complètes. Je m'engage également à respecter les règlements et les exigences de l'établissement en tant qu'enseignant."
        style={{ border: 0 }}
      />
      <Form.Item
        name="certified"
        valuePropName="checked"
        rules={[
          { required: true, message: "Vous devez certifier cette case." },
        ]}
        style={{ marginTop: 16 }}
      >
        <Checkbox>
          Je certifie sur honneur que les renseignements ci-haut fournis sont
          exacts
        </Checkbox>
      </Form.Item>
      <Form.Item
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 20,
        }}
      >
        <Space>
          <Button onClick={() => setStep(1)} style={{ boxShadow: "none" }}>
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
