"use client";

import { Palette } from "@/components/palette";
import {
  AppstoreOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
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
import Link from "next/link";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { StudentsStatistics } from "./statistics/students";
import { TeachersStatistics } from "./statistics/teachers";
import { FacultiesStatistics } from "./statistics/faculties";
import { DepartmentsStatistics } from "./statistics/departments";
import { EnrollmentsStatistics } from "./statistics/enrollments";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const [statTab, setStatTab] = useQueryState(
    "tab", parseAsStringEnum(["students","teachers"]).withDefault("students")
  );

  const [dashTab, setDashTab]=useQueryState("dash_tab", parseAsStringEnum(["faculty","department", "enrollment"]).withDefault("faculty"))

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
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Tableau de bord
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Flex vertical={true} gap={24}>
          <Card
            title="Statistiques"
            tabList={[
              { key: "students", label: "Etudiants" },
              { key: "teachers", label: "Enseignants" },
            ]}
            tabBarExtraContent={<Button type="link">Voir plus</Button>}
            onTabChange={(key) => {
              setStatTab(key as "teachers" |"students");
            }}
            activeTabKey={statTab}
          >
            {statTab === "teachers" ? (
              <TeachersStatistics />
            ) : (
              <StudentsStatistics />
            )}
          </Card>
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
                key: "faculty",
                label: (
                  <>
                    Facultés <Badge count={4} color="green" />
                  </>
                ),
              },
              {
                key: "department",
                label: (
                  <>
                    Départements <Badge count={8} color="blue" />
                  </>
                ),
              },
              {
                key: "enrollment",
                label: (
                  <>
                    Candidatures en attente <Badge count={41} color="red" overflowCount={9} />
                  </>
                ),
              },
            ]}
            activeTabKey={dashTab}
            onTabChange={(key)=>{
              setDashTab(key as "faculty"|"department"| "enrollment")
            }}
          >
            <div style={{display:dashTab==="faculty"?"block":"none"}}><FacultiesStatistics/></div>
            <div style={{display:dashTab==="department"?"block":"none"}}><DepartmentsStatistics/></div>
            <div style={{display:dashTab==="enrollment"?"block":"none"}}><EnrollmentsStatistics/></div>
          </Card>
        </Flex>
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
        <Flex
          justify="space-between"
          align="center"
          className="px-7 pt-3"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Promotions
          </Typography.Title>
          <Badge count={15} color="green" />
        </Flex>
        <Tabs
          tabBarStyle={{ paddingLeft: 28 }}
          items={[
            {
              key: "1",
              label: "Licence",
              children: (
                <div className=" overflow-y-auto h-[calc(100vh-170px)] pl-7 pb-7 pr-3">
                  <Input.Search
                    placeholder="Rechercher ..."
                    allowClear
                    onSearch={() => {}}
                    className="my-3"
                  />
                  <List
                    dataSource={[
                      { id: "1", name: "L1 Genie informatique" },
                      { id: "2", name: "L2 Electromecanique" },
                      { id: "3", name: "L3 Genie informatique" },
                      { id: "4", name: "L4 Genie informatique" },
                      { id: "5", name: "L2 Gestion informatique" },
                      { id: "6", name: "L1 Théologie" },
                      { id: "7", name: "L3 Communication" },
                      { id: "8", name: "L2 Théologie" },
                    ]}
                    renderItem={(item, index) => (
                      <List.Item
                        key={item.id}
                        extra={<Button type="text" icon={<RightOutlined />} />}
                      >
                        <List.Item.Meta
                          title={
                            <Link href={`/app/class/${item.id}`}>
                              {item.name}
                            </Link>
                          }
                          description={
                            <Space>
                              <Badge
                                color="cyan"
                                size="small"
                                count="21 Etudiants"
                              />
                              <Badge color="blue" size="small" count="12 H" />
                              <Badge color="pink" size="small" count="9 F" />
                            </Space>
                          }
                        />
                        {/* <div>Content</div> */}
                      </List.Item>
                    )}
                  />
                </div>
              ),
            },
            {
              key: "2",
              label: "Master",
              children: (
                <div className=" overflow-y-auto h-[calc(100vh-238px)] pl-7 pb-7 pr-3">
                  <Input.Search
                    placeholder="Rechercher ..."
                    allowClear
                    onSearch={() => {}}
                    className="my-3"
                  />
                </div>
              ),
            },
            {
              key: "3",
              label: "Doctorat",
              children: (
                <div className=" overflow-y-auto h-[calc(100vh-238px)] pl-7 pb-7 pr-3">
                  <Input.Search
                    placeholder="Rechercher ..."
                    allowClear
                    onSearch={() => {}}
                    className="my-3"
                  />
                </div>
              ),
            },
          ]}
        />
      </Layout.Sider>
    </Layout>
  );
}
