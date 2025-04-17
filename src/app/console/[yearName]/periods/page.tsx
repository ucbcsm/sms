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
                            Gestion des périodes
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
                                title="Ajouter une période"
                                style={{ boxShadow: "none" }}
                            >
                                Ajouter une période
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
                        { key: "ongoing", label: "En cours" },
                        { key: "upcoming", label: "À venir" },
                        { key: "completed", label: "Terminées" },
                    ]}
                >
                    <List
                        dataSource={[
                            {
                                id: "1",
                                name: "Semestre 1",
                                type: "Semestre",
                                startDate: "01/01/2023",
                                endDate: "30/06/2023",
                                status: "En cours",
                            },
                            {
                                id: "2",
                                name: "Semestre 2",
                                type: "Semestre",
                                startDate: "01/07/2023",
                                endDate: "31/12/2023",
                                status: "À venir",
                            },
                            {
                                id: "3",
                                name: "Session d'été",
                                type: "Session",
                                startDate: "01/08/2023",
                                endDate: "31/08/2023",
                                status: "Terminée",
                            },
                            {
                                id: "5",
                                name: "Session spéciale",
                                type: "Session",
                                startDate: "01/09/2023",
                                endDate: "30/09/2023",
                                status: "À venir",
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
                                    avatar={<Avatar>P{index + 1}</Avatar>}
                                    title={<Link href="#">{item.name}</Link>}
                                    description={
                                        <>
                                            <div>Type: {item.type}</div>
                                            <div>
                                                Dates: {item.startDate} - {item.endDate}
                                            </div>
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
