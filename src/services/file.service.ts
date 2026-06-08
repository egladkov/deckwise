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

      // Validate format (PDF only)
      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      if (!isPdf) {
        return {
          success: false,
          error: {
            code: "UNSUPPORTED_FORMAT",
            message: "Unsupported format. The Deckwise MVP only supports PDF files.",
          },
        };
      }

      // Check for empty file
      if (file.size === 0) {
        return {
          success: false,
          error: { code: "EMPTY_FILE", message: "File is empty. Please select a valid PDF." },
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
