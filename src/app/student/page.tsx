"use client";

import {
  ApartmentOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  BranchesOutlined,
  MoreOutlined,
  RightOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Layout,
  List,
  Progress,
  Radio,
  Row,
  Space,
  Statistic,
  Tabs,
  theme,
  Typography,
} from "antd";
import Link from "next/link";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "4px 32px 32px 32px",
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
            <Typography.Title level={3}>Tableau de bord</Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<UserAddOutlined />}
              // variant="dashed"
              type="dashed"
              style={{ boxShadow: "none" }}
            >
              Inscrire
            </Button>
          </Space>
        </Layout.Header>
        <Flex vertical={true} gap={24}>
          <Card
            title="Statistiques"
            tabList={[
              { key: "1", label: "Etudiants" },
              { key: "2", label: "Enseignants" },
            ]}
            tabBarExtraContent={<Button type="link">Voir plus</Button>}
          >
            <Row gutter={24}>
              <Col span={6}>
                <Card>
                  <Flex>
                    <Statistic title="Année" value={"2024-2025"} />
                    <Progress
                      type="line"
                      percent={20}
                      style={{ position: "absolute", right: 16, width: 100 }}
                    />
                  </Flex>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic title="Etudiants" value={"345"} />
                    <Progress type="dashboard" percent={100} size={58} />
                  </Flex>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic title="Hommes" value={"200"} />
                    <Progress type="dashboard" percent={57.9} size={58} />
                  </Flex>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic title="Femmes" value={"145"} />
                    <Progress type="dashboard" percent={42.0} size={58} strokeColor="cyan" />
                  </Flex>
                </Card>
              </Col>
            </Row>
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
                key: "1",
                label: (
                  <>
                    Facultés <Badge count={4} color="green" />
                  </>
                ),
              },
              {
                key: "2",
                label: (
                  <>
                    Départements <Badge count={8} color="yellow" />
                  </>
                ),
              },
              {
                key: "3",
                label: (
                  <>
                    Filières <Badge count={11} color="blue" />
                  </>
                ),
              },
              {
                key: "4",
                label: (
                  <>
                    Candidature (s) en attente (s){" "}
                    <Badge count={41} color="red" />
                  </>
                ),
              },
            ]}
          >
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4].map((index) => (
                <Col key={index} span={8}>
                  <Card
                    title={`Faculté ${index}`}
                    extra={<Button type="text" ghost icon={<MoreOutlined />} />}
                    type="inner"
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Statistic
                          value={2}
                          title="Départements"
                          prefix={<ApartmentOutlined />}
                          // valueStyle={{ color: '#3f8600' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          value={103}
                          title="Etudiants"
                          prefix={<TeamOutlined />}
                          // valueStyle={{ color: '#cf1322' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          value={5}
                          title="Membres"
                          prefix={<UsergroupAddOutlined />}
                          // valueStyle={{ color: '#cf1322' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          value={30}
                          title="Enseignants"
                          prefix={<UsergroupAddOutlined />}
                          // valueStyle={{ color: '#3f8600' }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Flex>
      </Layout.Content>
      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorder}` }}
      >
        <Typography.Title level={5} className="pl-7 pt-3">Promotions</Typography.Title>
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
                        extra={
                          <Button type="text" ghost icon={<RightOutlined />} />
                        }
                      >
                        <List.Item.Meta
                          title={<Link href="">{item.name}</Link>}
                          description={
                            <Space>
                              <Badge
                                color="cyan"
                                size="small"
                                count="Effectif 21"
                              />
                              <Badge color="blue" size="small" count="12M" />
                              <Badge color="pink" size="small" count="9F" />
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
        {/* <Card
          title={<Statistic title="8" value="Promotions" />}
          variant="borderless"
          tabList={[
            { key: "1", label: "Licence" },
            { key: "2", label: "Master" },
            { key: "3", label: "Doctorat" },
          ]}
          style={{ padding:0, borderRadius: 0, boxShadow: "none" }}
        >
          <div className=" overflow-y-auto h-[calc(100vh-248px)]">
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
                extra={<Button type="text" ghost icon={<RightOutlined />} />}
              >
                <List.Item.Meta
                  title={<Link href="">{item.name}</Link>}
                  description={
                    <Space>
                      <Badge color="cyan" size="small" count="Effectif 21" />
                      <Badge color="blue" size="small" count="12M" />
                      <Badge color="pink" size="small" count="9F" />
                    </Space>
                  }
                />
                
              </List.Item>
            )}
          />
          </div>
        </Card> */}
      </Layout.Sider>
    </Layout>
  );
}