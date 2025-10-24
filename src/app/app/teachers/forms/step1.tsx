'use client'
import { countries } from "@/lib/data/countries";
import { Step1TeacherFormDataType } from "@/types";
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, DatePicker, Form, Input, Radio, Select, Space } from "antd";
import dayjs from "dayjs";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import { useCheckTeacherMatricule } from "./hooks/useCheckTeacherMatricule";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  isFormer:boolean;
};


export const Step1: FC<Props> = ({ setStep, isFormer }) => {
  const [form] = Form.useForm<Step1TeacherFormDataType>();
  const matricule = Form.useWatch("matricule", form);

    const {
      matriculeExists,
      isPending: isPendingMatricule,
      isLoading: isLoadingMatricule,
      refetch: refreshMatricule,
    } = useCheckTeacherMatricule(matricule);

  useEffect(() => {
    const savedData = localStorage.getItem("dt1");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data, date_of_birth: dayjs(data.date_of_birth, "YYYY-MM-DD"),
      });
    }
  }, []);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("dt1", compressedData);
        setStep(1);
      }}
      style={{ maxWidth: 520, margin: "auto" }}
    >
      {isFormer && (
        <Form.Item
          label="Matricule"
          name="matricule"
          rules={[{ required: true }]}
          tooltip="Matricule déjà assigné à l'enseignant"
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
          message="Le matricule existe déjà pour un autre enseignant."
          description="Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur."
          showIcon
          style={{ marginBottom: 16, border: 0 }}
        />
      ) : null}
      <Form.Item label="Nom" name="surname" rules={[{ required: true }]}>
        <Input placeholder="Nom" />
      </Form.Item>
      <Form.Item label="Postnom" name="last_name" rules={[{ required: true }]}>
        <Input placeholder="Postnom" />
      </Form.Item>
      <Form.Item label="Prénom" name="first_name" rules={[{ required: true }]}>
        <Input placeholder="Prénom" />
      </Form.Item>
      <Form.Item label="Sexe" name="gender" rules={[{ required: true }]}>
        <Radio.Group
          options={[
            { value: "M", label: "Masculin" },
            { value: "F", label: "Feminin" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Lieu de naissance" name="place_of_birth" rules={[]}>
        <Input placeholder="Lieu de naissance" />
      </Form.Item>
      <Form.Item label="Date de naissance" name="date_of_birth" rules={[]}>
        <DatePicker
          placeholder="DD/MM/YYYY"
          format={{ format: "DD/MM/YYYY" }}
          picker="date"
        />
      </Form.Item>
      <Form.Item
        label="Est-il étranger?"
        name="is_foreign_country_teacher"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        label="Nationalité"
        name="nationality"
        rules={[{ required: true }]}
      >
        <Select placeholder="Nationalité" options={countries} showSearch />
      </Form.Item>
      <Form.Item
        label="Ville ou Térritoire"
        name="city_or_territory"
        rules={[]}
      >
        <Input placeholder="Ville/Térritoire" />
      </Form.Item>
      <Form.Item label="Adresse" name="address" rules={[]}>
        <Input.TextArea placeholder="Quartier ou Avenue et No" />
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
        />
      </Form.Item>
      <Form.Item
        label="Affiliation religieuse"
        name="religious_affiliation"
        rules={[{  }]}
      >
        <Input placeholder="Affiliation religieuse" />
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
        />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Téléphone 1"
        name="phone_number_1"
        rules={[{ required: true }]}
      >
        <Input placeholder="Téléphone 1" />
      </Form.Item>
      <Form.Item label="Téléphone 2" name="phone_number_2" rules={[]}>
        <Input placeholder="Numéro de téléphone 2" />
      </Form.Item>
      <Form.Item
        style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
      >
        <Space>
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
