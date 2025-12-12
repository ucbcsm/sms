"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Space,
  Input,
  Radio,
  DatePicker,
  Select,
  Typography,
  Flex,
  Divider,
  Checkbox,
  InputNumber,
  Badge,
  Alert,
  Card,
  Layout,
  Result,
  Dropdown,
  Switch,
  Spin,
  Tag,
  App,
  Table,
} from "antd";
import {
  BulbOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileOutlined,
  HourglassOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Application,
  ApplicationEditFormDataType,
  Class,
  Cycle,
  Department,
  Faculty,
  Field,
  RequiredDocument,
  TestCourse,
  TestResult,
} from "@/types";
import { Palette } from "@/components/palette";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  formatAdmissionTestResultsForEdition,
  formatApplicationDocumentsForEdition,
  formatEnrollmentQuestionResponseForEdition,
  getApplicationStatusAlertType,
  getApplicationStatusAsOptions,
  getApplicationStatusName,
  getApplicationTagColor,
  getCurrentClassesAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
  getTestCoursesByFacAsOptions,
  parseLanguages,
  updateApplication,
} from "@/lib/api";
import { countries } from "@/lib/data/countries";
import dayjs from "dayjs";
import { DeleteApplicationForm } from "./forms/decisions/delete";
import { RejectApplicationForm } from "./forms/decisions/reject";
import { ValidateApplicationForm } from "./forms/decisions/validate";
import { Options } from "nuqs";
import { MarkAsPendingForm } from "./forms/decisions/mark-as-pending";
import { spokenLanguagesAsOptions } from "@/lib/data/languages";
import { DataFetchErrorResult } from "@/components/errorResult";
import { AutoUploadAvatar } from "@/components/autoUploadAvatar";
import { AutoUploadFormItem } from "@/components/autoUploadItem";
import { InputResultTest } from "./inputResultTest";

type ViewEditApplicationFormProps = {
  application?: Application;
  isPendingApplication: boolean;
  isErrorApplication: boolean;
  courses?: TestCourse[];
  documents?: RequiredDocument[];
  cycles?: Cycle[];
  faculties?: Faculty[];
  fields?: Field[];
  departments?: Department[];
  classes?: Class[];
  setView: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ViewEditApplicationForm: React.FC<
  ViewEditApplicationFormProps
> = ({
  application,
  isPendingApplication,
  isErrorApplication,
  courses,
  documents,
  cycles,
  faculties,
  fields,
  departments,
  classes,
  setView,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [admissionTestResult, setAdmissionTestResult] = useState<
    (Omit<TestResult, "id"> & { id: number | null })[] | undefined
  >([]);

  const cycleId = Form.useWatch("cycle_id", form);
  const fieldId = Form.useWatch("field_id", form);
  const facultyId = Form.useWatch("faculty_id", form);

  const filteredFields = useMemo(() => {
    return fields?.filter((f) => f.cycle?.id === cycleId);
  }, [cycleId]);

  const filteredFaculties = useMemo(() => {
    return faculties?.filter((fac) => fac.field.id === fieldId);
  }, [fieldId]);

  const filteredDepartments = useMemo(() => {
    return departments?.filter((dep) => dep.faculty.id === facultyId);
  }, [facultyId]);

  const filteredClasses = useMemo(() => {
    return classes?.filter((c) => c.cycle?.id === cycleId);
  }, [cycleId]);

  const [openMarkAsPending, setOpenMarkAsPending] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);
  const [editedApplication, setEditedApplication] =
    useState<ApplicationEditFormDataType>();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateApplication,
  });

  

  const onFinish = (
    values: Omit<
      Application,
      | "id"
      | "academic_year"
      | "cycle"
      | "faculty"
      | "field"
      | "departement"
      | "class_year"
    > & {
      year_id: number;
      cycle_id: number;
      faculty_id: number;
      field_id: number;
      department_id: number;
      class_id: number;
      spoken_languages: string[];
    }
  ) => {
    if (typeof application === "undefined") {
    } else {
      mutateAsync(
        {
          id: Number(application?.id),
          params: {
            ...values,
            year_id: application.academic_year.id,
            former_matricule: application.former_matricule,
            former_year_enrollment_id: application.former_year_enrollment_id,
            type_of_enrollment: application.type_of_enrollment,
            application_documents: formatApplicationDocumentsForEdition(
              values.application_documents
            ),
            enrollment_question_response:
              formatEnrollmentQuestionResponseForEdition(
                values.enrollment_question_response
              ),
            admission_test_result: formatAdmissionTestResultsForEdition(admissionTestResult),
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            message.success("Candidature mise à jour avec succès.");
          },
          onError: (error) => {
            if ((error as any).status === 403) {
              message.error(
                `Vous n'avez pas la permission d'effectuer cette action`
              );
            } else if ((error as any).status === 401) {
              message.error(
                "Vous devez être connecté pour effectuer cette action."
              );
            } else {
              message.error(
                (error as any)?.response?.data?.message ||
                  "Une erreur est survenue lors de la mise à jour de la candidature."
              );
            }
          },
        }
      );
    }
  };

  const getInitialAdmissionResultFromTestCourses = () => {
    const testCourses = courses?.filter(
      (course) => course.faculty.id === application?.faculty.id
    );
    return testCourses?.map((item) => ({
      id: null,
      course_test: item,
      result: null,
    }));
  };

  const formatAdmissionResultFromApplication = () => {
    return application?.admission_test_result.map((item) => ({
      id: item.id,
      course_test: item.course_test,
      result: item.result,
    }));
  };

  const handleSetEditedApplication = () => {
    if (!application) return;
    const values = form.getFieldsValue();

    setEditedApplication({
      id: application.id,
      ...values,
      year_id: application.academic_year.id,
      former_matricule: application.former_matricule,
      former_year_enrollment_id: application.former_year_enrollment_id,
      type_of_enrollment: application.type_of_enrollment,
      application_documents: formatApplicationDocumentsForEdition(
        values.application_documents
      ),
      enrollment_question_response: formatEnrollmentQuestionResponseForEdition(
        values.enrollment_question_response
      ),
      admission_test_result:
        formatAdmissionTestResultsForEdition(admissionTestResult),
    });
  };

  useEffect(() => {
    if (application?.admission_test_result?.length === 0) {
      const admissionTestResult = getInitialAdmissionResultFromTestCourses();
      setAdmissionTestResult(admissionTestResult);
    } else if (
      typeof application !== "undefined" &&
      application.admission_test_result.length > 0
    ) {
      const admissionTestResult = formatAdmissionResultFromApplication();
      setAdmissionTestResult(admissionTestResult);
    }
  }, [application, courses]);

  const getInitialRequiredDocuments = () => {
    return documents?.map((item) => ({
      exist: false,
      file_url: null,
      status: "pending",
      required_document: item,
    }));
  };

  useEffect(() => {
    if (application?.application_documents.length === 0) {
      const requiredDocuments = getInitialRequiredDocuments();
      form.setFieldsValue({ application_documents: requiredDocuments });
    } else if (
      typeof application !== "undefined" &&
      application.application_documents.length > 0
    ) {
      form.setFieldsValue({
        application_documents: application?.application_documents,
      });
    }
  }, [application, documents]);

  useEffect(() => {
    if (application) {
      form.setFieldsValue({
        ...application,
        date_of_birth: dayjs(application.date_of_birth),
        spoken_languages: parseLanguages(application.spoken_language),
        cycle_id: application.cycle.id,
        field_id: application.field.id,
        faculty_id: application.faculty.id,
        department_id: application.departement.id,
        class_id: application.class_year?.id,
        enrollment_question_response: application.enrollment_question_response,
        year_of_diploma_obtained: dayjs(
          `${application.year_of_diploma_obtained}`,
          "YYYY"
        ),
      });
    }
  }, [application]);

  if (isPendingApplication) {
    return (
      <div
        className="flex flex-col justify-center"
        style={{ height: "calc(100vh - 110px)" }}
      >
        <Result
          icon={<Spin />}
          title=" Chargement de la candidature..."
          subTitle="Veuillez patienter pendant que nous récupérons les informations de la candidature."
        />
      </div>
    );
  }

  if (isErrorApplication) {
    return <DataFetchErrorResult />;
  }

  return (
    <Layout>
      <Layout.Content
        style={{
          padding: "28px 0",
        }}
      >
        <Card
          styles={{
            body: {
              height: `calc(100vh - 310px)`,
              overflowY: "auto",
            },
          }}
          title={
            <Space>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Candidature de:
              </Typography.Title>
              <Typography.Title
                level={5}
                type="success"
                style={{ marginBottom: 0, textTransform: "uppercase" }}
              >
                {application?.surname} {application?.last_name}{" "}
                {application?.first_name}
              </Typography.Title>
              <Tag
                color={getApplicationTagColor(application?.status!)}
                variant="filled"
                style={{ borderRadius: 10 }}
              >
                {getApplicationStatusName(application?.status!)}
              </Tag>
            </Space>
          }
          extra={
            <Space>
              <Typography.Text type="secondary">
                Créée le:{" "}
                {new Intl.DateTimeFormat("FR", {
                  dateStyle: "medium",
                }).format(new Date(`${application?.date_of_submission}`))}
              </Typography.Text>
              <Button
                onClick={() => {
                  setView(0);
                }}
                icon={<CloseOutlined />}
                type="text"
                disabled={isPending}
                title="Fermer"
              />
            </Space>
          }
        >
          <Form
            form={form}
            name="form_in_drawer"
            onFinish={onFinish}
            disabled={isPending || application?.status !== "pending"}
            style={{ maxWidth: 520, margin: "auto" }}
          >
            {application?.status === "pending" && (
              <Alert
                showIcon
                icon={<BulbOutlined />}
                title="Veuillez examiner les informations avec soin."
                description="Tout formulaire qui contiendrait de faux renseignements ne doit pas étre validé!"
                closable
              />
            )}
            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Informations personnelles
              </Typography.Title>
            </Divider>

            <Form.Item
              label="Photo de profil"
              name="avatar"
              layout="vertical"
              initialValue={application?.avatar}
            >
              <AutoUploadAvatar
                form={form}
                name="avatar"
                prefix="students/avatars"
                disabled={isPending || application?.status !== "pending"}
                initialValue={application?.avatar}
              />
            </Form.Item>

            <Form.Item label="Nom" name="surname" rules={[{ required: true }]}>
              <Input placeholder="Nom" />
            </Form.Item>
            <Form.Item
              label="Postnom"
              name="last_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Postnom" />
            </Form.Item>
            <Form.Item
              label="Prénom"
              name="first_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Prénom" />
            </Form.Item>
            <Form.Item label="Sexe" name="gender" rules={[{ required: true }]}>
              <Radio.Group
                options={[
                  { value: "M", label: "Homme" },
                  { value: "F", label: "Femme" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Lieu de naissance"
              name="place_of_birth"
              rules={[{ required: true }]}
            >
              <Input placeholder="Lieu de naissance" />
            </Form.Item>
            <Form.Item
              label="Date de naissance"
              name="date_of_birth"
              rules={[{ required: true }]}
            >
              <DatePicker
                placeholder="DD/MM/YYYY"
                format={{ format: "DD/MM/YYYY" }}
                picker="date"
              />
            </Form.Item>
            <Form.Item
              label="Nationalité"
              name="nationality"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Nationalité"
                options={countries}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="État civil"
              name="marital_status"
              rules={[{ required: true }]}
            >
              <Radio.Group
                options={[
                  { value: "single", label: "Célibataire" },
                  { value: "married", label: "Marié(e)" },
                  { value: "divorced", label: "Divorcé(e)" },
                  { value: "widowed", label: "Veuf(ve)" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Affiliation religieuse"
              name="religious_affiliation"
              rules={[{ required: true }]}
            >
              <Input placeholder="Affiliation religieuse" />
            </Form.Item>
            <Form.Item
              label="Aptitude physique"
              name="physical_ability"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Radio.Group
                options={[
                  { value: "normal", label: "Normale" },
                  { value: "disabled", label: "Handicapé" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Téléphone 1"
              name="phone_number_1"
              rules={[{ required: true }]}
            >
              <Input placeholder="Téléphone 1" />
            </Form.Item>
            <Form.Item
              label="Téléphone 2"
              name="phone_number_2"
              rules={[{ required: false }]}
            >
              <Input placeholder="Numéro de téléphone 2" />
            </Form.Item>
            <Form.Item
              name="spoken_languages"
              label="Langues parlées"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder={`Langues parlées`}
                options={spokenLanguagesAsOptions}
                mode="multiple"
              />
            </Form.Item>
            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Informations sur les parents
              </Typography.Title>
            </Divider>
            <Form.Item
              label="Nom du père"
              name="father_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nom du père" />
            </Form.Item>
            <Form.Item
              label="Nom de la mère"
              name="mother_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nom de la mère" />
            </Form.Item>
            <Form.Item
              label="Téléphone du père"
              name="father_phone_number"
              rules={[]}
            >
              <Input placeholder="Téléphone du père" />
            </Form.Item>
            <Form.Item
              label="Téléphone de la mère"
              name="mother_phone_number"
              rules={[]}
            >
              <Input placeholder="Téléphone de la mère" />
            </Form.Item>

            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Origine de l&apos;étudiant
              </Typography.Title>
            </Divider>
            <Form.Item
              label="Pays d'origine"
              name="country_of_origin"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Pays d'origine"
                options={countries}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="Province d'origine"
              name="province_of_origin"
              rules={[{ required: true }]}
            >
              <Input placeholder="Province d'origine" />
            </Form.Item>
            <Form.Item
              label="Ville ou Territoire d'origine"
              name="territory_or_municipality_of_origin"
              rules={[{ required: true }]}
            >
              <Input placeholder="Ville ou Territoire d'origine" />
            </Form.Item>
            <Form.Item
              label="Êtes-vous étranger?"
              name="is_foreign_registration"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>

            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>Adresse actuelle</Typography.Title>
            </Divider>
            <Form.Item
              label="Ville actuelle"
              name="current_city"
              rules={[{ required: true }]}
            >
              <Input placeholder="Ville actuelle" />
            </Form.Item>
            <Form.Item
              label="Municipalité actuelle"
              name="current_municipality"
              rules={[{ required: true }]}
            >
              <Input placeholder="Municipalité actuelle" />
            </Form.Item>
            <Form.Item
              label="Adresse actuel"
              name="current_neighborhood"
              rules={[{ required: true }]}
            >
              <Input.TextArea placeholder="Quartier ou Avenue et No" />
            </Form.Item>
            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Études secondaires faites
              </Typography.Title>
            </Divider>

            <Form.Item
              label="Nom de l'école secondaire"
              name="name_of_secondary_school"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nom de l'école secondaire" />
            </Form.Item>
            <Form.Item
              label="Pays de l'école secondaire"
              name="country_of_secondary_school"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Pays de l'école secondaire"
                options={countries}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="Province de l'école secondaire"
              name="province_of_secondary_school"
              rules={[{ required: true }]}
            >
              <Input placeholder="Province de l'école secondaire" />
            </Form.Item>
            <Form.Item
              label="Ville ou Territoire de l'école"
              name="territory_or_municipality_of_school"
              rules={[{ required: true }]}
            >
              <Input placeholder="Territoire ou municipalité de l'école" />
            </Form.Item>
            <Form.Item
              label="Section ou option suivie aux humanités"
              name="section_followed"
              rules={[{ required: true }]}
            >
              <Input placeholder="Section suivie" />
            </Form.Item>
            <Form.Item
              label="Année d'obtention du diplôme"
              name="year_of_diploma_obtained"
              rules={[{ required: true }]}
            >
              <DatePicker
                placeholder="Année d'obtention du diplôme"
                mode="year"
                picker="year"
                format="YYYY"
              />
            </Form.Item>
            <Form.Item
              label="Numéro du diplôme"
              name="diploma_number"
              rules={[]}
            >
              <Input placeholder="Numéro du diplôme" />
            </Form.Item>
            <Form.Item
              label="Pourcentage obtenu au diplôme"
              name="diploma_percentage"
              rules={[{ required: true }]}
            >
              <InputNumber
                placeholder="Pourcentage obtenu au diplôme"
                step={0.01}
                suffix="%"
                min={0}
                max={100}
              />
            </Form.Item>
            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Occupations après les humanités
              </Typography.Title>
            </Divider>
            <Form.Item
              label="Activités professionnelles"
              name="professional_activity"
              rules={[]}
            >
              <Input.TextArea placeholder="Activités professionnelles" />
            </Form.Item>

            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Études universitaires précédentes
              </Typography.Title>
            </Divider>
            <Form.List name="previous_university_studies">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div className="py-4" key={key}>
                      <Badge count={index + 1} />
                      <Form.Item
                        {...restField}
                        name={[name, "academic_year"]}
                        label="Année académique"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez entrer l'année académique",
                          },
                        ]}
                      >
                        <Input placeholder="Année académique" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "institution"]}
                        rules={[
                          {
                            required: true,
                            message: "Veuillez entrer l'établissement",
                          },
                        ]}
                        label="Établissement"
                      >
                        <Input placeholder="Établissement" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "study_year_and_faculty"]}
                        label="Faculté/Département"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input placeholder="Faculté/Département" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "result"]}
                        label="Résultat"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez entrer le résultat",
                          },
                        ]}
                      >
                        <Input placeholder="Résultat" />
                      </Form.Item>
                      <Button
                        danger
                        block
                        onClick={() => remove(name)}
                        icon={<DeleteOutlined />}
                        style={{ boxShadow: "none" }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                  <Form.Item style={{ marginTop: 24 }}>
                    <Button
                      type="link"
                      onClick={() => add()}
                      icon={<PlusCircleOutlined />}
                      block
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Ajouter une ligne
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>Choix de filière</Typography.Title>
            </Divider>
            <Form.Item
              label="Cycle"
              name="cycle_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Radio.Group options={getCurrentCyclesAsOptions(cycles)} />
            </Form.Item>
            <Form.Item
              label="Domaine"
              name="field_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                options={getCurrentFieldsAsOptions(filteredFields)}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="Faculté"
              name="faculty_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                options={getCurrentFacultiesAsOptions(filteredFaculties)}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="Département"
              name="department_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                placeholder="Département"
                options={getCurrentDepartmentsAsOptions(filteredDepartments)}
                onSelect={(value) => {
                  const selectedDep = departments?.find(
                    (dep) => dep.id === value
                  );
                  const facId = selectedDep?.faculty.id;
                  const selectedFac = faculties?.find(
                    (fac) => fac.id === facId
                  );
                  form.setFieldsValue({
                    faculty_id: facId,
                    field_id: selectedFac?.field.id,
                  });
                }}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="Promotion"
              name="class_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                placeholder="Promotion ou classe"
                options={getCurrentClassesAsOptions(filteredClasses)}
                showSearch
              />
            </Form.Item>
            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Autres questions importantes
              </Typography.Title>
            </Divider>
            <Form.List name={["enrollment_question_response"]}>
              {(fields, { add, remove }) => (
                <div className="b-4">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div className="py-6" key={key}>
                      <Form.Item
                        {...restField}
                        name={[name, "response"]}
                        rules={[]}
                        label={
                          <>
                            <Badge
                              color="lime"
                              count={`${index + 1}`}
                              style={{ marginRight: 6 }}
                            />
                            {
                              application?.enrollment_question_response[index]
                                ?.registered_enrollment_question?.question
                            }
                          </>
                        }
                        layout="vertical"
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <Divider
              titlePlacement="left"
              orientationMargin={0}
              style={{ marginTop: 32 }}
            >
              <Typography.Title level={3}>Eléments du dossier</Typography.Title>
            </Divider>

            <Form.List name={["application_documents"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      title={
                        <Space>
                          <Badge color="blue" count={index + 1} />
                          <FileOutlined />

                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                          >
                            {application?.application_documents &&
                            application?.application_documents?.length > 0
                              ? application?.application_documents?.[index]
                                  ?.required_document?.title
                              : documents?.[index].title}
                          </Typography.Title>
                        </Space>
                      }
                      key={key}
                      style={{ marginBottom: 24 }}
                      styles={{
                        header: {
                          borderBottom: "none",
                        },
                        body: {
                          paddingTop: 0,
                        },
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "exist"]}
                        label="Version papier"
                        rules={[]}
                        valuePropName="checked"
                        style={{ marginTop: 8 }}
                      >
                        <Switch
                          checkedChildren="✓ Présent"
                          unCheckedChildren="✗ Absent"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "file_url"]}
                        label="Version électronique"
                        rules={[]}
                      >
                        <AutoUploadFormItem
                          // {...restField}
                          name={["application_documents", name, "file_url"]}
                          form={form}
                          prefix={`students/documents`}
                          accept="image/*,application/pdf"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "status"]}
                        rules={[{}]}
                        label="Vérification"
                      >
                        <Select
                          options={[
                            { value: "pending", label: "En attente" },
                            { value: "rejected", label: "Rejeté" },
                            { value: "validated", label: "Validé" },
                          ]}
                        />
                      </Form.Item>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>

            <Divider titlePlacement="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Resultats aux tests de sélection
              </Typography.Title>
            </Divider>
            <Table
              size="small"
              pagination={false}
              dataSource={admissionTestResult}
              columns={[
                {
                  key: "course",
                  dataIndex: "course",
                  title: "Matière",
                  render: (_, record) => record.course_test.name,
                },
                {
                  key: "result",
                  dataIndex: "result",
                  title: "Resultat",
                  render: (_, record, index) => (
                    <InputResultTest
                      value={record.result}
                      disabled={isPending || application?.status !== "pending"}
                      max={record.course_test.max_value}
                      onChange={(value) => {
                        const updatedItems = [...(admissionTestResult ?? [])];

                        updatedItems[index] = {
                          ...updatedItems[index],
                          result: value,
                        };
                        setAdmissionTestResult(updatedItems);
                      }}
                    />
                  ),
                  width: 120,
                },
              ]}
            />

            <Alert
              showIcon
              title="Frais d'inscription"
              type={
                application?.enrollment_fees === "paid"
                  ? "success"
                  : application?.enrollment_fees === "partially_paid"
                  ? "warning"
                  : "error"
              }
              description={
                <Form.Item
                  name="enrollment_fees"
                  label="Frais d'inscription"
                  rules={[{ required: true }]}
                  status="error"
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    options={[
                      { value: "paid", label: "Payé" },
                      {
                        value: "partially_paid",
                        label: "Partiellement payé",
                      },
                      { value: "unpaid", label: "Non payé" },
                    ]}
                    variant="filled"
                    style={{ width: 120 }}
                  />
                </Form.Item>
              }
              style={{ marginTop: 36 }}
            />

            <Alert
              showIcon
              title="Statut de la candidature"
              type={getApplicationStatusAlertType(application?.status!)}
              description={
                <Form.Item
                  name="status"
                  label="Statut"
                  rules={[{ required: true }]}
                  status="error"
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    options={getApplicationStatusAsOptions}
                    variant="filled"
                    style={{ width: 120 }}
                    disabled
                  />
                </Form.Item>
              }
              style={{ marginTop: 36 }}
            />
          </Form>
        </Card>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Palette />

            {application?.status === "pending" && (
              <Space>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={isPending}
                  style={{ boxShadow: "none" }}
                  disabled={isPending}
                >
                  Sauvegarder uniquement
                </Button>
                <Button
                  // type="dashed"
                  color="green"
                  variant="dashed"
                  style={{ boxShadow: "none" }}
                  disabled={isPending}
                  onClick={() => {
                    handleSetEditedApplication();
                    setOpenValidate(true);
                  }}
                  icon={<CheckOutlined />}
                >
                  Valider
                </Button>
                <Button
                  type="dashed"
                  danger
                  style={{ boxShadow: "none" }}
                  disabled={isPending}
                  onClick={() => {
                    handleSetEditedApplication();
                    setOpenReject(true);
                  }}
                  icon={<CloseOutlined />}
                >
                  Rejeter
                </Button>
              </Space>
            )}
            {application?.status === "rejected" && (
              <Space>
                <Typography.Text type="danger">
                  Cette candidature a été rejetée. Nous la gardons juste comme
                  archive
                </Typography.Text>
              </Space>
            )}
            {application?.status === "validated" && (
              <Space>
                <Typography.Text type="success">
                  Cette candidature est valide. Vous pouvez la gérer
                  complètement depuis depuis le menu étudiants. Ici nous la
                  gardons juste comme une archive
                </Typography.Text>
              </Space>
            )}
            <Dropdown
              menu={{
                items: [
                  application?.status === "pending"
                    ? {
                        key: "validate",
                        label: "Accepter",
                        icon: <CheckOutlined />,
                      }
                    : null,
                  application?.status === "rejected"
                    ? {
                        key: "pending",
                        label: "Marquer comme en attente",
                        icon: <HourglassOutlined />,
                      }
                    : null,
                  application?.status === "pending"
                    ? {
                        key: "reject",
                        label: "Rejeter",
                        icon: <CloseOutlined />,
                      }
                    : null,
                  {
                    key: "delete",
                    label: "Supprimer",
                    icon: <DeleteOutlined />,
                    danger: true,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "pending") {
                    handleSetEditedApplication();
                    setOpenMarkAsPending(true);
                  } else if (key === "delete") {
                    setOpenDelete(true);
                  } else if (key === "reject") {
                    handleSetEditedApplication();
                    setOpenReject(true);
                  } else if (key === "validate") {
                    handleSetEditedApplication();
                    setOpenValidate(true);
                  }
                },
              }}
            >
              <Button icon={<MoreOutlined />} type="text" />
            </Dropdown>
          </div>
        </Card>
      </Layout.Content>
      <MarkAsPendingForm
        applicationId={application?.id!}
        editedApplication={editedApplication}
        open={openMarkAsPending}
        setOpen={setOpenMarkAsPending}
      />
      <DeleteApplicationForm
        application={application!}
        open={openDelete}
        setOpen={setOpenDelete}
        setView={setView}
      />
      <RejectApplicationForm
        applicationId={application?.id!}
        EditedApplication={editedApplication}
        open={openReject}
        setOpen={setOpenReject}
      />
      <ValidateApplicationForm
        applicationId={application?.id!}
        editedApplication={editedApplication}
        open={openValidate}
        setOpen={setOpenValidate}
      />
    </Layout>
  );
};
