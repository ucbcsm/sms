"use client";

import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import { Application } from "@/types";
import { getApplicationStatusName, getApplicationTagColor } from "@/lib/api";
import { Avatar, Flex, List, Tag, theme, Typography } from "antd";
import { FC } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import Link from "next/link";

type ListItemApplicationProps = {
  item: Application;
};

export const ListItemApplication: FC<ListItemApplicationProps> = ({ item }) => {
  const {
    token: { colorBgTextHover },
  } = theme.useToken();

  const [view, setView] = useQueryState("view", parseAsInteger.withDefault(0));

  return (
    
    <List.Item
      style={{
        background: item.id === view ? colorBgTextHover : "",
        cursor: "pointer",
      }}
      onClick={() => {
        setView(item.id);
      }}
      className=" hover:bg-gray-50 rounded-md"
    >
      <List.Item.Meta
        avatar={
          <Avatar
            src={getPublicR2Url(item.avatar)}
            style={{
              backgroundColor: getHSLColor(
                `${item.surname} ${item.last_name} ${item.first_name}`
              ),
            }}
          >
            {item.first_name?.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography.Text>
            {item.surname} {item.last_name} {item.first_name}
          </Typography.Text>
        }
        description={
          <Flex justify="space-between">
            {item.class_year?.acronym || ""} {item.departement.name}
            <Tag
              color={getApplicationTagColor(item.status || "")}
              style={{ marginRight: 0 }}
              bordered={false}
            >
              {getApplicationStatusName(`${item.status}`)}
            </Tag>
          </Flex>
        }
      />
    </List.Item>
  );
};
