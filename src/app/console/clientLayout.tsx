"use client";

import { AppsButton } from "@/components/appsButton";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { YearSelector } from "@/components/yearSelector";
import { useInstitution } from "@/hooks/use-institution";
import { getPublicR2Url } from "@/lib/utils";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  HomeOutlined,
  ReadOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  Image,
  Layout,
  Menu,
  Modal,
  Space,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const {
    token: { colorBgContainer, colorBorderSecondary, colorPrimary },
  } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const {data:institution}= useInstitution();

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 0,
        }}
      >
        <Space style={{ background: colorPrimary }}>
          <Button
            type="primary"
            icon={<CloseOutlined />}
            style={{
              boxShadow: "none",
              height: 64,
              width: 64,
              borderRadius: 0,
            }}
            size="large"
            onClick={() => setIsModalOpen(true)}
          />

          <Modal
            title={`Quitter la console d'administration`}
            centered
            open={isModalOpen}
            onOk={() => {
              router.push("/");
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
          >
            <Alert
              description="Assurez-vous d'avoir enregistré toutes vos modifications, car toute modification non sauvegardée sera perdue. Voulez-vous vraiment continuer ?"
              message="Vous êtes sur le point de quitter la console d'administration."
              type="info"
              showIcon
              style={{
                marginTop: 16,
                marginBottom: 32,
                // border: 0,
              }}
            />
          </Modal>
        </Space>
        <div className=" flex items-center px-4">
          <Image
            src={getPublicR2Url(institution?.logo) || undefined}
            alt="Logo"
            width={36}
            preview={false}
            style={{}}
          />
        </div>
        <Space style={{}}>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {institution?.acronym}
          </Typography.Title>
          <Divider type="vertical" />
          <Typography.Text type="secondary">
            Console d&apos;administration
          </Typography.Text>
        </Space>
        <div className="flex-1" />
        <Space>
          <YearSelector />
          <LanguageSwitcher />
          <SupportDrawer />
          <AppsButton />
          <UserProfileButton />
        </Space>
      </Layout.Header>
      <Layout>
        <Layout.Sider
          width={260}
          style={{
            borderRight: `1px solid ${colorBorderSecondary}`,
            paddingTop: 20,
            background: colorBgContainer,
            height: `calc(100vh - 64px)`,
            overflow: "auto",
          }}
        >
          <Layout style={{}}>
            <Menu
              mode="inline"
              theme="light"
              style={{ height: "100%", borderRight: 0 }}
              items={[
                {
                  key: `/`,
                  label: "Menu",
                  type: "group",
                  children: [
                    {
                      key: `/console`,
                      label: <Link href={`/console`}>Profile</Link>,
                      icon: <HomeOutlined />,
                    },
                    {
                      key: `/console/years`,
                      label: <Link href={`/console/years`}>Années</Link>,
                      icon: <ClockCircleOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: `/console/fields`,
                      label: (
                        <Link href={`/console/fields`}>
                          Filières & Mentions
                        </Link>
                      ),
                      icon: <ApartmentOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: "/console/enrollment-form",
                      label: (
                        <Link href={`/console/enrollment-form`}>
                          Formulaire d&apos;inscription
                        </Link>
                      ),
                      icon: <CheckCircleOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: `/console/evaluation-form`,
                      label: (
                        <Link href={`/console/evaluation-form`}>
                          Formulaire d&apos;évaluation
                        </Link>
                      ),
                      icon: <ReadOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: "/console/classrooms",
                      label: (
                        <Link href={`/console/classrooms`}>
                          Salles de classe
                        </Link>
                      ),
                      icon: <TagsOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: "/console/users",
                      label: <Link href={`/console/users`}>Comptes</Link>,
                      icon: <TeamOutlined />,
                    },
                  ],
                },
              ]}
            />

           
          </Layout>
        </Layout.Sider>
        <Layout.Content>
          <div>{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
