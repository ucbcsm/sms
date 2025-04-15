"use client";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { getHSLColor } from "@/lib/utils";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Dropdown,
  Flex,
  Layout,
  Progress,
  Row,
  Space,
  Statistic,
  theme,
  Typography,
} from "antd";

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
            <BackButton/>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Nom complet (étudiant)
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: "overview",
              label: "Aperçu",
            },
            {
              key: "courses",
              label: "Cours",
            },
            {
              key: "grades",
              label: "Notes",
            },
            {
              key: "attendances",
              label: "Présences",
            },
            {
              key: "fees",
              label: "Frais & Paiements",
            },
            {
              key: "documents",
              label: "Documents",
            },
            {
              key: "health",
              label: "Santé",
            },
            {
              key: "discipline",
              label: "Discipline",
            },
          ]}
          defaultActiveTabKey="overview"
          tabBarExtraContent={
            <Dropdown
              menu={{
              items: [
                { key: "form", label: "Fiche d'inscription" },
                { key: "card", label: "Carte d'étudiant" },
                { key: "transcript", label: "Relevé de notes" },
                { key: "certificate", label: "Certificat de scolarité" },
                { key: "schedule", label: "Attestation de fréquentation" },
              ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          }
        >
          <Row gutter={24}>
            <Col span={18}>
          <Row gutter={[24, 24]}>
          <Col span={8}>
              <Card>
                <Statistic title="Promotion actuelle" value="L2" />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Flex justify="space-between">
                  <Statistic title="Statut académique" value="Actif" />
                  <Progress type="dashboard" size={58} percent={100} />
                </Flex>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Flex justify="space-between">
                  <Statistic title="Moyenne générale" value="85" />
                  <Progress type="dashboard" percent={85} size={58} />
                </Flex>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Flex justify="space-between">
                  <Statistic title="Présences" value="95" />
                  <Progress
                    type="dashboard"
                    percent={95}
                    size={58}
                    strokeColor="red"
                  />
                </Flex>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Frais payés"
                  value={`${new Intl.NumberFormat("en", {
                    style: "currency",
                    currency: "USD",
                  }).format(200)} / ${new Intl.NumberFormat("en", {
                    style: "currency",
                    currency: "USD",
                  }).format(500)}`}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Dernière mise à jour"
                  value={`${new Intl.DateTimeFormat("fr", {
                    dateStyle: "long",
                  }).format(new Date())}`}
                />
              </Card>
            </Col>
            </Row>
            </Col>
            <Col span={6}>
              <Card>
                <Descriptions
                  title="Filières"
                  column={1}
                  items={[
                    {
                      key: "domaine",
                      label: "Domaine",
                      children: "Sciences et Technologies",
                    },
                    {
                      key: "faculte",
                      label: "Faculté",
                      children: "Faculté des Sciences Informatiques",
                    },
                    {
                      key: "departement",
                      label: "Département",
                      children: "Informatique",
                    },
                    {
                      key: "specialisation",
                      label: "Spécialisation",
                      children: "Développement Logiciel",
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
          <div></div>
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
            Profile
          </Typography.Title>
          <Button
            type="link"
            icon={<EditOutlined />}
            title="Modifier le profile"
          >
            Modifier
          </Button>
        </Flex>
        <Space
          direction="vertical"
          size="middle"
          style={{
            padding: "40px 0 28px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Avatar
              src="https://images.pexels.com/photos/11276496/pexels-photo-11276496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Avatar de l'étudiant"
              style={{
                marginBottom: 28,
              }}
              size={100}
            />
            <Typography.Title level={4}>Nom Etudiant</Typography.Title>
            <Typography.Text type="secondary">Matr. 20230001</Typography.Text>
          </div>
          <Descriptions
            title="Informations personnelles"
            column={1}
            items={[
              {
                key: "sex",
                label: "Sexe",
                children: "Masculin",
              },
              {
                key: "name",
                label: "Nom",
                children: "Kahindo",
              },
              {
                key: "postnom",
                label: "Postnom",
                children: "Lwanzo",
              },
              {
                key: "prenom",
                label: "Prénom",
                children: "Alfred",
              },
              {
                key: "email",
                label: "Email",
                children: (
                  <a href="mailto:john.doe@example.com">john.doe@example.com</a>
                ),
              },
              {
                key: "telephone",
                label: "Téléphone",
                children: <a href="tel:+243999999999">+243 999 999 999</a>,
              },
              {
                key: "lieu_naissance",
                label: "Lieu de naissance",
                children: "Bafwasende",
              },
              {
                key: "date_naissance",
                label: "Date de naissance",
                children: "01 Janvier 2000",
              },
              {
                key: "nationalite",
                label: "Nationalité",
                children: "Congo Kinshasa",
              },
              {
                key: "ville",
                label: "Ville",
                children: "Beni",
              },
              {
                key: "adresse",
                label: "Adresse",
                children: "123 Rue Exemple, Kinshasa",
              },
            ]}
          />

          <Descriptions
            title="Parents"
            column={1}
            items={[
              {
                key: "nom_pere",
                label: "Nom du père",
                children: "Kahindo Senior",
              },
              {
                key: "nom_mere",
                label: "Nom de la mère",
                children: "Lwanzo Marie",
              },
              {
                key: "contact_pere",
                label: "Contact du père",
                children: "+243 888 888 888",
              },
              {
                key: "contact_mere",
                label: "Contact de la mère",
                children: "+243 777 777 777",
              },
              {
                key: "adresse_parents",
                label: "Adresse des parents",
                children: "456 Rue Parentale, Goma",
              },
            ]}
          />

          <Descriptions
            title="Filières"
            column={1}
            items={[
              {
                key: "domaine",
                label: "Domaine",
                children: "Sciences et Technologies",
              },
              {
                key: "faculte",
                label: "Faculté",
                children: "Faculté des Sciences Informatiques",
              },
              {
                key: "departement",
                label: "Département",
                children: "Informatique",
              },
              {
                key: "specialisation",
                label: "Spécialisation",
                children: "Développement Logiciel",
              },
            ]}
          />

          <Descriptions
            // title={<Divider orientation="left" orientationMargin={0}>Camarades</Divider>}
            column={1}
            items={[
              {
                key: "friends",
                label: "",
                children: (
                  <Avatar.Group
                    size="large"
                    max={{
                      count: 5,
                      style: {
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                        cursor: "pointer",
                      },
                      popover: { trigger: "click" },
                    }}
                    style={{ marginTop: 16 }}
                  >
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    <Avatar style={{ backgroundColor: getHSLColor("K") }}>
                      K
                    </Avatar>
                    <Avatar style={{ backgroundColor: getHSLColor("M") }}>
                      M
                    </Avatar>
                    <Avatar style={{ backgroundColor: getHSLColor("S") }}>
                      S
                    </Avatar>
                    <Avatar style={{ backgroundColor: getHSLColor("P") }}>
                      P
                    </Avatar>
                    <Avatar style={{ backgroundColor: getHSLColor("R") }}>
                      R
                    </Avatar>
                    <Avatar style={{ backgroundColor: getHSLColor("Q") }}>
                      Q
                    </Avatar>
                    <Avatar style={{ backgroundColor: getHSLColor("J") }}>
                      J
                    </Avatar>
                  </Avatar.Group>
                ),
              },
            ]}
          />
        </Space>
      </Layout.Sider>
    </Layout>
  );
}
