import { ServiceResult } from "../types";

export const fileService = {
  validateDeckFile(file: File, maxSizeBytes = 10 * 1024 * 1024): ServiceResult<File> {
    try {
      if (!file) {
        return {
          success: false,
          error: { code: "NO_FILE", message: "No file selected." },
        };
      }

      // Validate format (PDF, Word, PowerPoint)
      const allowedExtensions = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      const nameLower = file.name.toLowerCase();
      const hasValidExtension = allowedExtensions.some((ext) => nameLower.endsWith(ext));
      const hasValidMime = allowedMimeTypes.includes(file.type);

      if (!hasValidExtension && !hasValidMime) {
        return {
          success: false,
          error: {
            code: "UNSUPPORTED_FORMAT",
            message: "Unsupported format. The Deckwise MVP supports PDF, Word (.doc, .docx), and PowerPoint (.ppt, .pptx) files.",
          },
        };
      }

      // Check for empty file
      if (file.size === 0) {
        return {
          success: false,
          error: { code: "EMPTY_FILE", message: "File is empty. Please select a valid document." },
        };
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
        return {
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: `File size exceeds the limit. Maximum size is ${sizeMb} MB.`,
          },
        };
      }

      return { success: true, data: file };
    } catch (error: any) {
      return {
        success: false,
        error: { code: "VALIDATION_FAILED", message: error.message || "File validation failed." },
      };
    }
  },

  getFileMetadata(file: File) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    };
  },
};
