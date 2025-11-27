import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Select,
  message,
  Space,
  Typography,
  theme,
  Table,
  Flex,
  Upload,
  Modal,
  Alert,
  Tabs,
  Tooltip,
  Radio,
  Divider,
  InputNumber,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BulkStudentItem, Class, Cycle, Department, Faculty } from "@/types";
import {
  createBulkStudents,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  importStudentsFromExcel,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filterOption, getMaritalStatusName } from "@/lib/utils";

type ImportStudentsDataDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cycles?: Cycle[];
  faculties?: Faculty[];
  departments?: Department[];
  classes?: Class[];
  yearId: number;
};

type FormDataType = {
  cycle_id: number;
  field_id: number;
  faculty_id: number;
  departement_id: number;
};

export const ImportStudentsDataDrawer: FC<ImportStudentsDataDrawerProps> = ({
  open,
  setOpen,
  departments,
  faculties,
  cycles,
  yearId,
  classes,
}) => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [openCancelForm, setOpenCancelForm] = useState<boolean>(false);
  const [newStudentItems, setNewStudentItems] = useState<
    | {
        sheetName: string;
        cycleId: number;
        fieldId: number;
        facultyId: number;
        departmentId: number;
        classYearId: number;
        students: BulkStudentItem[];
      }[]
    | undefined
  >();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createBulkStudents,
  });

  const onClose = () => {
    setOpen(false);
    setNewStudentItems(undefined);
    form.resetFields();
  };

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    try {
      const importedData = await importStudentsFromExcel(file);
      setNewStudentItems(importedData);

      form.setFieldsValue({
        faculty_id: importedData[0].facultyId,
        departement_id: importedData[0].departmentId,
        cycle_id: importedData[0].cycleId,
        field_id: importedData[0].fieldId,
      });

      messageApi.success("Fichier importé avec succès !");
    } catch (error) {
      messageApi.error("Erreur lors de l'import du fichier.");
    }
    return false; // Prevent upload
  };

  const handleFinish = (values: FormDataType) => {
    if (newStudentItems && newStudentItems.length > 0) {
        const studentsData = newStudentItems.map((item) => ({
          class_year: item.classYearId,
          students: item.students,
        }));
        mutateAsync(
          {
            academic_year: yearId,
            cycle: values.cycle_id,
            field: values.field_id,
            faculty: values.faculty_id,
            departement: values.departement_id,
            data: studentsData,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["students"],
              });
              messageApi.success("Importation des étudiants réussie !");
              onClose();
            },
            onError: (error: Error) => {
              messageApi.error(
                (error as any)?.response?.data?.message ||
                  "Erreur lors de l'importation des étudiants."
              );
            },
          }
        );
    } else {
      messageApi.error("Aucun étudiant à importer.");
    }
  };


  const removeStudent = (matricule: string) => {
    // const updatedItems = newStudentItems?.filter(
    //     (item) => item.matricule !== matricule
    // );
    // setNewStudentItems(updatedItems);
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title={
          <Flex align="center" gap={8}>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              Import des données étudiants depuis un fichier .xlsx
            </Typography.Title>
            <div className="flex-1" />
            <Button
              onClick={() => setOpenCancelForm(true)}
              type="text"
              icon={<CloseOutlined />}
              disabled={isPending}
            />
          </Flex>
        }
        destroyOnHidden
        onClose={onClose}
        closable={false}
        maskClosable={false}
        width={`100%`} //calc(100% - 362px)
        styles={{
          //   header: { background: colorPrimary, color: "#fff" },
          body: { background: colorBgLayout },
        }}
        footer={
          <Flex
            justify="space-between"
            style={{
              padding: "12px 24px",
            }}
          >
            <Typography.Title
              type="secondary"
              level={5}
              style={{ marginBottom: 0 }}
            >
              {/* {newStudentItems?.length || 0} étudiant(s) à importer */}
            </Typography.Title>
            <Space>
              <Button
                onClick={() => setOpenCancelForm(true)}
                style={{ boxShadow: "none" }}
                disabled={
                  isPending || !newStudentItems || newStudentItems.length === 0
                }
              >
                Annuler
              </Button>
              <Modal
                title="Annuler l'importation des étudiants"
                centered
                open={openCancelForm}
                destroyOnHidden
                onOk={() => {
                  setOpenCancelForm(false);
                  onClose();
                }}
                onCancel={() => setOpenCancelForm(false)}
                cancelText="Retour"
                okText="Confirmer"
                okType="danger"
                cancelButtonProps={{
                  style: { boxShadow: "none" },
                }}
                okButtonProps={{
                  style: { boxShadow: "none" },
                  type: "primary",
                }}
              >
                <Alert
                  message="Attention !"
                  description="En confirmant, vous annulerez l'importation en cours. Toutes les données étudiants de cette importation seront perdues."
                  type="warning"
                  showIcon
                  style={{ border: 0, marginBottom: 16 }}
                />
              </Modal>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{ boxShadow: "none" }}
                icon={<CheckCircleOutlined />}
                disabled={
                  isPending || !newStudentItems || newStudentItems.length === 0
                }
                loading={isPending}
              >
                Importer les étudiants
              </Button>
            </Space>
          </Flex>
        }
      >
        <Form
          key="bulk_students_import_form"
          form={form}
          name="bulk_students_import_form"
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{}}
        >
          <Form.Item style={{ marginBottom: newStudentItems ? 16 : 0 }}>
            <Upload.Dragger
              accept=".xlsx"
              beforeUpload={handleFileUpload}
              showUploadList={false}
              maxCount={1}
              style={{ padding: 12 }}
            >
              <div
                style={{
                  minHeight: 100,
                  height: newStudentItems ? "auto" : `calc(100vh - 244px)`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 32, color: "GrayText" }} />
                </p>
                <p className="ant-upload-text">
                  Cliquez ou glissez-déposez un fichier XLSX ici pour
                  l&apos;importer
                </p>
                <p className="ant-upload-hint">
                  Seuls les fichiers .xlsx sont acceptés. Le fichier doit
                  contenir les étudiants d&apos;une même filière et mention.
                </p>
              </div>
            </Upload.Dragger>
          </Form.Item>

          {newStudentItems && (
            <>
              <header className="flex pb-1">
                <Space>
                  <Typography.Title
                    type="secondary"
                    level={5}
                    style={{
                      marginBottom: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    Aperçu des données à importer
                  </Typography.Title>
                </Space>
                <div className="flex-1" />
                <Space>
                  <Form.Item
                    label="Cycle"
                    name="cycle_id"
                    rules={[{ required: true, message: "Ce champ est requis" }]}
                    layout="horizontal"
                    style={{ marginBottom: 0 }}
                  >
                    <Radio.Group
                      options={getCurrentCyclesAsOptions(cycles)}
                      disabled
                    />
                  </Form.Item>
                  <Form.Item
                    label="Domaine"
                    name="field_id"
                    rules={[{ required: true, message: "Ce champ est requis" }]}
                    layout="horizontal"
                    style={{ marginBottom: 0 }}
                    hidden
                  >
                    <InputNumber placeholder="Domaine" disabled />
                  </Form.Item>
                  <Divider type="vertical" />
                  <Form.Item
                    label="Filière"
                    name="faculty_id"
                    rules={[{ required: true, message: "Ce champ est requis" }]}
                    layout="horizontal"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      options={getCurrentFacultiesAsOptions(faculties)}
                      showSearch
                      filterOption={filterOption}
                      placeholder="Filière"
                      disabled
                    />
                  </Form.Item>
                  <Divider type="vertical" />
                  <Form.Item
                    name="departement_id"
                    label="Mention"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner le département",
                      },
                    ]}
                    layout="horizontal"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      placeholder="Département"
                      options={getCurrentDepartmentsAsOptions(departments)}
                      showSearch
                      disabled
                    />
                  </Form.Item>
                </Space>
              </header>

              <Tabs
                items={newStudentItems.map((item, index) => ({
                  key: `${item.classYearId}`,
                  label: classes?.find((c) => c.id === item.classYearId)
                    ?.acronym, //item.classYearId
                  closable: true,
                  children: (
                    <Table
                      dataSource={item.students}
                      columns={[
                        {
                          key: "number",
                          render: (_, __, index) => index + 1,
                          width: 42,
                          align: "right",
                          fixed: "left",
                        },
                        {
                          key: "matricule",
                          dataIndex: "matricule",
                          title: "Matricule",
                          width: 96,
                          align: "right",
                          fixed: "left",
                        },
                        {
                          key: "surname",
                          dataIndex: "surname",
                          title: "Surnom",
                          ellipsis: true,
                          width: 120,
                          fixed: "left",
                        },
                        {
                          key: "last_name",
                          dataIndex: "last_name",
                          title: "Nom",
                          ellipsis: true,
                          width: 120,
                          fixed: "left",
                        },
                        {
                          key: "first_name",
                          dataIndex: "first_name",
                          title: "Prénom",
                          ellipsis: true,
                          width: 120,
                          fixed: "left",
                        },
                        {
                          key: "gender",
                          dataIndex: "gender",
                          title: "Genre",
                          width: 80,
                        },
                        {
                          key: "place_of_birth",
                          dataIndex: "place_of_birth",
                          title: "Lieu de naissance",
                          ellipsis: true,
                          width: 140,
                        },
                        {
                          key: "date_of_birth",
                          dataIndex: "date_of_birth",
                          title: "Date de naissance",
                          render: (value) => {
                            if (!value) return "";
                            const date = new Date(value);
                            return date.toLocaleDateString("fr-FR");
                          }
                          //   width: 130,
                        },
                        {
                          key: "nationality",
                          dataIndex: "nationality",
                          title: "Nationalité",
                          ellipsis: true,
                          width: 100,
                        },
                        {
                          key: "marital_status",
                          dataIndex: "marital_status",
                          title: "État civil",
                          ellipsis: true,
                          render: (value) => getMaritalStatusName(value),
                          width: 100,
                        },
                        {
                          key: "physical_ability",
                          dataIndex: "physical_ability",
                          title: "Aptitude physique",
                          ellipsis: true,
                          render: (value) => {
                            if (value === "normal") {
                              return "Normal";
                            } else if (value === "disabled") {
                              return "Handicapé";
                            } else {
                              return "";
                            }
                          },
                          width: 120,
                        },
                        {
                          key: "religious_affiliation",
                          dataIndex: "religious_affiliation",
                          title: "Affiliation religieuse",
                          ellipsis: true,
                          width: 150,
                        },
                        {
                          key: "spoken_language",
                          dataIndex: "spoken_language",
                          title: "Langue parlée",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "email",
                          dataIndex: "email",
                          title: "Email",
                          ellipsis: true,
                          width: 200,
                        },
                        {
                          key: "phone_number_1",
                          dataIndex: "phone_number_1",
                          title: "Téléphone 1",
                          width: 120,
                        },
                        {
                          key: "phone_number_2",
                          dataIndex: "phone_number_2",
                          title: "Téléphone 2",
                          width: 120,
                        },
                        {
                          key: "father_name",
                          dataIndex: "father_name",
                          title: "Nom du père",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "father_phone_number",
                          dataIndex: "father_phone_number",
                          title: "Tél. père",
                          width: 100,
                        },
                        {
                          key: "mother_name",
                          dataIndex: "mother_name",
                          title: "Nom de la mère",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "mother_phone_number",
                          dataIndex: "mother_phone_number",
                          title: "Tél. mère",
                          width: 100,
                        },
                        {
                          key: "country_of_origin",
                          dataIndex: "country_of_origin",
                          title: "Pays d'origine",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "province_of_origin",
                          dataIndex: "province_of_origin",
                          title: "Province d'origine",
                          ellipsis: true,
                          width: 140,
                        },
                        {
                          key: "territory_or_municipality_of_origin",
                          dataIndex: "territory_or_municipality_of_origin",
                          title: "Ville ou Territoire d'origine",
                          ellipsis: true,
                          width: 180,
                        },
                        {
                          key: "is_foreign_registration",
                          dataIndex: "is_foreign_registration",
                          title: "Est il étranger",
                          //   width: 140,
                          render: (value) => (value ? "Oui" : "Non"),
                        },
                        {
                          key: "current_city",
                          dataIndex: "current_city",
                          title: "Ville actuelle",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "current_municipality",
                          dataIndex: "current_municipality",
                          title: "Commune actuelle",
                          ellipsis: true,
                          width: 140,
                        },
                        {
                          key: "current_neighborhood",
                          dataIndex: "current_neighborhood",
                          title: "Adresse actuelle",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "name_of_secondary_school",
                          dataIndex: "name_of_secondary_school",
                          title: "École secondaire",
                          ellipsis: true,
                          width: 140,
                        },
                        {
                          key: "country_of_secondary_school",
                          dataIndex: "country_of_secondary_school",
                          title: "Pays de l'école",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "province_of_secondary_school",
                          dataIndex: "province_of_secondary_school",
                          title: "Province de l'école",
                          ellipsis: true,
                          width: 140,
                        },
                        {
                          key: "territory_or_municipality_of_school",
                          dataIndex: "territory_or_municipality_of_school",
                          title: "Territoire/Municipalité",
                          ellipsis: true,
                          width: 160,
                        },
                        {
                          key: "section_followed",
                          dataIndex: "section_followed",
                          title: "Section suivie",
                          ellipsis: true,
                          width: 120,
                        },
                        {
                          key: "year_of_diploma_obtained",
                          dataIndex: "year_of_diploma_obtained",
                          title: "Année du diplôme",
                          //   width: 120,
                        },
                        {
                          key: "diploma_number",
                          dataIndex: "diploma_number",
                          title: "Numéro du diplôme",
                          ellipsis: true,
                          width: 140,
                        },
                        {
                          key: "diploma_percentage",
                          dataIndex: "diploma_percentage",
                          title: "Pourcentage diplôme",
                          render: (value) => (value !== 0 ? value : ""),
                          //   width: 140,
                        },
                        {
                          key: "professional_activity",
                          dataIndex: "professional_activity",
                          title: "Activité professionnelle",
                          ellipsis: true,
                          width: 160,
                        },
                        {
                          key: "actions",
                          title: "",
                          render: (_, record) => (
                            <Tooltip title="Supprimer de la liste">
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                // onClick={() => removeStudent(record.matricule)}
                                disabled={isPending}
                              />
                            </Tooltip>
                          ),
                          width: 52,
                          align: "center",
                          fixed: "right",
                        },
                      ]}
                      size="small"
                      pagination={false}
                      scroll={{ x: "max-content", y: "calc(100vh - 498px)" }}
                      rowKey="matricule"
                    />
                  ),
                }))}
              />
            </>
          )}
        </Form>
      </Drawer>
    </>
  );
};
