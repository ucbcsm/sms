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
} from "antd";
import {
    UploadOutlined,
    CheckCircleOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { BulkStudentItem } from "@/types";
import {
    createBulkStudents,
    importStudentsFromExcel,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ImportStudentsDataDrawerProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    academicYearId?: number;
    departmentId?: number;
};

type FormDataType = {
    academic_year: number;
    department: number;
};

export const ImportStudentsDataDrawer: FC<
    ImportStudentsDataDrawerProps
> = ({ open, setOpen, academicYearId, departmentId }) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [openCancelForm, setOpenCancelForm] = useState<boolean>(false);
    const [newStudentItems, setNewStudentItems] = useState<
        BulkStudentItem[] | undefined
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
            messageApi.success("Fichier importé avec succès !");
        } catch (error) {
            messageApi.error("Erreur lors de l'import du fichier.");
        }
        return false; // Prevent upload
    };

    const handleFinish = (values: FormDataType) => {
        if (newStudentItems && newStudentItems.length > 0) {
            // mutateAsync(
            //     {
            //         academicYearId: values.academic_year,
            //         departmentId: values.department,
            //         students: newStudentItems,
            //     },
            //     {
            //         onSuccess: () => {
            //             queryClient.invalidateQueries({
            //                 queryKey: ["students"],
            //             });
            //             messageApi.success("Importation des étudiants réussie !");
            //             onClose();
            //         },
            //         onError: (error: Error) => {
            //             messageApi.error(
            //                 (error as any)?.response?.data?.message ||
            //                     "Erreur lors de l'importation des étudiants."
            //             );
            //         },
            //     }
            // );
        } else {
            messageApi.error("Aucun étudiant à importer.");
        }
    };

    const removeStudent = (matricule: string) => {
        const updatedItems = newStudentItems?.filter(
            (item) => item.matricule !== matricule
        );
        setNewStudentItems(updatedItems);
    };

    return (
        <>
            {contextHolder}
            <Drawer
                open={open}
                title={
                    <Flex align="center" gap={8}>
                        <Typography.Title
                            level={4}
                            style={{ marginBottom: 0, color: "#fff" }}
                        >
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
                width={`calc(100% - 362px)`}
                styles={{ header: { background: colorPrimary, color: "#fff" } }}
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
                            {newStudentItems?.length || 0} étudiant(s) à importer
                        </Typography.Title>
                        <Space>
                            <Button
                                onClick={() => setOpenCancelForm(true)}
                                style={{ boxShadow: "none" }}
                                disabled={
                                    isPending ||
                                    !newStudentItems ||
                                    newStudentItems.length === 0
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
                                    isPending ||
                                    !newStudentItems ||
                                    newStudentItems.length === 0
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
                    initialValues={{
                        academic_year: academicYearId,
                        department: departmentId,
                    }}
                >
                    <Form.Item
                        style={{ marginBottom: newStudentItems ? 16 : 0 }}
                    >
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
                                    height: newStudentItems
                                        ? "auto"
                                        : `calc(100vh - 244px)`,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <UploadOutlined style={{ fontSize: 32, color: "GrayText" }} />
                                </p>
                                <p className="ant-upload-text">
                                    Cliquez ou glissez-déposez un fichier XLSX ici pour l&apos;importer
                                </p>
                                <p className="ant-upload-hint">
                                    Seuls les fichiers .xlsx sont acceptés. Le fichier doit contenir les colonnes : Matricule, Prénom, Nom, Surnom, Email, etc.
                                </p>
                            </div>
                        </Upload.Dragger>
                    </Form.Item>
                    
                    {newStudentItems && (
                        <Table
                            title={() => (
                                <header className="flex pb-1 px-2">
                                    <Space>
                                        <Typography.Title
                                            type="secondary"
                                            level={5}
                                            style={{ marginBottom: 0, textTransform: "uppercase" }}
                                        >
                                            Aperçu des données étudiants
                                        </Typography.Title>
                                    </Space>
                                    <div className="flex-1" />
                                    <Space>
                                        <Form.Item
                                            name="academic_year"
                                            label="Année académique"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Veuillez sélectionner l'année académique",
                                                },
                                            ]}
                                            layout="horizontal"
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Select
                                                variant="filled"
                                                placeholder="Année académique"
                                                style={{ width: 150 }}
                                                // You'll need to populate this with actual academic years
                                                options={[
                                                    { value: 1, label: "2023-2024" },
                                                    { value: 2, label: "2024-2025" },
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="department"
                                            label="Département"
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
                                                variant="filled"
                                                placeholder="Département"
                                                style={{ width: 150 }}
                                                // You'll need to populate this with actual departments
                                                options={[
                                                    { value: 1, label: "Informatique" },
                                                    { value: 2, label: "Mathématiques" },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Space>
                                </header>
                            )}
                            dataSource={newStudentItems}
                            columns={[
                                {
                                    key: "matricule",
                                    dataIndex: "matricule",
                                    title: "Matricule",
                                    width: 96,
                                    align: "center",
                                    render: (matricule) => matricule?.toString().padStart(6, "0"),
                                },
                                {
                                    key: "first_name",
                                    dataIndex: "first_name",
                                    title: "Prénom",
                                    ellipsis: true,
                                },
                                {
                                    key: "last_name",
                                    dataIndex: "last_name", 
                                    title: "Nom",
                                    ellipsis: true,
                                },
                                {
                                    key: "surname",
                                    dataIndex: "surname",
                                    title: "Surnom",
                                    ellipsis: true,
                                },
                                {
                                    key: "email",
                                    dataIndex: "email",
                                    title: "Email",
                                    ellipsis: true,
                                },
                                {
                                    key: "phone",
                                    dataIndex: "phone",
                                    title: "Téléphone",
                                    width: 120,
                                },
                                {
                                    key: "actions",
                                    title: "Actions",
                                    render: (_, record) => (
                                        <Button
                                            type="text"
                                            danger
                                            size="small"
                                            onClick={() => removeStudent(record.matricule)}
                                            disabled={isPending}
                                        >
                                            Supprimer
                                        </Button>
                                    ),
                                    width: 100,
                                },
                            ]}
                            size="small"
                            pagination={false}
                            scroll={{ y: "calc(100vh - 454px)" }}
                            rowKey="matricule"
                        />
                    )}
                </Form>
            </Drawer>
        </>
    );
};
