"use client";

import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Descriptions,
  Dropdown,
  Flex,
  Image,
  Layout,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { teacherId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Nom complet de (enseignant)
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: `/app/teacher/${teacherId}`,
              label: "Aperçu",
            },
            {
              key: `/app/teacher/${teacherId}/courses`,
              label: "Cours",
            },
            {
                key: `/app/teacher/${teacherId}/documents`,
                label: "Documents",
              },
            {
              key: `/app/teacher/${teacherId}/evaluations`,
              label: "Évaluations",
            },
           
          ]}
          defaultActiveTabKey={pathname}
          activeTabKey={pathname}
          onTabChange={(key) => {
            router.push(key);
          }}
          tabBarExtraContent={
            <Dropdown
              menu={{
                items: [
                  { key: "cv", label: "Curriculum Vitae" },
                  { key: "contract", label: "Contrat de travail" },
                  { key: "report", label: "Rapport d'activités" },
                ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          }
        >
          {children}
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

      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Profile
          </Typography.Title>
          <Button
            type="link"
            icon={<EditOutlined />}
            title="Modifier le profile"
          >
            Modifier
          </Button>
        </Flex>
        <Space
          direction="vertical"
          size="middle"
          style={{
            padding: "40px 0 28px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
          
            <Image height={100} width={100} src="https://images.pexels.com/photos/31600507/pexels-photo-31600507/free-photo-of-casual-portrait-of-young-adult-in-state-college.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"   
              alt="Avatar de l'enseignant"
              style={{
                marginBottom: 28,
                objectFit:"cover"
              }} className="rounded-full" />
            <Typography.Title level={4}>Nom Enseignant</Typography.Title>
            <Typography.Text type="secondary">ID: 20230001</Typography.Text>
          </div>
          <Descriptions
            title="Informations personnelles"
            column={1}
            items={[
              {
                key: "sex",
                label: "Genre",
                children: "Homme",
              },
              {
                key: "name",
                label: "Nom",
                children: "Kahindo",
              },
              {
                key: "postnom",
                label: "Postnom",
                children: "Lwanzo",
              },
              {
                key: "prenom",
                label: "Prénom",
                children: "Alfred",
              },
              {
                key: "email",
                label: "Email",
                children: (
                  <a href="mailto:john.doe@example.com">john.doe@example.com</a>
                ),
              },
              {
                key: "telephone",
                label: "Téléphone",
                children: <a href="tel:+243999999999">+243 999 999 999</a>,
              },
              {
                key: "lieu_naissance",
                label: "Lieu de naissance",
                children: "Bafwasende",
              },
              {
                key: "date_naissance",
                label: "Date de naissance",
                children: "01 Janvier 1980",
              },
              {
                key: "nationalite",
                label: "Nationalité",
                children: "Congo Kinshasa",
              },
              {
                key: "ville",
                label: "Ville",
                children: "Beni",
              },
              {
                key: "adresse",
                label: "Adresse",
                children: "123 Rue Exemple, Kinshasa",
              },
            ]}
          />
        </Space>
      </Layout.Sider>
    </Layout>
  );
}
