import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import sharp from "sharp";
import { randomUUID } from "crypto";

const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME } =
  process.env;

if (
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_ENDPOINT ||
  !R2_BUCKET_NAME
) {
  throw new Error("Missing Cloudflare R2 environment variables.");
}

// --- Configuration du client R2 (S3-compatible)
export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false,
});

// --- Paramètres internes
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const IMAGE_MAX_WIDTH = 1920;
const IMAGE_QUALITY = 80;

const ALLOWED_MIME = {
  images: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  videos: ["video/mp4", "video/webm"],
  documents: ["application/pdf", "text/plain"],
};

// --- Helpers
function isAllowedMime(mime: string) {
  return Object.values(ALLOWED_MIME).flat().includes(mime);
}

function isImageMime(mime: string) {
  return ALLOWED_MIME.images.includes(mime);
}

function validateFileSize(size: number) {
  if (size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error(
      `File too large (max ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024} MB)`
    );
  }
}

// --- Upload vers R2
async function uploadToR2({
  buffer,
  filename,
  contentType,
  prefix = "",
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  prefix?: string;
}) {
  // Nettoyage du prefix
  let cleanPrefix = prefix.trim().replace(/^\/+|\/+$/g, ""); // supprime les / au début et à la fin
  if (cleanPrefix) cleanPrefix += "/"; // ajoute un / à la fin s’il y a un prefix

  // Nom unique pour le fichier
  const uniqueName = `${Date.now()}-${randomUUID()}${path.extname(filename) || ""}`;
  const key = `${cleanPrefix}${uniqueName}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await r2Client.send(command);
  const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${encodeURIComponent(key)}`;
  return url;
}

// --- Fonction principale d’upload (avec optimisations)
export async function handleUpload(file: File, prefix = "") {
  const arrayBuffer = await file.arrayBuffer();
  let finalBuffer = Buffer.from(new Uint8Array(arrayBuffer));
  const contentType = file.type;
  const name = file.name;

  validateFileSize(finalBuffer.length);
  if (!isAllowedMime(contentType)) {
    throw new Error(`Unsupported file type: ${contentType}`);
  }

  if (isImageMime(contentType)) {
    const image = sharp(finalBuffer).rotate();
    const meta = await image.metadata();

    if (meta.width && meta.width > IMAGE_MAX_WIDTH) {
      image.resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true });
    }

    const webpBuf = await image
      .toFormat("webp", { quality: IMAGE_QUALITY })
      .toBuffer();

    finalBuffer = Buffer.from(new Uint8Array(webpBuf as any));
  }

  const url = await uploadToR2({
    buffer: finalBuffer,
    filename: name,
    contentType: isImageMime(contentType) ? "image/webp" : contentType,
    prefix,
  });

  return url;
}



