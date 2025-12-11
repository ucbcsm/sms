"use client";

import {
  CloseOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Button, Card, Drawer, Result, Space, theme, Typography } from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";

export const SupportDrawer = () => {
  const {
    cssVar: { colorBgLayout },
  } = theme.useToken();
  const [open, setOpen] = useQueryState(
    "support",
    parseAsBoolean.withDefault(false)
  );
  const onclose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="default"
        icon={<QuestionCircleOutlined />}
        onClick={() => {
          setOpen(true);
        }}
        title="Assistance technique"
        style={{ boxShadow: "none" }}
      />
      <Drawer
        open={open}
        onClose={onclose}
        closable={false}
        title={
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Assistance technique
            </Typography.Title>
          </Space>
        }
        size={"large"}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onclose} />
        }
        styles={{
          header: { borderBottom: 0 },
          body: { background: colorBgLayout },
        }}
      >
        <Card
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: `calc(100vh - 112px)`,
          }}
        >
          <Result
            className="max-w-3xl mx-auto"
            icon={<QuestionCircleOutlined style={{ color: "GrayText" }} />}
            title="Assistance technique"
            subTitle="L'équipe IT est là pour vous aider. Contactez-nous pour toute question ou problème technique."
            extra={[
              <Button
          type="dashed"
          key="call"
          icon={<PhoneOutlined />}
          style={{ boxShadow: "none" }}
              >
          Télephone
              </Button>,
              <Button
          type="primary"
          key="write"
          icon={<WhatsAppOutlined />}
          style={{ boxShadow: "none" }}
              >
          Whatsapp
              </Button>,
            ]}
          />
        </Card>
      </Drawer>
    </>
  );
};
