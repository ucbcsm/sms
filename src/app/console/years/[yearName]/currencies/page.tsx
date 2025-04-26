"use client";

import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, List, Space, Switch } from "antd";

import Link from "next/link";

export default function Page() {
  return (
    <List
      dataSource={[
        {
          id: "1",
          name: "Dollar Américain",
          code: "USD",
          symbol: "$",
          status: "enabled",
        },
        {
          id: "3",
          name: "Franc Congolais",
          code: "CDF",
          symbol: "FC",
          status: "disabled",
        },
      ]}
      renderItem={(item, index) => (
        <List.Item
          key={item.id}
          extra={
            <Space>
              <Switch checked={item.status === "enabled" ? true : false} />

              {/* <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Modifier", icon: <EditOutlined /> },
                    {
                      key: "2",
                      label: "Supprimer",
                      danger: true,
                      icon: <DeleteOutlined />,
                    },
                  ],
                }}
              >
                <Button icon={<MoreOutlined />} type="text" />
              </Dropdown> */}
            </Space>
          }
        >
          <List.Item.Meta
            title={item.name}
            description={
              <>
                <div>Code: {item.code}</div>
                <div>Symbole: {item.symbol}</div>
              </>
            }
          />
        </List.Item>
      )}
    />
  );
}
