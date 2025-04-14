"use client";

import {
  AppstoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  Input,
  Layout,
  Radio,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewYearForm } from "./forms/newYear";
import { Palette } from "@/components/palette";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const router = useRouter();
  return (
    <Layout>
      <Layout.Content
        style={{
          padding: "0 32px 0 32px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
        className="px-4 md:px-8 bg-white"
      >
        <Layout.Header
          className="flex top-0 z-[1]"
          style={{ background: colorBgContainer, padding: 0 }}
        >
          <Space className="font-medium">
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Console d&apos;administration
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            { key: "years", label: "Années academiques" },
            { key: "users", label: "Comptes utilisateurs" },
          ]}
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
          <Table
            title={() => (
              <header className="flex  pb-3">
                <Space>
                  <Input.Search placeholder="Rechercher ..." />
                </Space>
                <div className="flex-1" />
                <Space>
                  <NewYearForm />{" "}
                  {/*  With Button to create a new academic year */}
                </Space>
              </header>
            )}
            columns={[
              {
                key: "name",
                dataIndex: "name",
                title: "Nom",
                render: (value, record, index) => {
                  return <Link href={`/console/${value}`}>{value}</Link>;
                },
              },
              {
                key: "startDate",
                dataIndex: "startDate",
                title: "Date de début",
              },
              { key: "endDate", dataIndex: "endDate", title: "Date de fin" },
              {
                key: "status",
                dataIndex: "status",
                title: "Status",
              },
              {
                key: "actions",
                dataIndex: "actions",
                title: "Actions",
                render: (value, record, index) => {
                  return (
                    <Space size="middle">
                      <Button
                        type="link"
                        title="Ajouter un membre du bureau"
                        onClick={() => {
                          router.push(`/console/${record.name}`);
                        }}
                      >
                        Gérer
                      </Button>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        title="Modifier l'année académique"
                      />
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: "duplicate",
                              label: "Dupliquer",
                              icon: <CopyOutlined />,
                            },
                            {
                              key: "delete",
                              label: "Supprimer",
                              icon: <DeleteOutlined />,
                              danger: true,
                            },
                          ],
                        }}
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          title="Ajouter un membre du bureau"
                        />
                      </Dropdown>
                    </Space>
                  );
                },
                width: 150,
              },
            ]}
            dataSource={[
              {
                name: "2023-2024",
                startDate: "2023-09-01",
                endDate: "2024-06-30",
                status: "En cours",
              },
              {
                name: "2022-2023",
                startDate: "2022-09-01",
                endDate: "2023-06-30",
                status: "Terminé",
              },
              {
                name: "2021-2022",
                startDate: "2021-09-01",
                endDate: "2022-06-30",
                status: "Terminé",
              },
              {
                name: "2020-2021",
                startDate: "2020-09-01",
                endDate: "2021-06-30",
                status: "Terminé",
              },
              {
                name: "2019-2020",
                startDate: "2019-09-01",
                endDate: "2020-06-30",
                status: "Terminé",
              },
              {
                name: "2018-2019",
                startDate: "2018-09-01",
                endDate: "2019-06-30",
                status: "Terminé",
              },
              {
                name: "2017-2018",
                startDate: "2017-09-01",
                endDate: "2018-06-30",
                status: "Terminé",
              },
              {
                name: "2016-2017",
                startDate: "2016-09-01",
                endDate: "2017-06-30",
                status: "Terminé",
              },
              {
                name: "2015-2016",
                startDate: "2015-09-01",
                endDate: "2016-06-30",
                status: "Terminé",
              },
              {
                name: "2014-2015",
                startDate: "2014-09-01",
                endDate: "2015-06-30",
                status: "Terminé",
              },
              {
                name: "2013-2014",
                startDate: "2013-09-01",
                endDate: "2014-06-30",
                status: "Terminé",
              },
              {
                name: "2012-2013",
                startDate: "2012-09-01",
                endDate: "2013-06-30",
                status: "Terminé",
              },
              {
                name: "2011-2012",
                startDate: "2011-09-01",
                endDate: "2012-06-30",
                status: "Terminé",
              },
              {
                name: "2010-2011",
                startDate: "2010-09-01",
                endDate: "2011-06-30",
                status: "Terminé",
              },
              {
                name: "2009-2010",
                startDate: "2009-09-01",
                endDate: "2010-06-30",
                status: "Terminé",
              },
              {
                name: "2008-2009",
                startDate: "2008-09-01",
                endDate: "2009-06-30",
                status: "Terminé",
              },
              {
                name: "2007-2008",
                startDate: "2007-09-01",
                endDate: "2008-06-30",
                status: "Terminé",
              },
            ]}
            rowKey="id"
            rowClassName={`bg-[#f5f5f5] odd:bg-white`}
            rowSelection={{
              type: "checkbox",
            }}
            size="small"
            pagination={{
              defaultPageSize: 25,
              pageSizeOptions: [25, 50, 75, 100],
              size: "small",
            }}
            bordered={false}
          />
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
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Profile de l'université
          </Typography.Title>
          <Button
              type="link"
              icon={<EditOutlined />}
              title="Modifier le profile"
            />
             
        </Flex>
        <Space
          direction="vertical"
          style={{
            padding: "40px 0 28px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Avatar
              src="https://images.pexels.com/photos/170809/pexels-photo-170809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Logo"
              style={{
                marginBottom: 28,
              }}
              size={100}
              shape="square"
            />
            <Typography.Title level={4}>UCBC</Typography.Title>
           
          </div>
          <Descriptions
            title="Détails"
            column={1}
            items={[
              {
                label: "Sigle",
                children: "CI-UCBC",
              },
              {
                label: "Nom",
                children: "Université Chrétienne Bilingue du Congo",
              },
              {
                label:"Devise",
                children: "Savoir et Foi",
              },
              {
                label: "Pays",
                children: "République Démocratique du Congo",
              },
              {
                label: "Province",
                children: "Nord-Kivu",
              },
              {
                label: "Ville",
                children: "Beni",
              },
              {
                label: "Adresse",
                children: "Beni, Nord-Kivu, République Démocratique du Congo",
              },
              {
                label: "Téléphone",
                children: "+243 999 123 456",
              },
              {
                label: "Email",
                children: "contact@ucbc.cd",
              },
              {
                label: "Site Web",
                children: (
                  <Link href="https://www.ucbc.cd" target="_blank">
                    www.ucbc.cd
                  </Link>
                ),
              },
              {
                label: "Année de création",
                children: "2007",
              },
              {
                label: "Statut",
                children: "Privée",
              },
              {
                label: "Accréditation",
                children: "Ministère de l'Enseignement Supérieur et Universitaire",
              },
              {
                label: "Type d'établissement",
                children: "Université",
              },
              {
                label: "Langue d'enseignement",
                children: "Français, Anglais",
              },
              
              {
                label: "Mission",
                children:
                  "Former des leaders chrétiens compétents et intègres pour transformer la société.",
              },
              {
                label: "Description",
                children:
                  "L'Université Chrétienne Bilingue du Congo (UCBC) est une institution académique qui vise à offrir une éducation de qualité tout en promouvant des valeurs chrétiennes pour le développement durable.",
              },
              {
                label: "Organisation mère",
                children: "Congo Initiative",
              },
            ]}
          />
        </Space>
      </Layout.Sider>
    </Layout>
  );
}
