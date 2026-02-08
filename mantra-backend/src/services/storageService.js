import { supabaseAdmin } from "../config/supabase.js";
import { ApiError } from "../utils/ApiError.js";

const BUCKET = "mantra-uploads";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload a file to Supabase Storage
 * @param {Buffer} fileBuffer - File data
 * @param {string} fileName - Original file name
 * @param {string} folder - Folder path (e.g., "avatars", "thumbnails")
 * @returns {string} Public URL of the uploaded file
 */
export async function upload(fileBuffer, fileName, folder = "general") {
  if (fileBuffer.length > MAX_SIZE) {
    throw ApiError.badRequest("File size exceeds 5MB limit");
  }

  const ext = fileName.split(".").pop();
  const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(uniqueName, fileBuffer, {
      contentType: getMimeType(ext),
      upsert: false,
    });

  if (error) throw ApiError.internal(`Upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(uniqueName);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function remove(filePath) {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) throw ApiError.internal(`Delete failed: ${error.message}`);
}

function getMimeType(ext) {
  const types = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return types[ext.toLowerCase()] || "application/octet-stream";
}

