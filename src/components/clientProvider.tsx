"use client";

import { useSessionStore } from "@/store";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider, ThemeConfig } from "antd";
import { NuqsAdapter } from "nuqs/adapters/next";
import { useEffect } from "react";
import NextTopLoader from 'nextjs-toploader';
import "dayjs/locale/fr";
import locale from "antd/es/locale/fr_FR";

const queryClient = new QueryClient();

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#008367",
  },
};

export default function ClientProvider({
  children,
  session,
}: Readonly<{ children: React.ReactNode; session: any }>) {
  const update = useSessionStore((state) => state.update);

  useEffect(() => {
    if (session) {
      update({ ...session });
    }
  }, []);


  return (
    <>
      <NextTopLoader
        color={themeConfig.token?.colorPrimary}
        showSpinner={false}
      />
      <NuqsAdapter>
        <ConfigProvider theme={themeConfig} locale={locale}>
          <AntdRegistry>
            <App>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </App>
          </AntdRegistry>
        </ConfigProvider>
      </NuqsAdapter>
    </>
  );
}
