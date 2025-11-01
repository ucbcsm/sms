"use client";

import { Palette } from "@/components/palette";
import { countries } from "@/lib/data/countries";
import { spokenLanguagesAsOptions } from "@/lib/data/languages";
import { Step1ApplicationFormDataType } from "@/types";
import {
  Alert,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Select,
} from "antd";
import dayjs from "dayjs";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import { useCheckMatricule } from "../hooks/useCheckMatricule";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  isFormer: boolean;
};

export const Step1: FC<Props> = ({ setStep, isFormer }) => {
  const [form] = Form.useForm<Step1ApplicationFormDataType>();
  const matricule = Form.useWatch("former_matricule", form);
  const {
    matriculeExists,
    isPending: isPendingMatricule,
    isLoading: isLoadingMatricule,
    refetch: refreshMatricule,
  } = useCheckMatricule(matricule);

  useEffect(() => {
    const savedData = localStorage.getItem("d1");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data,
        date_of_birth: dayjs(data.date_of_birth, "YYYY-MM-DD"),
      });
    }
  }, []);

  return (
    <Form
      form={form}
      name="step1"
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d1", compressedData);
        setStep(1);
      }}
    >
      {isFormer && (
        <Form.Item
          label="Matricule"
          name="former_matricule"
          rules={[{ required: true }]}
          tooltip="Matricule déjà assigné à l'étudiant"
        >
          <Input
            placeholder="Matricule"
            suffix={
              isLoadingMatricule ? (
                <LoadingOutlined />
              ) : !matriculeExists && matricule ? (
                matricule?.length >= 3 ? (
                  <CheckCircleFilled style={{ color: "greenyellow" }} />
                ) : undefined
              ) : matriculeExists && matricule ? (
                matricule?.length >= 3 ? (
                  <CloseCircleFilled style={{ color: "red" }} />
                ) : undefined
              ) : undefined
            }
          />
        </Form.Item>
      )}
      {matriculeExists ? (
        <Alert
          type="error"
          message="Ce matricule existe déjà dans le système. Passez par le formulaire de réinscription comme l'étudiant existe déjà."
          description="Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur."
          showIcon
          style={{ marginBottom: 16, border: 0 }}
        />
      ) : null}
      <Form.Item label="Nom" name="surname" rules={[{ required: true }]}>
        <Input
          placeholder="Nom"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item label="Postnom" name="last_name" rules={[{ required: true }]}>
        <Input
          placeholder="Postnom"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item label="Prénom" name="first_name" rules={[{ required: true }]}>
        <Input
          placeholder="Prénom"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item label="Genre" name="gender" rules={[{ required: true }]}>
        <Radio.Group
          options={[
            { value: "M", label: "Homme" },
            { value: "F", label: "Femme" },
          ]}
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="Lieu de naissance"
        name="place_of_birth"
        rules={[{ required: true }]}
      >
        <Input
          placeholder="Lieu de naissance"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="Date de naissance"
        name="date_of_birth"
        rules={[{ required: true }]}
      >
        <DatePicker
          placeholder="DD/MM/YYYY"
          format={{ format: "DD/MM/YYYY" }}
          picker="date"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="Nationalité"
        name="nationality"
        rules={[{ required: true }]}
        tooltip="Sélectionnez votre pays"
      >
        <Select
          placeholder="Nationalité"
          options={countries}
          showSearch
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="État civil"
        name="marital_status"
        rules={[{ required: true }]}
      >
        <Radio.Group
          options={[
            { value: "single", label: "Célibataire" },
            { value: "married", label: "Marié(e)" },
            { value: "divorced", label: "Divorcé(e)" },
            { value: "widowed", label: "Veuf(ve)" },
          ]}
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="Affiliation religieuse"
        name="religious_affiliation"
        rules={[{ required: true }]}
      >
        <Input
          placeholder="Affiliation religieuse"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="Aptitude physique"
        name="physical_ability"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Radio.Group
          options={[
            { value: "normal", label: "Normale" },
            { value: "disabled", label: "Handicapé" },
          ]}
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
     
      <Form.Item
        name="spoken_languages"
        label="Langues parlées"
        rules={[
          {
            required: true,
          },
        ]}
        style={{ flex: 1 }}
      >
        <Select
          placeholder={`Langues parlées`}
          options={spokenLanguagesAsOptions}
          mode="multiple"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true }, { type: "email" }]}
      >
        <Input
          placeholder="Email"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="Téléphone 1"
        name="phone_number_1"
        rules={[{ required: true }]}
      >
        <Input
          placeholder="Téléphone 1"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Form.Item
        label="Téléphone 2"
        name="phone_number_2"
        rules={[{ required: false }]}
      >
        <Input
          placeholder="Numéro de téléphone 2"
          disabled={
            (matriculeExists && matricule && matricule?.length >= 3) ||
            isLoadingMatricule
          }
        />
      </Form.Item>
      <Flex justify="space-between" align="center">
        <Palette />
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 20,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ boxShadow: "none" }}
            disabled={
              (matriculeExists && matricule && matricule?.length >= 3) ||
              isLoadingMatricule
            }
          >
            Suivant
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};
