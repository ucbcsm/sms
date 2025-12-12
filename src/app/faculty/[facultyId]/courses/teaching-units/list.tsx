import {
  Button,
  Card,
  Dropdown,
  Input,
  List,
  Skeleton,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { Cycle, TeachingUnit } from "@/types";
import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTeachingUnitCategoryName,
  getTeachingUnitCategoryTagColor,
  getTeachingUnitsByfaculty,
} from "@/lib/api";
import { NewTeachingUnitForm } from "./forms/new";
import { useParams } from "next/navigation";
import { DeleteTeachingUnitForm } from "./forms/delete";
import { EditTeachingUnitForm } from "./forms/edit";
import Search from "antd/es/transfer/search";

type ListItemProps = {
  item: TeachingUnit;
  cycles?: Cycle[];
  // departments?: Department[];
};
const ListItem: FC<ListItemProps> = ({ item, cycles }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <List.Item
      extra={
        <Space>
          <EditTeachingUnitForm
            teachingUnit={item}
            open={openEdit}
            setOpen={setOpenEdit}
            cycles={cycles}
            // departments={departments}
          />
          <DeleteTeachingUnitForm
            teachingUnit={item}
            open={openDelete}
            setOpen={setOpenDelete}
          />
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Modifier", icon: <EditOutlined /> },
                {
                  key: "delete",
                  label: "Supprimer",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
              onClick: ({ key }) => {
                if (key === "edit") {
                  setOpenEdit(true);
                } else if (key === "delete") {
                  setOpenDelete(true);
                }
              },
            }}
          >
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        </Space>
      }
    >
      <List.Item.Meta
        title={`${item.name} (${item.code})`}
        description={
          <Space>
            Categorie:
            <Tag
              color={getTeachingUnitCategoryTagColor(item.category)}
              variant="filled"
            >
              {getTeachingUnitCategoryName(item.category)}
            </Tag>
            {/* <Badge
              count={item.departement?.acronym}
              color={getHSLColor(`${item.departement?.name}`)}
            /> */}
          </Space>
        }
      />
    </List.Item>
  );
};

type ListTeachingUnitsProps = {
  cycles?: Cycle[];
};
export const ListTeachingUnits: FC<ListTeachingUnitsProps> = ({
  cycles,
}) => {
  const {token:{colorBgLayout, colorBgContainer}}=theme.useToken();

  const { facultyId } = useParams();
  const [searchResults, setSearchResults] = useState<
    TeachingUnit[] | undefined
  >();

  const { data: teaching_units, isPending } = useQuery({
    queryKey: ["teaching-units", facultyId],
    queryFn: ({ queryKey }) => getTeachingUnitsByfaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });



  return (
    <Card
      variant="borderless"
      loading={isPending}
      title={
        !isPending ? (
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            Unités d&apos;enseignements
          </Typography.Title>
        ) : (
          <Skeleton.Input size="small" active />
        )
      }
      style={{ boxShadow: "none", borderRadius: 0, background: colorBgLayout }}
      extra={teaching_units && <NewTeachingUnitForm cycles={cycles} />}
      styles={{
        header: {
          background: colorBgLayout,
          borderBottom: 0,
        },
        body: {
          height: `calc(100vh - 165px)`,
          overflow: "auto",
          // background: colorBgLayout,
          paddingTop: 12,
        },
      }}
    >
      <div>
        <List
          header={
            <div>
              <Input.Search
                placeholder="Rechercher une unité d'enseignement ..."
                onChange={(e) => {
                  const filtered = teaching_units?.filter(
                    (tu) =>
                      tu.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      tu.code
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                  );
                  setSearchResults(filtered);
                }}
                style={{ width: "100%" }}
                allowClear
              />
            </div>
          }
          dataSource={searchResults || teaching_units}
          size="small"
          bordered
          renderItem={(item) => (
            <ListItem
              key={item.id}
              item={item}
              cycles={cycles}
              // departments={departments}
            />
          )}
          style={{ background: colorBgContainer }}
        />
      </div>
    </Card>
  );
};
