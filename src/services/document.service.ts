import { ServiceResult } from "../types";
import { extractDocumentText } from "../lib/document/extract-document-text";

export const documentService = {
  async extractText(file: File): Promise<ServiceResult<string>> {
    try {
      const text = await extractDocumentText(file);
      return { success: true, data: text };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: "DOCUMENT_EXTRACTION_FAILED",
          message: error.message || "Failed to extract text from the document file.",
        },
      };
    }
  },
};
