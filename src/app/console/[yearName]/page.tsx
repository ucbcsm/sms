"use client";

import {
  AppstoreOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
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
import { useParams } from "next/navigation";
import { getHSLColor } from "@/lib/utils";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { yearName } = useParams();

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
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Détails de l'année académique
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          // title={<Descriptions items={[{key:"name",label:"Nom", children:yearName}]}/>}
          // extra={
          //   <Space>
          //     <Button
          //       icon={<EditOutlined />}
          //       type="primary"
          //       title="Ajouter un détail"
          //       style={{ boxShadow: "none" }}
          //     >
          //       Modifier
          //     </Button>
          //   </Space>
          // }
        >
          <List
            dataSource={[
              {
                id: "0",
                name: "Nom",
                description: `${yearName}`,
              },
              {
                id: "1",
                name: "Date de début",
                description: `${new Intl.DateTimeFormat("FR",{dateStyle:"full"}).format(new Date())}`,
              },
              {
                id: "2",
                name: "Date de fin",
                description: `${new Intl.DateTimeFormat("FR",{dateStyle:"full"}).format(new Date())}`,
              },
              {
                id: "3",
                name: "Status",
                description: "En cours",
              },
            ]}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => alert(`Modifier: ${item.name}`)}
                  >
                    Modifier
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  // avatar={<Avatar>{item.name.charAt(0).toUpperCase()}</Avatar>}
                  title={<Typography.Text strong>{item.name}</Typography.Text>}
                  description={item.description}
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

      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Card
          variant="borderless"
          title="Cycles organisés"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter un cycle"
              disabled
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Licence (L)",
                type: "Cycle de licence",
              },
              {
                id: "2",
                name: "Master (M)",
                type: "Cycle de master",
              },
              {
                id: "3",
                name: "Doctorat (D)",
                type: "Cycle de doctorat",
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
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar style={{background:getHSLColor(item.name)}}>{item.name.charAt(0).toUpperCase()}</Avatar>}
                  title={<Link href="#">{item.name}</Link>}
                  description={item.type}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
