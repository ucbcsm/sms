// generate hslColor
const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

const generateHSL = (name: string) => {
  const hRange = [0, 360];
  const sRange = [50, 75];
  const lRange = [25, 60];
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, hRange[0], hRange[1]);
  const s = normalizeHash(hash, sRange[0], sRange[1]);
  const l = normalizeHash(hash, lRange[0], lRange[1]);
  return [h, s, l];
};

export const getHSLColor = (name: string) => {
  const hsl = generateHSL(name);

  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

export const getMaritalStatusName = (
  value: "single" | "married" | "divorced" | "widowed" | string
) => {
  switch (value) {
    case "single":
      return "Célibataire";
    case "married":
      return "Marié(e)";
    case "divorced":
      return "Divorcé(e)";
    case "widowed":
      return "Veuf(ve)";
    default:
      return "Inconnu";
  }
};

export const filterOption = (
  input: string,
  option:
    | {
        value: number;
        label: string;
      }
    | undefined
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());


export function percentageFormatter(value: number) {
  return new Intl.NumberFormat("fr", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function toFixedNumber(value: number | string, fixed: number = 0) {
  return Number(Number(value).toFixed(fixed));
}

 // 🖼️ Détermine si l’URL correspond à une image
export const isImageUrl = (url?: string | null) => {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.startsWith("blob:") || u.startsWith("data:image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif|heic|heif|ico)(\?.*)?$/.test(u);
};


/**
 * Génère l’URL publique d’un fichier R2 à partir d’une URL privée.
 * Vérifie que l’entrée est une URL valide et que l’URL pointe vers un fichier.
 * Prend uniquement le dernier segment de l’URL (nom du fichier).
 * Retourne null si l’entrée est null/undefined, invalide ou ne correspond pas à un fichier.
 */
export function getPublicR2Url(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return null; // URL invalide
  }

  const urlParts = parsedUrl.pathname.split("/").filter(Boolean);
  const fileName = urlParts[urlParts.length - 1];

  // Vérifie que le dernier segment contient bien une extension de fichier
  if (!fileName || !fileName.includes(".")) return null;

  const pubUrl = `${process.env.NEXT_PUBLIC_R2_BUCKET_URL?.replace(/\/$/, "")}/${fileName}`;

  return pubUrl;
}


/**
 * Retourne "Bonjour" ou "Bonsoir" selon l'heure locale de l'utilisateur.
 * Bonsoir après 18h00, Bonjour le reste du temps.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  return hour >= 18 ? "Bonsoir" : "Bonjour";
}