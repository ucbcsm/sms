"use client";

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  List,
  Space,
  Switch,
} from "antd";

import Link from "next/link";

export default function Page() {
return (
    <List
        dataSource={[
            {
                id: "1",
                name: "Carte Bancaire",
                description: "Paiement via carte bancaire (Visa, MasterCard, etc.)",
                status: "disabled",
            },
            {
                id: "2",
                name: "PayPal",
                description: "Paiement via compte PayPal",
                status: "disabled",
            },
            {
                id: "3",
                name: "Virement Bancaire",
                description: "Paiement par transfert bancaire",
                status: "enabled",
            },
            {
                id: "4",
                name: "Espèces",
                description: "Paiement en espèces au bureau",
                status: "enabled",
            },
            {
                id: "5",
                name: "Chèques",
                description: "Paiement par chèques bancaires",
                status: "enabled",
            },
        ]}
        renderItem={(item, index) => (
            <List.Item
                key={item.id}
                extra={
                    <Space>
                        <Switch checked={item.status === "enabled" ? true : false} />
                        {/* <Dropdown
                            menu={{
                                items: [
                                    { key: "1", label: "Modifier", icon: <EditOutlined /> },
                                    {
                                        key: "2",
                                        label: "Supprimer",
                                        danger: true,
                                        icon: <DeleteOutlined />,
                                    },
                                ],
                            }}
                        >
                            <Button icon={<MoreOutlined />} type="text" />
                        </Dropdown> */}
                    </Space>
                }
            >
                <List.Item.Meta
                    title={item.name}
                    description={item.description}
                />
            </List.Item>
        )}
    />
);
}
