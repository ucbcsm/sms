"use client";

import { Palette } from "@/components/palette";
import {
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  updateTeacher,
} from "@/lib/api";
import { countries } from "@/lib/data/countries";

import { Department, Faculty, Teacher } from "@/types";
import { CloseOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Radio,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import { FC, useState } from "react";

type EditTeacherProfileFormProps = {
  teacher?: Teacher;
  departments?: Department[];
  faculties?: Faculty[];
};

export const EditTeacherProfileForm: FC<EditTeacherProfileFormProps> = ({
  teacher,
  faculties,
  departments,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [open, setOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const is_permanent_teacher = Form.useWatch('is_permanent_teacher', form);
  const [editMatricule, setEditMatricule] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateTeacher,
  });

  const onFinish = (values: any) => {
    if (!teacher) {
      messageApi.error("Aucune donnée disponible pour la mise à jour.");
    } else {
      mutateAsync(
        {
          id: Number(teacher.id),
          params: {
            ...values,
            user: {
              id: teacher?.user.id,
              first_name: values.first_name,
              last_name: values.last_name,
              surname: values.surname,
              email: values.email,
              avatar: teacher?.user.avatar,
              matricule: values.matricule,
              pending_avatar: teacher?.user.pending_avatar,
            },
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            queryClient.invalidateQueries({
              queryKey: ["teacher", `${teacher.id}`],
            });
            messageApi.success("Profil enseignant mise à jour avec succès.");
            setEditMatricule(false);
            setOpen(false);
          },
          onError: () => {
            messageApi.error(
              "Une erreur est survenue lors de la mise à jour du profil enseignant."
            );
          },
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        icon={<EditOutlined />}
        title="Modifier le profile"
        onClick={() => {
          setOpen(true);
        }}
      >
        Modifier
      </Button>
      <Drawer
        open={open}
        title={
          <div className="text-white">
            Info enseignant:{" "}
            <Typography.Text
              type="warning"
              style={{ textTransform: "uppercase" }}
            >
              {teacher?.user.first_name} {teacher?.user.last_name}{" "}
              {teacher?.user.surname}
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
                type="primary"
                onClick={() => form.submit()}
                loading={isPending}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Sauvegarder
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          name="form_in_drawer"
          initialValues={{
            ...teacher,
            ...teacher?.user,
            assigned_departements: teacher?.assigned_departements?.map(
              (dept) => dept.id
            ),
            assigned_faculties: teacher?.assigned_faculties?.map(
              (fac) => fac.id
            ),
            is_permanent_teacher: teacher?.user.is_permanent_teacher,
          }}
          onFinish={onFinish}
          disabled={isPending}
          style={{ maxWidth: 520, margin: "auto" }}
        >
          <Alert
            showIcon
            message="Identifiant professionnelle"
            type="info"
            description={
              <Form.Item
                name="matricule"
                label="Matricule"
                rules={[{ required: true }]}
                status="error"
                style={{ marginBottom: 0 }}
              >
                <Input
                  variant="filled"
                  style={{ width: 120 }}
                  disabled={!editMatricule}
                />
              </Form.Item>
            }
            style={{ marginTop: 8 }}
            action={
              <Button
                type="link"
                icon={!editMatricule ? <EditOutlined /> : <LockOutlined />}
                onClick={() => setEditMatricule((prev) => !prev)}
              />
            }
          />
          <Form.Item
            label="Type de personnel"
            name="is_permanent_teacher"
            rules={[{ required: true }]}
            style={{marginTop:24}}
          >
            <Radio.Group
              options={[
                { value: true, label: "Permanent" },
                { value: false, label: "Visiteur" },
              ]}
            />
          </Form.Item>
          {is_permanent_teacher === false && (
            <Form.Item
              name="origin"
              label="Origine"
              rules={[{ required: true }]}
            >
              <Input placeholder="Institution d'origine" />
            </Form.Item>
          )}
          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>Identité</Typography.Title>
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

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>Contacts</Typography.Title>
          </Divider>
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

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Etudes et titres académiques
            </Typography.Title>
          </Divider>

          <Form.Item
            label="Domaine d'étude"
            name="field_of_study"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Domaine d'étude"
              options={[
                { value: "humanities", label: "Sciences humaines" },
                {
                  value: "literature_and_languages",
                  label: "Lettres et langues",
                },
                { value: "social_sciences", label: "Sciences sociales" },
                { value: "law", label: "Droit" },
                {
                  value: "economics_and_management",
                  label: "Économie et gestion",
                },
                { value: "natural_sciences", label: "Sciences exactes" },
                { value: "mathematics", label: "Mathématiques" },
                { value: "computer_science", label: "Informatique" },
                { value: "engineering", label: "Sciences de l’ingénieur" },
                { value: "health", label: "Santé" },
                { value: "medicine", label: "Médecine" },
                { value: "education", label: "Éducation" },
                { value: "arts", label: "Arts" },
                { value: "architecture", label: "Architecture" },
                {
                  value: "environmental_sciences",
                  label: "Sciences de l’environnement",
                },
                { value: "agricultural_sciences", label: "Agronomie" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Titre académique"
            name="academic_title"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Titre académique"
              options={[
                { value: "bachelor", label: "Licence / Bachelor" },
                {
                  value: "professional_bachelor",
                  label: "Licence Professionnelle",
                },
                { value: "master", label: "Master" },
                { value: "research_master", label: "Master Recherche" },
                { value: "professional_master", label: "Master Professionnel" },
                { value: "engineer_degree", label: "Ingénieur diplômé" },
                {
                  value: "specialized_master",
                  label: "Mastère Spécialisé (MS)",
                },
                {
                  value: "mba",
                  label: "MBA (Master of Business Administration)",
                },
                { value: "phd", label: "Doctorat / PhD" },
                {
                  value: "professional_doctorate",
                  label: "Doctorat Professionnel",
                },
                {
                  value: "hdr",
                  label: "Habilitation à diriger des recherches (HDR)",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Grade académique"
            name="academic_grade"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Grade académique"
              options={[
                {
                  value: "teaching_assistant",
                  label: "Assistant d’enseignement / Moniteur",
                },
                {
                  value: "research_assistant",
                  label: "Assistant de recherche",
                },
                {
                  value: "lecturer",
                  label: "Chargé de cours / Chargé d’enseignement",
                },
                {
                  value: "associate_lecturer",
                  label:
                    "Attaché temporaire d’enseignement et de recherche (ATER)",
                },
                {
                  value: "associate_professor",
                  label: "Maître de conférences",
                },
                {
                  value: "full_professor",
                  label: "Professeur des universités",
                },
                { value: "emeritus_professor", label: "Professeur émérite" },
                {
                  value: "researcher",
                  label: "Chargé de recherche (CNRS, INRAE, etc.)",
                },
                { value: "senior_researcher", label: "Directeur de recherche" },
                {
                  value: "doctoral_candidate",
                  label: "Doctorant / Doctorante",
                },
                {
                  value: "postdoctoral_fellow",
                  label: "Postdoctorant / Postdoctorante",
                },
                { value: "adjunct_professor", label: "Professeur associé" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Facultés assignées"
            name="assigned_faculties"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Facultés assignées"
              options={getCurrentFacultiesAsOptions(faculties)}
            />
          </Form.Item>
          <Form.Item
            label="Départements assignés"
            name="assigned_departements"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Départements assignés"
              options={getCurrentDepartmentsAsOptions(departments)}
            />
          </Form.Item>
          <Form.Item
            label="Autres responsabilités/Charge administrative"
            name="other_responsabilities"
            rules={[{ required: false }]}
          >
            <Input.TextArea placeholder="Autres responsabilités/Charge administrative" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
