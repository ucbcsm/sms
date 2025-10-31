"use server";

import { handleUpload } from "@/lib/r2-client";

export async function uploadFile(formData: FormData, prefix = "") {
  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("Aucun fichier fourni.");
  }

  const url = await handleUpload(file, prefix);
  return url; 
}
