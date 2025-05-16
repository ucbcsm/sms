"use client";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Layout,
  Radio,
  Space,
  Tabs,
  theme,
  Typography,
} from "antd";
import { StudentsList } from "./list";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ReapplyForm } from "./forms/reapply";
import { NewApplicationForm } from "./forms/new/new";
import { ListNewApplications } from "./lists/new_applications";
import { ListReApplications } from "./lists/reapplications";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const [reapply, setReapply] = useQueryState(
    "reapply",
    parseAsBoolean.withDefault(false)
  );
  const [newApplication, SetNewApplication] = useQueryState(
    "new",
    parseAsBoolean.withDefault(false)
  );

  return (
    <Layout>
      <Layout.Sider
        width={360}
        theme="light"
        style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
      >
        <Flex
          justify="space-between"
          align="center"
          className="px-7 pt-3"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}
        >
          <Typography.Title level={3} className="">
            Candidatures
          </Typography.Title>
          <Dropdown
            menu={{
              items: [
                {
                  key: "reapply",
                  label: "Réinscrire (Pour les anciens)",
                  icon: <UserOutlined />,
                },
                {
                  key: "newApplication",
                  label: "Nouvelle candidature",
                  icon: <UserAddOutlined />,
                },
              ],
              onClick: ({ key }) => {
                if (key === "reapply") {
                  setReapply(true);
                } else if (key === "newApplication") {
                  SetNewApplication(true);
                }
              },
            }}
          >
            <Button
              icon={<UserAddOutlined />}
              type="primary"
              style={{ boxShadow: "none" }}
              variant="dashed"
            >
              Ajouter
            </Button>
          </Dropdown>
        </Flex>
        <Tabs
          tabBarStyle={{ paddingLeft: 28 }}
          tabPosition="bottom"
          type="card"
          items={[
            {
              key: "waiting",
              label: "Nouveaux étudiants",
              children: <ListNewApplications />,
            },
            {
              key: "accepted",
              label: "Anciens étudiants",
              children: <ListReApplications />,
            },
          ]}
        />
        <ReapplyForm open={reapply} setOpen={setReapply} />
        <NewApplicationForm open={newApplication} setOpen={SetNewApplication} />
      </Layout.Sider>
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
              Etudiants
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
          tabList={[
            {
              key: "all",
              label: "Tous",
            },
            { key: "licence", label: "Licence" },
            { key: "master", label: "Master" },
            { key: "doctorat", label: "Doctorat" },
          ]}
        >
          <StudentsList />
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
    </Layout>
  );
}
