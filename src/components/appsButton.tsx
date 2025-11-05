'use client';

import { useSessionStore } from "@/store";
import { RightOutlined } from "@ant-design/icons";
import { Button, List, Popover, Typography } from "antd";
import Link from "next/link";

export const AppsButton = () => {
  const session= useSessionStore();
    const appsIcon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <g fill="currentColor">
          <circle cx="6" cy="6" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="18" cy="12" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="12" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </g>
      </svg>
    );

    return (
      <Popover
        content={
          <div className="w-58">
            <List
              size="small"
              dataSource={session?.apps}
              renderItem={(app) => (
                <Link href={app.href} key={app.id}>
                  <List.Item
                    style={{ cursor: "pointer" }}
                    className=" hover:bg-[#f5f5f5] rounded-md"
                    extra={<RightOutlined/>}
                  >
                    <List.Item.Meta
                      title={app.name}
                      // description={app.description}
                      avatar={
                        <div
                          style={{
                            backgroundColor: app.color,
                            borderRadius: 4,
                            width: 32,
                            height: 32,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#fff",
                          }}
                        >
                          {app.icon}
                        </div>
                      }
                    />
                  </List.Item>
                </Link>
              )}
            />
          </div>
        }
        title={<Typography.Title level={5}>Apps</Typography.Title>}
        trigger="click"
      >
        <Button
          type="default"
          title="Applications"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 4,
            paddingRight: 4,
            boxShadow: "none",
          }}
        >
          {appsIcon}
        </Button>
      </Popover>
    );
}