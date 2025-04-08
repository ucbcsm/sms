"use client";

import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import {
  ClockCircleOutlined,
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
  SelectOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Select, Space, theme } from "antd";
import { useState } from "react";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorder}` 
        }}
      >
        <Space>
          <Dropdown
            menu={{
              selectedKeys: ["1"],
              items: [
                {
                  key: "currentYear",
                  label: "Annnée en cours",
                  type: "group",
                  children: [
                    {
                      key: `1`,
                      label: `2023-2024`,
                      icon: <SelectOutlined />,
                    },
                  ],
                },
                {
                  type: "divider",
                },
                {
                  key: "global",
                  label: "Accès avancé",
                  type: "group",
                  children: [
                    {
                      key: "/console",
                      label: "Années academiques",
                      icon: <ClockCircleOutlined />,
                    },
                    {
                      key: "/console/users",
                      label: "Utilisateurs",
                      icon: <TeamOutlined />,
                    },
                  ],
                },
                {
                  type: "divider",
                },
                {
                  key: "",
                  label: "Quitter",
                  icon: <CloseOutlined />,
                },
              ],
              //   onClick: ({ key }) => {
              //     if (key === "") {
              //       push("/app");
              //     } else {
              //       push(key);
              //     }
              //   },
            }}
            trigger={["hover"]}
            destroyPopupOnHide={true}
          >
            <Button icon={<MenuOutlined color="#fff" />} type="text" />
          </Dropdown>
          <div className="Logo">Paramètres</div>
        </Space>
        <div className="flex-1" />
        <Space>
          <YearSelector />
          <LanguageSwitcher />
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
            <Avatar
              className=" text-inherit bg-transparent"
              icon={<UserOutlined />}
              src={undefined}
            />
          </Dropdown>
        </Space>
      </Layout.Header>
      <Layout style={{}}>{children}</Layout>
    </Layout>
  );
}
