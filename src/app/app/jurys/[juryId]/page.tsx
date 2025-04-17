"use client";
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
import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import Link from "next/link";

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
              Nom du jury d&apos;évaluation
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabBarExtraContent={
            <Radio.Group>
              <Radio.Button value="grid">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="list">
                <UnorderedListOutlined />
              </Radio.Button>
            </Radio.Group>
          }
        >
          {/* Jury contents */}
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: " 24px 0",
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
          title="Membres du jury"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter un membre du jury"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Kahindo Lwanzo Alfred",
                role: "Président du Jury",
              },
              {
                id: "2",
                name: "Mumbere Katembo Jean",
                role: "Secrétaire",
              },
              {
                id: "3",
                name: "Kasereka Mwamba Paul",
                role: "Membre",
              },
              {
                id: "4",
                name: "Muhindo Kyavaghendi Sarah",
                role: "Membre",
              },
              {
                id: "5",
                name: "Kavira Bahati Marie",
                role: "Observateur",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item key={item.id} extra={<Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Modifier", icon:<EditOutlined/> },
                    { key: "2", label: "Retirer", danger: true, icon:<DeleteOutlined/> },
                  ],
                }}
              >
                <Button icon={<MoreOutlined />} type="text" />
              </Dropdown>}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={<Link href="#">{item.name}</Link>}
                  description={item.role}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
