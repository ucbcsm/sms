"use client";

import {
    AppstoreOutlined,
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    PlusOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Layout,
    List,
    Radio,
    Space,
    theme,
    Typography,
} from "antd";

import { Palette } from "@/components/palette";
import Link from "next/link";
import BackButton from "@/components/backButton";

export default function Page() {
    const {
        token: { colorBgContainer, colorBorderSecondary },
    } = theme.useToken();

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
                            Gestion des méthodes de paiement
                        </Typography.Title>
                    </Space>
                    <div className="flex-1" />
                    <Space>
                        <Palette />
                    </Space>
                </Layout.Header>
                <Card
                    tabBarExtraContent={
                        <Space>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                title="Ajouter une méthode de paiement"
                                style={{ boxShadow: "none" }}
                            >
                                Ajouter une méthode
                            </Button>
                            <Radio.Group>
                                <Radio.Button value="grid">
                                    <AppstoreOutlined />
                                </Radio.Button>
                                <Radio.Button value="list">
                                    <UnorderedListOutlined />
                                </Radio.Button>
                            </Radio.Group>
                        </Space>
                    }
                    tabList={[
                        {
                            key: "all",
                            label: "Toutes",
                        },
                        { key: "active", label: "Actives" },
                        { key: "inactive", label: "Inactives" },
                    ]}
                >
                    <List
                        dataSource={[
                            {
                                id: "1",
                                name: "Carte Bancaire",
                                description: "Paiement via carte bancaire (Visa, MasterCard, etc.)",
                                status: "Active",
                            },
                            {
                                id: "2",
                                name: "PayPal",
                                description: "Paiement via compte PayPal",
                                status: "Inactive",
                            },
                            {
                                id: "3",
                                name: "Virement Bancaire",
                                description: "Paiement par transfert bancaire",
                                status: "Active",
                            },
                            {
                                id: "4",
                                name: "Espèces",
                                description: "Paiement en espèces au bureau",
                                status: "Inactive",
                            },
                        ]}
                        renderItem={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Dropdown
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
                                    </Dropdown>
                                }
                            >
                                <List.Item.Meta
                                    avatar={<Avatar>M{index + 1}</Avatar>}
                                    title={<Link href="#">{item.name}</Link>}
                                    description={
                                        <>
                                            <div>{item.description}</div>
                                            <div>Statut: {item.status}</div>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
                <Layout.Footer
                    style={{
                        display: "flex",
                        background: colorBgContainer,
                        padding: "24px 0",
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
