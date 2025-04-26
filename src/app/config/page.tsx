"use client";

import { Palette } from "@/components/palette";
import { Alert, Card, Layout, Space, theme, Typography } from "antd";
import { ConfigForm } from "./form";
import { useQueryState } from "nuqs";

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
      <ConfigForm />
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
  // const [activeTabKey, setActiveTabKey] = useState("config");
  const [tab, setTab] = useQueryState("tab", { defaultValue: "config" });

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
          activeTabKey={tab}
          onTabChange={(key) => {
            setTab(key);
          }}
          tabBarExtraContent={<Palette />}
        >
          {content[tab]}
        </Card>
      </Layout.Content>
    </Layout>
  );
}
