"use client";

import React from "react";
import { Button, Result } from "antd";
import {
  PhoneOutlined,
  QuestionCircleOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

export default function Page() {
  return (
    <Result
      className="max-w-3xl mx-auto"
      icon={<QuestionCircleOutlined style={{ color: "" }} />}
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
  );
}
