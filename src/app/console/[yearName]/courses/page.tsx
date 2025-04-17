"use client";

import {
    AppstoreOutlined,
    MoreOutlined,
    PlusCircleOutlined,
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
                            Gestion des cours
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
                                title="Ajouter un cours"
                                style={{ boxShadow: "none" }}
                            >
                                Ajouter
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
                            label: "Tous les cours",
                        },
                        { key: "catalogs", label: "Catalogues" },
                        { key: "programs", label: "Programmes" },
                        { key: "promotions", label: "Promotions" },
                    ]}
                >
                    {/* Contenu de l'onglet actif */}
                    <Typography.Text>
                        Contenu de l&apos;onglet actif
                    </Typography.Text>
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

            <Layout.Sider
                width={280}
                theme="light"
                style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
            >
                <Card
                    variant="borderless"
                    title="Catalogue des Cours"
                    style={{ boxShadow: "none" }}
                    extra={
                        <Button
                            type="link"
                            icon={<PlusCircleOutlined />}
                            title="Ajouter un cours"
                        >
                            Ajouter
                        </Button>
                    }
                >
                    <List
                        dataSource={[
                            {
                                id: "1",
                                name: "Algèbre Linéaire",
                                // department: "Mathématiques",
                            },
                            {
                                id: "2",
                                name: "Programmation Orientée Objet",
                                // department: "Informatique",
                            },
                            {
                                id: "3",
                                name: "Mécanique des Fluides",
                                // department: "Génie Civil",
                            },
                            {
                                id: "4",
                                name: "Marketing Digital",
                                // department: "Sciences de Gestion",
                            },
                            {
                                id: "5",
                                name: "Réseaux Informatiques",
                                // department: "Télécommunications",
                            },
                        ]}
                        renderItem={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Dropdown
                                        menu={{
                                            items: [
                                                { key: "1", label: "Modifier" },
                                                { key: "2", label: "Supprimer" },
                                                { key: "3", label: "Voir détails" },
                                            ],
                                        }}
                                    >
                                        <Button icon={<MoreOutlined />} type="text" />
                                    </Dropdown>
                                }
                            >
                                <List.Item.Meta
                                    avatar={<Avatar>C{index + 1}</Avatar>}
                                    title={<Link href="#">{item.name}</Link>}
                                    // description={item.department}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Layout.Sider>
        </Layout>
    );
}
