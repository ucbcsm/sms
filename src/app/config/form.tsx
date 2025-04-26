"use client";

import { Button, Divider, Flex, Form, Input, Radio, Select } from "antd";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  acronym: z.string(),
  category: z.enum(["university", "institute"]),
  web_site: z.string().url().optional(),
  phone_number_1: z.string(),
  phone_number_2: z.string().optional(),
  email_address: z.string().email(),
  logo: z.string().url().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
  country: z.string(),
  province: z.string(),
  city: z.string(),
  address: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function ConfigForm() {
  const [form] = Form.useForm<FormSchemaType>();
  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      onFinish={(values)=>{

      }}
    >
      <Divider
        orientation="left"
        orientationMargin={0}
        style={{ color: "#ED6851" }}
      >
        Informations générales
      </Divider>
      <Form.Item
        label="Nom"
        name="name"
        rules={[
          {
            required: true,
            message: "Veuillez entrer le nom",
          },
        ]}
      >
        <Input placeholder="Entrez le nom" />
      </Form.Item>
      <Form.Item
        label="Sigle"
        name="acronym"
        rules={[
          {
            required: true,
            message: "Veuillez entrer le sigle",
          },
        ]}
      >
        <Input placeholder="Entrez le sigle" />
      </Form.Item>
      <Form.Item
        label="Catégorie"
        name="category"
        rules={[
          {
            required: true,
            message: "Veuillez sélectionner une catégorie",
          },
        ]}
      >
        <Radio.Group
          options={[
            { value: "university", label: "Université" },
            { value: "institute", label: "Institut" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Site web" name="web_site">
        <Input placeholder="Entrez le site web" />
      </Form.Item>
      <Form.Item
        label="Téléphone 1"
        name="phone_number_1"
        rules={[
          {
            required: true,
            message: "Veuillez entrer le numéro de téléphone principal",
          },
        ]}
      >
        <Input placeholder="Entrez le numéro de téléphone principal" />
      </Form.Item>
      <Form.Item label="Téléphone 2" name="phone_number_2">
        <Input placeholder="Entrez le numéro de téléphone secondaire" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email_address"
        rules={[
          {
            type: "email",
            required: true,
            message: "Veuillez entrer un email valide",
          },
        ]}
      >
        <Input placeholder="Entrez l'email" />
      </Form.Item>
      <Form.Item label="Logo" name="logo">
        <Input placeholder="Entrez l'URL du logo" />
      </Form.Item>
      <Divider
        orientation="left"
        orientationMargin={0}
        style={{ color: "#ED6851" }}
      >
        Vision et mission
      </Divider>
      <Form.Item label="Vision" name="vision">
        <Input.TextArea placeholder="Entrez la vision" rows={4} />
      </Form.Item>
      <Form.Item label="Mission" name="mission">
        <Input.TextArea placeholder="Entrez la mission" rows={4} />
      </Form.Item>
      <Divider
        orientation="left"
        orientationMargin={0}
        style={{ color: "#ED6851" }}
      >
        Localisation
      </Divider>
      <Form.Item
        label="Pays"
        name="country"
        rules={[
          {
            required: true,
            message: "Veuillez sélectionner un pays",
          },
        ]}
      >
        <Select
          placeholder="Sélectionnez un pays"
          showSearch
          allowClear
          options={[
            {
              value: "République Démocratique du Congo",
              label: "République Démocratique du Congo",
            },
            { value: "Belgique", label: "Belgique" },
            { value: "France", label: "France" },
            { value: "Canada", label: "Canada" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Province"
        name="province"
        rules={[
          {
            required: true,
            message: "Veuillez entrer la province",
          },
        ]}
      >
        <Input placeholder="Entrez la province" />
      </Form.Item>
      <Form.Item
        label="Ville/Territoire"
        name="city"
        rules={[
          {
            required: true,
            message: "Veuillez entrer la ville",
          },
        ]}
      >
        <Input placeholder="Entrez la ville ou le territoire" />
      </Form.Item>
      <Form.Item
        label="Adresse"
        name="address"
        rules={[
          {
            required: true,
            message: "Veuillez entrer l'adresse",
          },
        ]}
      >
        <Input.TextArea placeholder="Entrez l'adresse" />
      </Form.Item>
      <Form.Item>
        <Flex justify="end">
          <Button
            type="primary"
            style={{ boxShadow: "none" }}
            htmlType="submit"
          >
            Enregistrer
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}
