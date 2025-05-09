'use client";';
import { FC, ReactNode, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Drawer,
  Flex,
  Modal,
  Space,
  StepProps,
  Steps,
  Typography,
} from "antd";
import { Options, parseAsInteger, useQueryState } from "nuqs";

import { CloseOutlined } from "@ant-design/icons";
import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";

type Props = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const NewStaffForm: FC<Props> = ({ open, setOpen }) => {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));
  const [cancel, setCancel] = useState<boolean>(false);
  const [steps] = useState<
    ReadonlyArray<{ title: string; content: ReactNode }>
  >([
    {
      title: "Info personnelles",
      content: <Step1 setStep={setStep} />,
    },
    {
      title: "Etudes et titres académiques",
      content: <Step2 setStep={setStep} />,
    },
    {
      title: "Confirmation",
      content: <Step3 setStep={setStep} />,
    },
  ]);
  const onClose = () => {
    setOpen(false);
  };

  const getStepItems = (): StepProps[] | undefined => {
    return steps.map((item) => ({ key: item.title, title: "" }));
  };

  return (
    <Drawer
      width={`100%`}
      title="Nouvel enseignant"
      onClose={onClose}
      open={open}
      closable={false}
      extra={
        <Space>
          <Button
            style={{ boxShadow: "none" }}
            onClick={() => {
              setCancel(true);
            }}
            icon={<CloseOutlined />}
            type="text"
          />
          <Modal
            title="Annuler l'enregistrement"
            open={cancel}
            onOk={() => {
              localStorage.clear();
              setOpen(false);
              setStep(null)
              setCancel(false);
            }}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
            onCancel={() => setCancel(false)}
            centered
          >
            <Alert
              message="Êtes-vous sûr de vouloir annuler l'enregistrement ?"
              description="Toutes les informations saisies seront perdues."
              type="warning"
              showIcon
              style={{ marginBottom: 16, border: 0 }}
            />
          </Modal>
        </Space>
      }
    >
      <Flex vertical gap={16}>
        <Alert
          type="info"
          message="Veuillez remplir toutes les informations nécessaires pour enregistrer un nouvel enseignant."
          description="Assurez-vous que toutes les données saisies sont exactes et complètes avant de soumettre."
          showIcon
          style={{ border: 0 }}
          closable
        />
        <Card
          title={<Typography.Title level={5}>{step+1}. {steps[step].title}</Typography.Title>}
          variant="borderless"
          style={{ boxShadow: "none" }}
          extra={
            <Steps
              current={step}
              items={getStepItems()}
              onChange={(current) => setStep(current)}
              percent={(step / (steps.length - 1)) * 100}
            />
          }
        >
          {steps[step].content}
        </Card>
      </Flex>
    </Drawer>
  );
};
