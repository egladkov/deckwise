"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { fileService } from "../../services/file.service";

interface UploadDeckCardProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const UploadDeckCard: React.FC<UploadDeckCardProps> = ({
  onFileSelect,
  selectedFile,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    const validation = fileService.validateDeckFile(file);
    if (validation.success) {
      onFileSelect(file);
    } else {
      setError(validation.error.message);
      onFileSelect(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="w-full font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        onChange={handleChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px] ${
            isDragActive
              ? "border-gold bg-gold/5 shadow-[0_0_12px_rgba(201,162,39,0.2)] scale-[0.99]"
              : "border-line bg-paper-warm/20 hover:bg-paper-warm/40 hover:border-gold/50"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-paper-deep text-gold flex items-center justify-center mb-4 shadow-sm border border-line">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-display font-semibold text-navy mb-1.5">
            Upload your presentation
          </h3>
          <p className="text-sm text-muted max-w-sm mb-4 leading-relaxed">
            Drag and drop your PDF, Word, or PowerPoint file here, or click to browse. Maximum file size: 10 MB.
          </p>
          <button
            type="button"
            className="px-4 py-2 border border-line bg-paper-warm text-navy hover:border-gold hover:bg-paper rounded-md text-xs font-semibold transition-all duration-300 shadow-sm"
          >
            Select File
          </button>

          {error && (
            <p className="mt-4 text-xs font-medium text-burgundy bg-burgundy/5 px-3 py-1.5 rounded-lg border border-burgundy/20 animate-fade-up">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="border border-line rounded-xl p-5 bg-paper-warm/40 flex items-center justify-between gap-4 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-navy/10 text-navy flex items-center justify-center border border-navy/10 shrink-0">
              <FileText className="w-6 h-6 text-gold" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-navy truncate max-w-[200px] sm:max-w-[400px]">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-muted font-mono">
                {formatSize(selectedFile.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="p-2 rounded-md border border-line bg-paper hover:bg-burgundy/10 text-muted hover:text-burgundy transition-all duration-300"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
