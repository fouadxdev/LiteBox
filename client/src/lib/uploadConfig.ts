// Centralized upload limits (mirror backend multer config)

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_FILE_SIZE_MB = 50;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
];

export type ValidationError = "size" | "type";

export function validateFile(file: File): { valid: boolean; error?: ValidationError } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "size" };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return { valid: false, error: "type" };
  }
  return { valid: true };
}

export function getValidationMessage(error: ValidationError): string {
  switch (error) {
    case "size":
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`;
    case "type":
      return "File type not allowed. Allowed: images, PDF, Word, text.";
    default:
      return "Invalid file.";
  }
}

export const ALLOWED_DESCRIPTION =
  "Images (JPEG, PNG, GIF, WebP), PDF, Word (.doc, .docx), text (.txt)";
