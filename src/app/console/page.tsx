"use client";

import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { EditOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Layout,
  Row,
  Space,
  theme,
  Typography,
} from "antd";
import Link from "next/link";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Content
        style={{
          padding: "0 32px 0 32px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
        className="px-4 md:px-8 bg-white"
      >
        <Layout.Header
          className="flex top-0 z-[1]"
          style={{ background: colorBgContainer, padding: 0 }}
        >
          <Space className="font-medium">
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Profile de l&apos;université
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          title="Détails"
          extra={
            <Button icon={<EditOutlined />} style={{ boxShadow: "none" }}>
              Modifier
            </Button>
          }
        >
          <Row>
            <Col span={16}>
              <Descriptions
                column={2}
                items={[
                  {
                    label: "Sigle",
                    children: "UCBC",
                  },
                  {
                    label: "Nom",
                    children: "Université Chrétienne Bilingue du Congo",
                  },
                  {
                    label: "Devise",
                    children: "Amour, Travail, Fidélité",
                  },
                  {
                    label: "Slogan",
                    children: "Etre Transformé pour transformer",
                  },
                  {
                    label: "Pays",
                    children: "République Démocratique du Congo",
                  },
                  {
                    label: "Province",
                    children: "Nord-Kivu",
                  },
                  {
                    label: "Ville",
                    children: "Beni",
                  },
                  {
                    label: "Adresse",
                    children:
                      "Beni, Nord-Kivu, République Démocratique du Congo",
                  },
                  {
                    label: "Téléphone",
                    children: "+243 999 123 456",
                  },
                  {
                    label: "Email",
                    children: "contact@ucbc.cd",
                  },
                  {
                    label: "Site web",
                    children: (
                      <Link href="https://www.ucbc.cd" target="_blank">
                        www.ucbc.cd
                      </Link>
                    ),
                  },
                  {
                    label: "Année de création",
                    children: "2007",
                  },
                  {
                    label: "Statut",
                    children: "Privée",
                  },
                  {
                    label: "Accréditation",
                    children:
                      "Ministère de l'Enseignement Supérieur et Universitaire",
                  },
                  {
                    label: "Type d'établissement",
                    children: "Université",
                  },
                  {
                    label: "Langue d'enseignement",
                    children: "Français, Anglais",
                  },

                  {
                    label: "Mission",
                    children:
                      "Former des leaders chrétiens compétents et intègres pour transformer la société.",
                  },
                  {
                    label: "Description",
                    children:
                      "L'Université Chrétienne Bilingue du Congo (UCBC) est une institution académique qui vise à offrir une éducation de qualité tout en promouvant des valeurs chrétiennes pour le développement durable.",
                  },
                  {
                    label: "Organisation mère",
                    children: "Congo Initiative",
                  },
                ]}
              />
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <Image
                  src="/ucbc-logo.png"
                  alt="Logo ucbc"
                  style={{
                    marginBottom: 28,
                  }}
                  // size={200}
                  // shape="square"
                />
                {/* <Typography.Title level={4}>LOGO</Typography.Title> */}
              </div>
            </Col>
          </Row>
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: " 24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>
    </Layout>
  );
}
