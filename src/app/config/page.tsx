"use client";

import { Palette } from "@/components/palette";
import {
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

const content: Record<string, React.ReactNode> = {
  config: (
    <>
      <Alert
        style={{ border: 0 }}
        type="info"
        message="Bienvenue dans la configuration initiale de SMS-UCBC."
        description={`Veuillez remplir
le formulaire ci-dessous pour commencer. Assurez-vous également que les configurations de la base des données et des autres variables d'environnement sont déjà configurées chez votre hébergeur.`}
      />
      <Form
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
      >
        <Divider
          orientation="left"
          orientationMargin={0}
          style={{ color: "#ED6851" }}
        >
          Identité de l&apos;université
        </Divider>
        <Form.Item
          label="Nom de l'université"
          name="name"
          rules={[
            {
              required: true,
              message: "Veuillez entrer le nom de l'université",
            },
          ]}
        >
          <Input placeholder="Entrez le nom de l'université" />
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
          label="Ville"
          name="city"
          rules={[
            {
              required: true,
              message: "Veuillez entrer la ville",
            },
          ]}
        >
          <Input placeholder="Entrez la ville" />
        </Form.Item>

        <Form.Item
          label="Adresse"
          name="address"
          rules={[{ required: true, message: "Veuillez entrer l'adresse" }]}
        >
          <Input placeholder="Entrez l'adresse" />
        </Form.Item>
        <Divider
          orientation="left"
          orientationMargin={0}
          style={{ color: "#ED6851" }}
        >
          Contacts de l&apos;université
        </Divider>
        <Form.Item
          label="Téléphone"
          name="phone"
          rules={[
            {
              required: true,
              message: "Veuillez entrer le numéro de téléphone",
            },
          ]}
        >
          <Input placeholder="Entrez le numéro de téléphone" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Veuillez entrer un email valide" },
          ]}
        >
          <Input placeholder="Entrez l'email" />
        </Form.Item>
        <Divider
          orientation="left"
          orientationMargin={0}
          style={{ color: "#ED6851" }}
        >
          Informations supplémentaires
        </Divider>

        <Form.Item
          label="Année de création"
          name="yearOfCreation"
          rules={[
            {
              required: true,
              message: "Veuillez entrer l'année de création",
            },
          ]}
        >
          <Input placeholder="Entrez l'année de création" />
        </Form.Item>
        <Form.Item label="Site web" name="website">
          <Input placeholder="Entrez le site web" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea placeholder="Entrez une description" rows={4} />
        </Form.Item>

        <Divider
          orientation="left"
          orientationMargin={0}
          style={{ color: "#ED6851" }}
        >
          Utilisateur administrateur
        </Divider>

        <Form.Item
          label="Nom complet"
          name="adminFullName"
          rules={[
            { required: true, message: "Veuillez entrer le nom complet" },
          ]}
        >
          <Input placeholder="Entrez le nom complet" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="adminEmail"
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
        <Form.Item
          label="Mot de passe"
          name="adminPassword"
          rules={[
            { required: true, message: "Veuillez entrer un mot de passe" },
          ]}
        >
          <Input.Password placeholder="Entrez le mot de passe" />
        </Form.Item>
        <Form.Item
          label="Confirmer le mot de passe"
          name="confirmPassword"
          dependencies={["adminPassword"]}
          rules={[
            {
              required: true,
              message: "Veuillez confirmer le mot de passe",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("adminPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Les mots de passe ne correspondent pas")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirmez le mot de passe" />
        </Form.Item>
        <Flex justify="end">
          <Button type="primary" style={{ boxShadow: "none" }}>
            Enregistrer
          </Button>
        </Flex>
      </Form>
    </>
  ),
  guide: (
    <Alert
      message="Guide d'utilisation"
      description={` Vous trouverez des instructions détaillées sur la manière d'utiliser
      l'application SMS-UCBC. Consultez la documentation officielle pour
      plus d'informations ou contactez le support technique en cas de
      besoin.`}
      style={{ border: 0 }}
    />
  ),
  about: (
    <Alert
      message="SMS-UCBC?"
      description={`SMS-UCBC est une application conçue pour simplifier la gestion académique et
      administrative des universités. Développée avec soin, elle vise à offrir
      une expérience utilisateur optimale et à répondre aux besoins spécifiques
      des établissements d'enseignement supérieur.`}
      showIcon
      style={{ border: 0 }}
      type="info"
    />
  ),
};

export default function Page() {
  const {
    token: { colorBgContainer, colorPrimary, colorBorderSecondary },
  } = theme.useToken();
  const [activeTabKey, setActiveTabKey] = useState("config");

  return (
    <Layout style={{ background: colorBgContainer }}>
      <Layout.Content
        style={{
          background: colorBgContainer,
          maxWidth: 600,
          margin: "auto",
        }}
      >
        <Layout.Header
          style={{
            background: colorPrimary,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <Space>
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: "#ffffff" }}
            >
              Configuration initiale
            </Typography.Title>
          </Space>
        </Layout.Header>
        <Card
          style={{ borderRadius: 0 }}
          tabList={[
            { key: "config", label: "Configs" },
            { key: "guide", label: "Guide" },
            { key: "about", label: "À propos" },
          ]}
          activeTabKey={activeTabKey}
          onTabChange={(key) => {
            setActiveTabKey(key);
          }}
          tabBarExtraContent={
           <Palette/>
          }
        >
          {content[activeTabKey]}
        </Card>
      </Layout.Content>
    </Layout>
  );
}
