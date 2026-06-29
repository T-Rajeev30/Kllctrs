"use client";

import { useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const VALID_EXTENSIONS = [".html", ".htm"];

interface HtmlUploaderProps {
  onFileSelected?: (file: File | null) => void;
}

export default function HtmlUploader({ onFileSelected }: HtmlUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [dragging, setDragging] = useState(false);

  const [error, setError] = useState("");

  function validate(file: File) {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!VALID_EXTENSIONS.includes(extension)) {
      return "Only .html and .htm files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Maximum file size is 10 MB.";
    }

    return "";
  }

  function handleFile(file: File) {
    const validationError = validate(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      onFileSelected?.(null);
      return;
    }

    setError("");
    setSelectedFile(file);
    onFileSelected?.(file);
  }

  function browseFiles() {
    inputRef.current?.click();
  }

  function removeFile() {
    setSelectedFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onFileSelected?.(null);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} Bytes`;

    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Step 2 • Upload HTML</h2>

      <div
        className={`rounded-xl border-2 border-dashed p-10 text-center transition-all
        ${dragging ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();

          setDragging(false);

          if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <div className="space-y-4">
          <div className="text-6xl">📄</div>

          <div>
            <h3 className="text-lg font-semibold">Drag and Drop HTML File</h3>

            <p className="mt-2 text-gray-500">or click below to browse</p>
          </div>

          <button
            type="button"
            onClick={browseFiles}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Browse Files
          </button>

          <p className="text-sm text-gray-500">
            Supported: .html, .htm (Max 10 MB)
          </p>
        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".html,.htm,text/html"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>

      {selectedFile && (
        <div className="rounded-xl border bg-green-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{selectedFile.name}</p>

              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            <button
              onClick={removeFile}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
      )}
    </div>
  );
}
