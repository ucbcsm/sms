"use client";

import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import {
  ClockCircleOutlined,
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  Dropdown,
  Layout,
  Modal,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary, colorPrimary },
  } = theme.useToken();

  const { yearName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

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
            title={`Voulez-vous quitter la console d'administration ${
              yearName ?? ""
            }? `}
            centered
            open={isModalOpen}
            onOk={() => {
              router.push("/app");
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
          >
            <Alert
              message="Vous êtes sur le point de quitter la console d'administration. Assurez-vous d'avoir enregistré toutes vos modifications, car toute modification non sauvegardée sera perdue. Voulez-vous vraiment continuer ?"
              type="warning"
              style={{
                marginTop:16,
                marginBottom: 32,
              border:0}}
            />
          </Modal>
        </Space>
        <Space style={{ paddingLeft: 16 }}>
          <Dropdown
            menu={{
              selectedKeys: ["1"],
              items: [
                {
                  key: "global",
                  label: "Menu",
                  type: "group",
                  children: [
                    {
                      key: "/console",
                      label: "Années academiques",
                      icon: <ClockCircleOutlined />,
                    },
                    {
                      key: "/console/users",
                      label: "Comptes utilisateurs",
                      icon: <TeamOutlined />,
                    },
                  ],
                  
                },
              ],
                onClick: ({ key }) => {
                
                    router.push(key);
                  
                },
            }}
            trigger={["hover"]}
            destroyPopupOnHide={true}
          >
            <Button icon={<MenuOutlined color="#fff" />} type="text" />
          </Dropdown>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            CI-UCBC
          </Typography.Title>
          <Divider
            type="vertical"
            style={{ display: yearName ? "block" : "none" }}
          />
          <Typography.Text
            type="secondary"
            style={{ display: yearName ? "block" : "none" }}
          >
            Console d&apos;administration
          </Typography.Text>
        </Space>
        <div className="flex-1" />
        <Space>
          <div style={{ display: yearName ? "block" : "none" }}>
            <YearSelector />
          </div>

          <Dropdown
            menu={{
              items: [
                {
                  key: "/app/profile",
                  label: "Mon profile",
                  icon: <UserOutlined />,
                },
                {
                  type: "divider",
                },
                { key: "", label: "Déconnexion", icon: <LogoutOutlined /> },
              ],
              onClick: ({ key }) => {},
            }}
            trigger={["hover"]}
            destroyPopupOnHide={true}
          >
            <Button type="text" icon={<UserOutlined/>}/>
          </Dropdown>
          <LanguageSwitcher />
        </Space>
      </Layout.Header>
      <div >{children}</div>
    </Layout>
  );
}
