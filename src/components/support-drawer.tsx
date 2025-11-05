"use client";

import {
  CloseOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Button, Card, Drawer, Result, Space, Typography } from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";

export const SupportDrawer = () => {
  const [open, setOpen] = useQueryState(
    "support",
    parseAsBoolean.withDefault(false)
  );
    const onclose = () => {
      setOpen(false);
    }

  return (
    <>
      <Button
        type="default"
        icon={<QuestionCircleOutlined />}
        onClick={() => {
          setOpen(true);
        }}
        title="Assistance technique"
        style={{boxShadow:"none"}}
      />
      <Drawer
        open={open}
        onClose={onclose}
        closable={false}
        title={
          <Space>
            {/* <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              shape="circle"
              onClick={onclose}
            /> */}
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Assistance technique
            </Typography.Title>
          </Space>
        }
        width="100%"
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onclose} />
        }
        styles={{ header: { borderBottom: 0 }, body: { paddingTop: 0 } }}
      >
        <Card
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: `calc(100vh - 96px)`,
          }}
        >
          <Result
            className="max-w-3xl mx-auto"
            icon={<QuestionCircleOutlined style={{ color: "GrayText" }} />}
            title="Assistance technique"
            subTitle="Les experts à la matière n'attendent que vous. Nous vous proposons de l’expertise,
    de l’expérience et de la méthodologie pour une bonne utilisation de cette application. Pour tout problème technique n'hésitez pas à nous contacter et nous pouvons nous déplacer vers vous s'il le faut."
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
