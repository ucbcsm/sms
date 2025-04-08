"use client";
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  BorderOutlined,
  BranchesOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  ProfileOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  TagsOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Typography } from "antd";

export default function YearLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Sider
        width={260}
        style={{
        
          borderRight: `1px solid ${colorBorder}`,
          paddingTop:20,
          background: colorBgContainer,
          height:`calc(100vh - 64px)`,
          overflow:"auto"
        }}
      >
        <Layout style={{  }}>
          <Menu
            mode="inline"
            theme="light"
            style={{ height: "100%", borderRight: 0, }}
            items={[
              {
                key: "0",
                label: "Gestion Générale",
                type: "group",
                className:"uppercase", 
                children: [
                  {
                    key: "dashboard",
                    label: "Dashboard",
                    icon: <DashboardOutlined />,
                    className:"normal-case"
                  },
                  {
                    key: "2",
                    label: "Profile de l'université",
                    icon: <ProfileOutlined />,
                    className:"normal-case"
                  },
                  {
                    key: "3",
                    label: "Filières et promotions",
                    icon: <BranchesOutlined />,
                    className:"normal-case"
                  },
                ],
              },

              {
                key: "courseandtime",
                label: "Gestion des cours et du temps",
                type: "group",
                className:"uppercase",
                children: [
                  {
                    key: "course",
                    label: "Cours et programmes",
                    icon: <ReadOutlined />,
                    className:"normal-case"
                  },
                  {
                    key: "4",
                    label: "Périodes ou sessions",
                    icon: <ClockCircleOutlined />,
                    className:"normal-case"
                  },
                  {
                    key: "jurys",
                    label: "Jurys d'évaluations",
                    icon: <SafetyCertificateOutlined />,
                    className:"normal-case"
                  },
                ],
              },
              {
                key: "finances",
                label: "Gestion des frais",
                type: "group",
                className:"uppercase",
                children: [
                  {
                    key: "fees",
                    label: "Frais",
                    icon: <BorderOutlined />,
                    className:"normal-case"
                  },
                  {
                    key: "paymentmode",
                    label: "Modes de paiement",
                    icon: <ArrowRightOutlined />,
                    className:"normal-case"
                  },
                  {
                    key: "",
                    label: "Monnaies",
                    icon: <DollarCircleOutlined />,
                    className:"normal-case"
                  },
                ],
              },
              {
                key: "classrooms",
                label: "Gestion des salles de classe",
                type: "group",
                className:"uppercase",
                children: [
                  {
                    key: "class",
                    label: "Salles de classe",
                    icon: <TagsOutlined />,
                    className:"normal-case"
                  },
                ],
              },
              {
                key: "users",
                label: "Gestion des utilisateurs",
                type: "group",
                className:"uppercase",
                children: [
                  {
                    key: "tearchers",
                    label: "Enseignants (Staff)",
                    icon: <TeamOutlined />,
                    className:"normal-case"
                  },
                  {
                    key: "students",
                    label: "Etudiants",
                    icon: <UsergroupAddOutlined />,
                    className:"normal-case"
                  },
                ],
              },
            ]}
          />
          <Layout.Footer style={{padding:"20px 16px" , borderTop:`1px solid ${colorBorder}`, background: colorBgContainer,}}>
          <Typography.Text type="secondary">© 2025 CI-UCBC.</Typography.Text>
          {/* <Typography.Text type="secondary" style={{display:"block"}}>Tous droits réservés.</Typography.Text> */}
          
          </Layout.Footer>
        </Layout>
      </Layout.Sider>
      <Layout style={{ padding: "0 24px 24px", background:colorBgContainer }}>{children}</Layout>
    </Layout>
  );
}
