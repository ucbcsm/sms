"use client";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Flex,
  Input,
  Layout,
  List,
  Radio,
  Space,
  Tabs,
  theme,
  Typography,
} from "antd";
import { StudentsList } from "./list";
import {
  AppstoreOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ReapplyForm } from "./forms/reapply";
import { NewApplicationForm } from "./forms/new/new";

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
              Inscrire
            </Button>
          </Dropdown>
        </Flex>
        <Tabs
          tabBarStyle={{ paddingLeft: 28 }}
          items={[
            {
              key: "waiting",
              label: (
                <Badge count={41} color="red" overflowCount={9}>
                  En attentes
                </Badge>
              ),
              children: (
                <div
                  style={{
                    maxHeight: "calc(100vh - 182px)",
                    overflowY: "auto",
                    paddingLeft: 28,
                    paddingRight: 12,
                    paddingBottom: 28,
                  }}
                >
                  <Input
                    placeholder="Rechercher ..."
                    allowClear
                    className="mb-4 mt-2"
                    prefix={<SearchOutlined />}
                    variant="borderless"
                  />
                  <List
                    dataSource={[
                      {
                        id: "1",
                        name: "Kahindo Lwanzo Alfred Loopodia",
                        status: "En attente",
                        promotion: "L1 Génie Informatique",
                      },
                      {
                        id: "2",
                        name: "Mumbere Jean-Pierre",
                        status: "Accepté",
                        promotion: "M2 Mathématiques",
                      },
                      {
                        id: "3",
                        name: "Kasereka Marie",
                        status: "Rejeté",
                        promotion: "D1 Physique",
                      },
                      {
                        id: "4",
                        name: "Muhindo Patrick",
                        status: "En attente",
                        promotion: "L2 Chimie",
                      },
                      {
                        id: "5",
                        name: "Katembo Alice",
                        status: "Accepté",
                        promotion: "M1 Biologie",
                      },
                      {
                        id: "6",
                        name: "Baluku Jean",
                        status: "Rejeté",
                        promotion: "Licence en Histoire",
                      },
                      {
                        id: "7",
                        name: "Kyavaghendi Sarah",
                        status: "En attente",
                        promotion: "Master en Géographie",
                      },
                      {
                        id: "8",
                        name: "Nzanzu Emmanuel",
                        status: "Accepté",
                        promotion: "Doctorat en Philosophie",
                      },
                      {
                        id: "9",
                        name: "Kavugho Esther",
                        status: "Rejeté",
                        promotion: "Licence en Littérature",
                      },
                      {
                        id: "10",
                        name: "Masika Dorcas",
                        status: "En attente",
                        promotion: "Master en Économie",
                      },
                      {
                        id: "11",
                        name: "Kambale David",
                        status: "Accepté",
                        promotion: "Doctorat en Droit",
                      },
                      {
                        id: "12",
                        name: "Mughendi Grace",
                        status: "Rejeté",
                        promotion: "Licence en Psychologie",
                      },
                      {
                        id: "13",
                        name: "Kavira Judith",
                        status: "En attente",
                        promotion: "Master en Sociologie",
                      },
                      {
                        id: "14",
                        name: "Mumbere Samuel",
                        status: "Accepté",
                        promotion: "Doctorat en Informatique",
                      },
                      {
                        id: "15",
                        name: "Kasereka Joseph",
                        status: "Rejeté",
                        promotion: "Licence en Biotechnologie",
                      },
                      {
                        id: "16",
                        name: "Muhindo Rebecca",
                        status: "En attente",
                        promotion: "Master en Physique",
                      },
                      {
                        id: "17",
                        name: "Kahindo Emmanuel",
                        status: "Accepté",
                        promotion: "Doctorat en Chimie",
                      },
                      {
                        id: "18",
                        name: "Masika Florence",
                        status: "Rejeté",
                        promotion: "Licence en Biologie",
                      },
                      {
                        id: "19",
                        name: "Baluku Patrick",
                        status: "En attente",
                        promotion: "Master en Mathématiques",
                      },
                      {
                        id: "20",
                        name: "Kavugho Alice",
                        status: "Accepté",
                        promotion: "Doctorat en Histoire",
                      },
                    ]}
                    renderItem={(item, index) => (
                      <List.Item
                        key={item.id}
                        extra={
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: "3",
                                  label: "Voir",
                                  icon: <EyeOutlined />,
                                },
                                {
                                  key: "4",
                                  label: "Accepter",
                                  icon: <CheckOutlined />,
                                },
                                {
                                  key: "5",
                                  label: "Rejeter",
                                  icon: <CloseOutlined />,
                                },
                                {
                                  key: "1",
                                  label: "Modifier",
                                  icon: <EditOutlined />,
                                },
                                {
                                  key: "2",
                                  label: "Supprimer",
                                  icon: <DeleteOutlined />,
                                  danger: true,
                                },
                              ],
                            }}
                          >
                            <Button icon={<MoreOutlined />} type="text" />
                          </Dropdown>
                        }
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                            />
                          }
                          title={
                            <>
                              <Badge  color="green" count="New" >{item.name}</Badge>
                            </>
                          }
                          description={
                            <>
                              <Typography.Text type="danger">
                                En attente
                              </Typography.Text>{" "}
                              : {item.promotion}
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              ),
            },
            {
              key: "accepted",
              label: "Acceptées",
              children: (
                <div
                  style={{
                    maxHeight: "calc(100vh - 170px)",
                    overflowY: "auto",
                    paddingLeft: 28,
                    paddingRight: 12,
                  }}
                >
                  <Input.Search
                    placeholder="Rechercher ..."
                    allowClear
                    onSearch={() => {}}
                    className="my-3"
                  />
                  <List />
                </div>
              ),
            },
            {
              key: "rejected",
              label: "Rejetées",
              children: (
                <div
                  style={{
                    maxHeight: "calc(100vh - 170px)",
                    overflowY: "auto",
                    paddingLeft: 28,
                    paddingRight: 12,
                  }}
                >
                  <Input.Search
                    placeholder="Rechercher ..."
                    allowClear
                    onSearch={() => {}}
                    className="my-3"
                  />
                  <List />
                </div>
              ),
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
