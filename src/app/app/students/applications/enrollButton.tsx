import {
  PlusCircleOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Dropdown } from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type EnrollButtonProps = {
  setReapply: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  SetNewApplication: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  SetNewFormer: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const EnrollButton: FC<EnrollButtonProps> = ({
  setReapply,
  SetNewApplication,
  SetNewFormer,
}) => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "newApplication",
            label: "Nouvelle candidature",
            icon: <UserAddOutlined />,
          },
          {
            key: "reapply",
            label: "Réinscription",
            icon: <UserOutlined />,
          },
          {
            key: "divider-1",
            type: "divider",
          },
          {
            key: "formerStudent",
            label: "Enregistrement",
            icon: <PlusCircleOutlined />,
            extra: <Badge count="Ancien étudiant" />,
          },
        ],
        onClick: ({ key }) => {
          if (key === "reapply") {
            setReapply(true);
          } else if (key === "newApplication") {
            SetNewApplication(true);
          } else if (key === "formerStudent") {
            SetNewFormer(true);
          }
        },
      }}
    >
      <Button
        icon={<UserAddOutlined />}
        color="primary"
        style={{ boxShadow: "none" }}
        variant="solid"
      >
        Inscrire
      </Button>
    </Dropdown>
  );
};
