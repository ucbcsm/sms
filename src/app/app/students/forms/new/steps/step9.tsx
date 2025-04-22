import { Button, Form, Space, Checkbox, Alert } from "antd";
import { Options, parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import { FC } from "react";
import { z } from "zod";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};


const formSchema = z.object({
  certified: z.boolean().refine((val) => val === true, {
    message: "Vous devez certifier que les renseignements sont exacts.",
  }),
});

type FormSchemaType=z.infer<typeof formSchema>

export const Step9: FC<Props> = ({ setStep }) => {
  const [form]=Form.useForm<FormSchemaType>()
  const [newApplication, setNewApplication]= useQueryState("new", parseAsBoolean)


  return (
    <Form form={form} style={{ width: 500 }} onFinish={(values) => {
      localStorage.clear()
      setStep(null)
      setNewApplication(null)

    }}>
      <Alert
        type="info"
        showIcon
        description="L'Univertisté Chrétienne Bilingue du Congo est engagée et déterminée à poursuivre l'excellence dans la formation de la jeunesse congolaise pour la formtion intégrale. Ainsi des pratiques telles que la tricherie, le plagiat, la corruption, le vol, la débauche, l'ivrognerie, la promiscuité, le dérèglement social, l'accoutrement indécent, etc. sont strictement interdites et sévèrement sanctionnées. Ainsi, JE M'ENGAGE FERMEMENT à me soumettre à toutes les exigences de l'université et au code de conduite de l'étudiant tel que repris dans le manuel de l'étudiant en cas de mon admission à l'UCBC"
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
          <Button onClick={() => setStep(7)} style={{ boxShadow: "none" }}>
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
