"use client";

import { useYid } from "@/hooks/use-yid";
import { logout } from "@/lib/api/auth";
import { getHSLColor } from "@/lib/utils";
import { useSessionStore } from "@/store";
import {
  LoadingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, message, Spin, Typography } from "antd";
import { useState } from "react";

export const UserProfileButton = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const { removeYid } = useYid();
  const { user } = useSessionStore();
  return (
    <>
      {contextHolder}
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
            {
              key: "logout",
              label: "Déconnexion",
              icon: <LogoutOutlined />,
            },
          ],
          onClick: async ({ key }) => {
            if (key === "logout") {
              setIsLoadingLogout(true);
              await logout()
                .then(() => {
                  removeYid();
                  window.location.href = "/auth/login";
                })
                .catch((error) => {
                  console.log("Error", error.response?.status, error.message);
                  messageApi.error(
                    "Ouf, une erreur est survenue, Veuillez réessayer!"
                  );
                  setIsLoadingLogout(false);
                });
            }
          },
        }}
        trigger={["hover"]}
        arrow
      >
        <Avatar
          src={user?.avatar}
          style={{
            background: getHSLColor(
              `${user?.surname} ${user?.last_name} ${user?.first_name}`
            ),
          }}
        >
          {user?.first_name?.charAt(0).toUpperCase() || "U"}
        </Avatar>
      </Dropdown>

      <div
        className=""
        style={{
          display: isLoadingLogout ? "flex" : "none",
          flexDirection: "column",
          background: "#fff",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            width: 440,
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <Typography.Title
            type="secondary"
            level={3}
            style={{ marginTop: 10 }}
          >
            Déconnexion en cours ...
          </Typography.Title>
        </div>
      </div>
    </>
  );
};
