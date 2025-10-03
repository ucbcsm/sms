type SpokenLanguage = {
  name: string;
  scope: "intl" | "nat";
};

export const spokenLanguages: SpokenLanguage[] = [
  { name: "Anglais", scope: "intl" },
  { name: "Français", scope: "intl" },
  { name: "Swahili", scope: "nat" },
  { name: "Lingala", scope: "nat" },
  { name: "Kikongo", scope: "nat" },
  { name: "Kiluba", scope: "nat" },
];

const getSpokenLanguagesAsOptions = () => {
  return [
    {

      label: "Internationnales",
      options: spokenLanguages
        .filter((lang) => lang.scope === "intl")
        .map((lang) => ({ value: lang.name, label: lang.name })),
    },
    {
      label: "Nationales",
      options: spokenLanguages
        .filter((lang) => lang.scope === "nat")
        .map((lang) => ({ value: lang.name, label: lang.name })),
    },
  ];
};

export const spokenLanguagesAsOptions = getSpokenLanguagesAsOptions();
