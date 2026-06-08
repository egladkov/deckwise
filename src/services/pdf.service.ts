import { ServiceResult } from "../types";
import { extractPdfText } from "../lib/pdf/extract-pdf-text";

export const pdfService = {
  async extractText(file: File): Promise<ServiceResult<string>> {
    try {
      const text = await extractPdfText(file);
      return { success: true, data: text };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: "PDF_EXTRACTION_FAILED",
          message: error.message || "Failed to extract text from the PDF file.",
        },
      };
    }
  },
};
