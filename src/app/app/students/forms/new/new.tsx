'use client";';
import { FC, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Drawer,
  Flex,
  Modal,
  Space,
  Steps,
  theme,
} from "antd";
import { Options, parseAsInteger, useQueryState } from "nuqs";
import { Step1 } from "./steps/step1";
import { Step2 } from "./steps/step2";
import { Step3 } from "./steps/step3";

type Props = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const NewApplicationForm: FC<Props> = ({ open, setOpen }) => {
  const {
    token: {
      colorTextTertiary,
      colorFillAlter,
      borderRadiusLG,
      colorBorder,
      colorBgContainer,
    },
  } = theme.useToken();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));
  const [cancel, setCancel] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  };
  const steps = [
    {
      title: "Info personnelles",
      content: <Step1 setStep={setStep} />,
    },
    {
      title: "Informations sur les parents",
      content: <Step2 setStep={setStep}/>,
    },
    {
      title: "Origine",
      content: <Step3 setStep={setStep}/>
    },
    {
      title: "Informations académiques",
      content: "Informations sur les parents",
    },
    {
      title: "Informations sur la classe",
      content: "Informations sur la classe",
    },
    {
      title: "Documents",
      content: "Documents",
    },
    {
      title: "Confirmation",
      content: "Confirmation",
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: "" }));

  return (
    <Drawer
      width={`100%`}
      title="Nouvelle candidature"
      onClose={onClose}
      open={open}
      closable={false}
      extra={
        <Space>
          <>
            <Button
              style={{ boxShadow: "none" }}
              onClick={() => {
                setCancel(true);
              }}
            >
              Annuler
            </Button>
            <Modal
              title="Annuler la candidature"
              open={cancel}
              onOk={() => {
                setOpen(null);
                setCancel(false);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la candidature ?"
                description="Vous allez perdre toutes les informations saisies."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </>
          <Button
            type="primary"
            style={{ boxShadow: "none" }}
            disabled={step !== 6}
          >
            Enregistrer
          </Button>
        </Space>
      }
    >
      <Flex vertical gap={16}>
        <Alert
          type="warning"
          message=" Veuillez compléter toutes les étapes avant de soumettre la candidature."
          description="Tout formulaire qui contiendrait de faux renseignements ne sera pas pris en considération"
          showIcon
          style={{border:0}}
          closable
        />
        <Card
          title={steps[step].title}
          variant="borderless"
          extra={<Steps current={step} items={items} />}
          style={{ boxShadow: "none" }}
        >
          <div
            style={{
              // display: "flex",
              // flexDirection: "column",
              // alignItems: "center",
            }}
          >
            {steps[step].content}
          </div>
        </Card>
      </Flex>
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "auto",
          color: colorTextTertiary,
          backgroundColor: colorBgContainer,
          // borderRadius: borderRadiusLG,
          border: `1px dashed ${colorBorder}`,
          marginTop: 16,
          padding:28
        }}
      >
        
      </div> */}
    </Drawer>
  );
};
