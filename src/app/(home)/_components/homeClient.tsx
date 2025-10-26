"use client";

import Link from "next/link";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Empty,
  Image,
  Layout,
  Space,
  theme,
  Typography,
} from "antd";
import { FC } from "react";
import { AppItem } from "@/types";
import { useInstitution } from "@/hooks/use-institution";
import { SupportDrawer } from "@/components/support-drawer";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { UserProfileButton } from "@/components/userProfileButton";
import { AppsButton } from "@/components/appsButton";
import { Palette } from "@/components/palette";

type HomeClientProps = {
  visibleApps: AppItem[];
  userRoles: { id: number; name: string }[];
};

export const HomeClient: FC<HomeClientProps> = ({ visibleApps, userRoles }) => {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { data: institution } = useInstitution();

  return (
    <main className="min-h-screen ">
      <Layout>
        <Layout.Header
          style={{
            background: colorBgContainer,
            borderBottom: `1px solid ${colorBorderSecondary}`,
            paddingLeft: 32,
            paddingRight: 32,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Space>
            <Link href={`/`} style={{ display: "flex", alignItems: "center" }}>
              <div className="flex items-center pr-3">
                <Image
                  src={institution?.logo || "/ucbc-logo.png"}
                  alt="Logo"
                  width={36}
                  height="auto"
                  preview={false}
                />
              </div>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {institution?.acronym}
              </Typography.Title>
            </Link>
            <Divider type="vertical" />
            <Typography.Text type="secondary">Apps</Typography.Text>
          </Space>
          <div className="flex-1" />
          <Space>
            <LanguageSwitcher />
            <SupportDrawer />
            <AppsButton />
            <UserProfileButton />
          </Space>
        </Layout.Header>
        <Layout.Content style={{ background: colorBgContainer }}>
          <div className="pt-6 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="">
              <header className="mb-8 ">
                <Typography.Title level={3} style={{ marginBottom: 0 }}>
                  Applications disponibles
                </Typography.Title>
                <Typography.Text
                  type="secondary"
                  className="mt-2 text-sm text-gray-600"
                >
                  D&apos;après vos rôles, voici les applications auxquelles vous
                  avez accès.
                </Typography.Text>
                {/* <div className="mt-4 flex flex-wrap gap-2">
                {userRoles.map((r) => (
                  <span
                    key={r.id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {roleLabel(r.name)}
                  </span>
                ))}
              </div> */}
              </header>

              <section aria-labelledby="apps-heading">
                <h2 id="apps-heading" className="sr-only">
                  Applications disponibles
                </h2>

                {visibleApps.length === 0 ? (
                  <Card className="">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Aucune application disponible pour votre profil."
                    />
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visibleApps.map((app) => (
                      <Link key={app.id} href={app.href} className="group">
                        <Card>
                          <article className="relative h-full flex flex-col">
                            <div className="flex items-start justify-between gap-4 ">
                              <Avatar
                                icon={app.icon}
                                size={48}
                                shape="square"
                                style={{ background: app.color }}
                              />
                              {/* <div
                                className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg ${app.color} bg-opacity-100`}
                              >
                                {app.icon}
                              </div> */}
                              <div className=" ml-3 flex-1 min-w-0 ">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {app.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                  {app.description}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3">
                              <div className="flex flex-wrap gap-2">
                                {/* {app.roles.map((role) => (
                              <span
                                key={role}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {roleLabel(role)}
                              </span>
                            ))} */}
                              </div>

                              <Button
                                color="primary"
                                variant="dashed"
                                className="group-hover:underline"
                                style={{ boxShadow: "none" }}
                              >
                                Ouvrir →
                              </Button>
                            </div>

                            {/* subtle focus ring for keyboard users */}
                            <span className="absolute inset-0 rounded-xl ring-0 focus-within:ring-2 focus-within:ring-indigo-400" />
                          </article>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
              <div className="flex mt-7 md:mt-16 justify-between items-center">
                <Typography.Text type="secondary">
                  © {new Date().getFullYear()} {institution?.acronym}. Tous
                  droits réservés.
                </Typography.Text>
                <Palette />
              </div>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </main>
  );
};
