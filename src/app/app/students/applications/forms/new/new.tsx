'use client";';
import { FC, ReactNode, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Drawer,
  Flex,
  Modal,
  Space,
  StepProps,
  Steps,
  theme,
  Typography,
} from "antd";
import { Options, parseAsInteger, useQueryState } from "nuqs";
import { Step1 } from "./steps/step1";
import { Step2 } from "./steps/step2";
import { Step3 } from "./steps/step3";
import { Step4 } from "./steps/step4";
import { Step5 } from "./steps/step5";
import { Step6 } from "./steps/step6";
import { Step7 } from "./steps/step7";
import { Step8 } from "./steps/step8";
import { Step9 } from "./steps/step9";
import { Step10 } from "./steps/step10";
import { CloseOutlined } from "@ant-design/icons";
import { useApplicationStepsData } from "@/hooks/use-application-steps-data";
import { useInstitution } from "@/hooks/use-institution";

type Props = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  isFormer: boolean;
};

export const NewApplicationForm: FC<Props> = ({ open, setOpen, isFormer }) => {
  const { data: institution } = useInstitution();
  const {
    token: { colorPrimary , colorBgLayout},
  } = theme.useToken();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));
  const [cancel, setCancel] = useState<boolean>(false);
  const { removeData } = useApplicationStepsData();

  const [steps] = useState<
    ReadonlyArray<{ title: string; content: ReactNode }>
  >([
    {
      title: "Info personnelles",
      content: <Step1 setStep={setStep} isFormer={isFormer} />,
    },
    {
      title: "Informations sur les parents",
      content: <Step2 setStep={setStep} />,
    },
    {
      title: "Origine de l'étudiant",
      content: <Step3 setStep={setStep} />,
    },
    {
      title: "Adresse actuelle",
      content: <Step4 setStep={setStep} />,
    },
    {
      title: "Études secondaires faites",
      content: <Step5 setStep={setStep} />,
    },
    {
      title: "Occupations après les humanités",
      content: <Step6 setStep={setStep} />,
    },
    {
      title: "Choix de filière",
      content: <Step7 setStep={setStep} />,
    },
    {
      title: "Autres questions importantes",
      content: <Step8 setStep={setStep} />,
    },
    {
      title: "Eléments du dosier",
      content: <Step9 setStep={setStep} />,
    },
    {
      title: "Confirmation",
      content: (
        <Step10 setStep={setStep} setOpen={setOpen} isFormer={isFormer} />
      ),
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
      width={`calc(100% - 362px)`}
      title={
        isFormer ? (
          <Badge count="Ancien étudiant">
            <Typography.Title style={{ marginBottom: 0 }} level={5}>
              Formulaire d&apos;enregistrement
            </Typography.Title>
          </Badge>
        ) : (
          <Typography.Title style={{ marginBottom: 0 }} level={5} ellipsis={{}}>
            Nouvelle candidature
          </Typography.Title>
        )
      }
      styles={{
        //  header: { background: colorPrimary, color: "#fff" }
        body: { background: colorBgLayout },
      }}
      onClose={onClose}
      open={open}
      closable={false}
      extra={
        <Space>
          <Steps
            current={step}
            items={getStepItems()}
            onChange={(current) => setStep(current)}
            percent={(step / (steps.length - 1)) * 100}
          />
          <Button
            style={{ boxShadow: "none" }}
            onClick={() => {
              setCancel(true);
            }}
            icon={<CloseOutlined />}
            type="text"
          />
          <Modal
            title="Annuler la candidature"
            open={cancel}
            onOk={() => {
              removeData();
              setOpen(null);
              setStep(null);
              setCancel(false);
            }}
            okButtonProps={{ style: { boxShadow: "none" }, danger: true }}
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
        </Space>
      }
    >
      <Flex vertical gap={16} style={{ maxWidth: 520, margin: "auto" }}>
        {isFormer && (
          <Alert
            type="warning"
            message="Attention"
            description={`Veuillez noter que ce formulaire est strictement réservé aux anciens étudiants de l'${institution?.acronym} qui ne sont pas encore enregistrés dans le système. Si l'étudiant n'a jamais été inscrit à l'${institution?.acronym}, veuillez utiliser le formulaire de nouvelle candidature ou de réinscription s'il existe déjà dans le système.`}
            showIcon
            style={{ border: 0 }}
            closable
          />
        )}
        <Card
          title={steps[step].title}
          variant="borderless"
          style={{ boxShadow: "none" }}
          styles={{
            header: {
              borderBottom: "none",
            },
            body: { paddingTop: 0 }
          }}
        >
          {steps[step].content}
        </Card>
      </Flex>
    </Drawer>
  );
};
