"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Button,
  Form,
  Drawer,
  message,
  Space,
  theme,
  Input,
  Radio,
  DatePicker,
  Select,
  Typography,
  Flex,
  Divider,
  Checkbox,
  InputNumber,
  Upload,
  Badge,
  Alert,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Application } from "@/lib/types";
import { Palette } from "@/components/palette";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApplicationStatusAlertType,
  getApplicationStatusAsOptions,
  getClasses,
  getCurrentClassesAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
  getCurrentPeriodsAsOptions,
  getCycles,
  getDepartments,
  getFaculties,
  getFields,
  getPeriods,
  parseLanguages,
  updateApplication,
} from "@/lib/api";
import { countries } from "@/lib/data/countries";
import dayjs from "dayjs";
import { useYid } from "@/hooks/useYid";

type EditApplicationFormProps = {
  application: Application;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditApplicationForm: React.FC<EditApplicationFormProps> = ({
  application,
  open,
  setOpen,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { yid } = useYid();
  const queryClient = useQueryClient();

  const { data: cycles } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: fields } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });

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
      | "period"
    > & {
      year_id: number;
      cycle_id: number;
      faculty_id: number;
      field_id: number;
      department_id: number;
      class_id: number;
      period_id: number;
      spoken_languages: { language: string }[];
    }
  ) => {
    mutateAsync(
      {
        id: Number(application?.id),
        params: {
          ...values,
          year_id: application.academic_year.id,
          type_of_enrollment: application.type_of_enrollment,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applications"] });
          messageApi.success("Candidature mise à jour avec succès.");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur est survenue lors de la mise à jour de la candidature."
          );
        },
      }
    );
  };
  console.log(application.year_of_diploma_obtained);
  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title={
          <div className="text-white">
            Vue candidature:{" "}
            <Typography.Text
              type="warning"
              style={{ textTransform: "uppercase" }}
            >
              {application.first_name} {application.last_name}{" "}
              {application.surname}
            </Typography.Text>
          </div>
        }
        width="100%"
        closable={false}
        onClose={() => setOpen(false)}
        destroyOnClose
        styles={{ header: { background: colorPrimary } }}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => {
                setOpen(false);
              }}
              icon={<CloseOutlined />}
              type="text"
              disabled={isPending}
            />
          </Space>
        }
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 24px",
            }}
          >
            <Palette />
            <Space>
              <Button
                onClick={() => setOpen(false)}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isPending}
                style={{ boxShadow: "none" }}
              >
                Sauvegarder
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          // layout="vertical"
          form={form}
          name="form_in_drawer"
          initialValues={{
            ...application,
            date_of_birth: dayjs(application.date_of_birth),
            spoken_languages: parseLanguages(application.spoken_language),
            cycle_id: application.cycle.id,
            field_id: application.field.id,
            faculty_id: application.faculty.id,
            department_id: application.departement.id,
            class_id: application.class_year.id,
            period_id: application.period.id,
            enrollment_question_response:
              application.enrollment_question_response,
            year_of_diploma_obtained: dayjs(
              `${application.year_of_diploma_obtained}`,
              "YYYY"
            ),
          }}
          onFinish={onFinish}
          disabled={isPending}
          style={{ maxWidth: 520, margin: "auto" }}
        >
          <Alert
            showIcon
            closable
            message="Veuillez examiner les informations avec soin."
            description="Tout formulaire qui contiendrait de faux renseignements ne doit pas étre validé!"
          />
          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Informations personnelles
            </Typography.Title>
          </Divider>

          <Form.Item label="Nom" name="first_name" rules={[{ required: true }]}>
            <Input placeholder="Nom" />
          </Form.Item>
          <Form.Item
            label="Postnom"
            name="last_name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Postnom" />
          </Form.Item>
          <Form.Item label="Prénom" name="surname" rules={[{ required: true }]}>
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
            <Select placeholder="Nationalité" options={countries} showSearch />
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
          <Typography.Text>Langues parlées</Typography.Text>
          <Form.List
            name={["spoken_languages"]}
            rules={[
              {
                validator(_, value) {
                  if (!value?.length) {
                    return Promise.reject(
                      new Error("Ajouter au moins une langue")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <div className="pt-2">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div className="" key={key}>
                    <Flex gap={16}>
                      <Form.Item
                        {...restField}
                        name={[name, "language"]}
                        label={`Langue ${index + 1}`}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder={`Langue parlée ${index + 1}`} />
                      </Form.Item>

                      <Button
                        danger
                        type="text"
                        onClick={() => remove(name)}
                        icon={<CloseOutlined />}
                        style={{ boxShadow: "none" }}
                      />
                    </Flex>
                  </div>
                ))}
                {errors.map((Error) => (
                  <Typography.Text type="danger">{Error}</Typography.Text>
                ))}
                <Form.Item style={{}}>
                  <Button
                    type="link"
                    onClick={() => add()}
                    icon="+"
                    block
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Ajouter une langue parlée
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Divider orientation="left" orientationMargin={0}>
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

          <Divider orientation="left" orientationMargin={0}>
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

          <Divider orientation="left" orientationMargin={0}>
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
            <Input placeholder="Quartier ou Avenue et No" />
          </Form.Item>
          <Divider orientation="left" orientationMargin={0}>
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
          <Form.Item label="Numéro du diplôme" name="diploma_number" rules={[]}>
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
          <Form.Item label="Fichier du diplôme" name="diploma_file">
            <Upload>
              <Button icon={<UploadOutlined />}>Télécharger le fichier</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Autres documents" name="other_documents">
            <Upload>
              <Button icon={<UploadOutlined />}>
                Télécharger les documents
              </Button>
            </Upload>
          </Form.Item>
          <Divider orientation="left" orientationMargin={0}>
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

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Études universitaires précédentes
            </Typography.Title>
          </Divider>
          <Form.List name={["previous_university_studies"]}>
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
                      label="Année d'études et faculté"
                      rules={[
                        {
                          required: true,
                          message:
                            "Veuillez entrer l'année d'études et faculté",
                        },
                      ]}
                    >
                      <Input placeholder="Année d'études et faculté" />
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
          <Divider orientation="left" orientationMargin={0}>
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
            label="Filière ou Domaine"
            name="field_id"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              options={getCurrentFieldsAsOptions(fields)}
              disabled
              showSearch
              variant="borderless"
            />
          </Form.Item>
          <Form.Item
            label="Faculté"
            name="faculty_id"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              options={getCurrentFacultiesAsOptions(faculties)}
              disabled
              showSearch
              variant="borderless"
            />
          </Form.Item>
          <Form.Item
            label="Département"
            name="department_id"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              placeholder="Département"
              options={getCurrentDepartmentsAsOptions(departments)}
              onSelect={(value) => {
                const selectedDep = departments?.find(
                  (dep) => dep.id === value
                );
                const facId = selectedDep?.faculty.id;
                const selectedFac = faculties?.find((fac) => fac.id === facId);
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
              options={getCurrentClassesAsOptions(classes)}
              showSearch
            />
          </Form.Item>
          <Form.Item
            label="Période"
            name="period_id"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              placeholder="Période"
              options={getCurrentPeriodsAsOptions(periods)}
              showSearch
            />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Autres questions importantes
            </Typography.Title>
          </Divider>
          <Form.List name={["enrollment_question_response"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div className="py-4" key={key}>
                    <Badge count={`Q.${index + 1}`} />
                    <Form.Item
                      {...restField}
                      name={[name, "question"]}
                      hidden
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "response"]}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      label={
                        application.enrollment_question_response[index].question
                      }
                      layout="vertical"
                    >
                      <Input.TextArea />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>

          <Alert
            showIcon
            message="Statut de la candidature"
            type={getApplicationStatusAlertType(application.status!)}
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
                />
              </Form.Item>
            }
            style={{ marginTop: 36 }}
          />
        </Form>
      </Drawer>
    </>
  );
};
