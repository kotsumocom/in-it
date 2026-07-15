/**
 * FileUpload component (hono/jsx/dom)
 * WAI-ARIA compliant file upload with drag & drop.
 */
import { useState, useCallback, useRef } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";
import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for FileUpload — co-located for self-containment. */
export const FILE_UPLOAD_CSS = `/* --- FileUpload --- */
.ii-file-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ii-file-upload__dropzone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 160px;
  padding: 24px;
  border: 2px dashed var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  background: var(--ii-surface-container-low);
  cursor: pointer;
  transition: border-color 200ms ease, background 200ms ease;
}
.ii-file-upload__dropzone:hover {
  border-color: var(--ii-primary);
  background: var(--ii-surface-container);
}
.ii-file-upload__dropzone:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
}
.ii-file-upload__dropzone--drag {
  border-color: var(--ii-primary);
  background: color-mix(in srgb, var(--ii-primary) 8%, var(--ii-surface));
}
.ii-file-upload__dropzone--disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}
.ii-file-upload__icon {
  font-size: 2rem;
  color: var(--ii-on-surface-variant);
}
.ii-file-upload__label {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  text-align: center;
}
.ii-file-upload__browse {
  color: var(--ii-primary);
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 200ms ease;
}
.ii-file-upload__browse:hover {
  text-decoration-color: var(--ii-primary);
}
.ii-file-upload__hint {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-file-upload__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.ii-file-upload__input:disabled { cursor: not-allowed; }
.ii-file-upload__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ii-file-upload__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--ii-surface-container);
  border-radius: var(--ii-shape-md);
  border: 1px solid var(--ii-outline-variant);
}
.ii-file-upload__preview {
  width: 40px;
  height: 40px;
  border-radius: var(--ii-shape-sm);
  object-fit: cover;
  flex-shrink: 0;
}
.ii-file-upload__preview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--ii-shape-sm);
  background: var(--ii-surface-container-high);
  color: var(--ii-on-surface-variant);
  flex-shrink: 0;
}
.ii-file-upload__info {
  flex: 1;
  min-width: 0;
}
.ii-file-upload__name {
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ii-file-upload__size {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-file-upload__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--ii-on-surface-variant);
  cursor: pointer;
  transition: background 150ms ease;
  flex-shrink: 0;
}
.ii-file-upload__remove:hover {
  background: var(--ii-surface-container-highest);
}
.ii-file-upload__remove:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: -2px;
}
.ii-file-upload__error {
  font-size: var(--ii-font-sm);
  color: var(--ii-error);
  display: flex;
  align-items: center;
  gap: 4px;
}
`;

/** File validation error details. */
export interface FileUploadError {
  type: "size" | "type" | "count";
  message: string;
  file?: File;
}

/** Locale keys used by FileUpload. */
type FileUploadLabelKeys = "dropFiles" | "browseFiles" | "fileTooLarge" | "invalidFileType" | "tooManyFiles" | "remove";

const FILE_UPLOAD_KEYS: readonly FileUploadLabelKeys[] = [
  "dropFiles", "browseFiles", "fileTooLarge", "invalidFileType", "tooManyFiles", "remove",
] as const;

/** Props for the FileUpload component. */
export interface FileUploadProps {
  /** Accepted MIME types / extensions (e.g. "image/*", ".pdf,.doc"). */
  accept?: string;
  /** Maximum file size in bytes. */
  maxSize?: number;
  /** Maximum number of files (default: 1). */
  maxFiles?: number;
  /** Allow multiple file selection. */
  multiple?: boolean;
  /** Disable the upload area. */
  disabled?: boolean;
  /** Hint text below the drop label (e.g. "PNG, JPG up to 10MB"). */
  hint?: string;
  /** Custom dropzone content. */
  children?: any;
  /** Called with validated files. */
  onFiles?: (files: File[]) => void;
  /** Called on validation error. */
  onError?: (error: FileUploadError) => void;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, FileUploadLabelKeys>>;
}

/** Format bytes to human-readable string. */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Check if a file matches the accept string. */
function matchesAccept(file: File, accept: string): boolean {
  const types = accept.split(",").map((s) => s.trim());
  for (const t of types) {
    if (t.startsWith(".")) {
      if (file.name.toLowerCase().endsWith(t.toLowerCase())) return true;
    } else if (t.endsWith("/*")) {
      const category = t.slice(0, t.indexOf("/"));
      if (file.type.startsWith(category + "/")) return true;
    } else {
      if (file.type === t) return true;
    }
  }
  return false;
}

/** Drag-and-drop file upload with preview and validation. */
export function FileUpload({
  accept,
  maxSize,
  maxFiles = 1,
  multiple = false,
  disabled = false,
  hint,
  children,
  onFiles,
  onError,
  labels: labelOverrides,
}: FileUploadProps): any {
  injectCSS("ii-file-upload", FILE_UPLOAD_CSS);
  const l = useLabels(FILE_UPLOAD_KEYS, labelOverrides);

  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveMax = multiple ? maxFiles : 1;

  const validate = useCallback((incoming: File[]): File[] => {
    const valid: File[] = [];
    for (const file of incoming) {
      // Type check
      if (accept && !matchesAccept(file, accept)) {
        const err: FileUploadError = {
          type: "type",
          message: l.invalidFileType,
          file,
        };
        setError(err.message);
        onError?.(err);
        continue;
      }
      // Size check
      if (maxSize && file.size > maxSize) {
        const err: FileUploadError = {
          type: "size",
          message: `${l.fileTooLarge} (${formatSize(maxSize)})`,
          file,
        };
        setError(err.message);
        onError?.(err);
        continue;
      }
      valid.push(file);
    }
    return valid;
  }, [accept, maxSize, onError]);

  const addFiles = useCallback((incoming: File[]) => {
    setError(null);
    const validated = validate(incoming);
    if (validated.length === 0) return;

    const merged = multiple ? [...files, ...validated] : validated;

    // Count check
    if (merged.length > effectiveMax) {
      const err: FileUploadError = {
        type: "count",
        message: l.tooManyFiles,
      };
      setError(err.message);
      onError?.(err);
      const trimmed = merged.slice(0, effectiveMax);
      setFiles(trimmed);
      onFiles?.(trimmed);
      generatePreviews(trimmed);
      return;
    }

    setFiles(merged);
    onFiles?.(merged);
    generatePreviews(merged);
  }, [files, multiple, effectiveMax, validate, onFiles, onError]);

  const generatePreviews = useCallback((fileList: File[]) => {
    const newPreviews: Record<string, string> = {};
    for (const f of fileList) {
      if (f.type.startsWith("image/")) {
        newPreviews[f.name + f.size] = URL.createObjectURL(f);
      }
    }
    // Revoke old previews
    for (const url of Object.values(previews)) {
      URL.revokeObjectURL(url);
    }
    setPreviews(newPreviews);
  }, [previews]);

  const removeFile = useCallback((index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFiles?.(next);
    generatePreviews(next);
    setError(null);
  }, [files, onFiles, generatePreviews]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer?.files ?? []);
    if (dropped.length > 0) addFiles(dropped);
  }, [disabled, addFiles]);

  const handleChange = useCallback((e: Event) => {
    const input = e.target as HTMLInputElement;
    const selected = Array.from(input.files ?? []);
    if (selected.length > 0) addFiles(selected);
    input.value = "";
  }, [addFiles]);

  const dzClass = [
    "ii-file-upload__dropzone",
    dragging && "ii-file-upload__dropzone--drag",
    disabled && "ii-file-upload__dropzone--disabled",
  ].filter(Boolean).join(" ");

  return (
    <div class="ii-file-upload">
      {/* Drop zone */}
      <div
        class={dzClass}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={l.dropFiles}
        onClick={() => { if (!disabled) inputRef.current?.click(); }}
        onKeyDown={(e: KeyboardEvent) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {children ?? (
          <>
            <span class="ii-file-upload__icon">
              <Icon name="upload" size={32} />
            </span>
            <span class="ii-file-upload__label">
              {l.dropFiles}{" "}
              <span class="ii-file-upload__browse">{l.browseFiles}</span>
            </span>
            {hint && <span class="ii-file-upload__hint">{hint}</span>}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          class="ii-file-upload__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          tabIndex={-1}
          aria-hidden={true}
        />
      </div>

      {/* Error message */}
      {error && (
        <div class="ii-file-upload__error" role="alert">
          <Icon name="alert-circle" size={14} />
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div class="ii-file-upload__list" role="list">
          {files.map((file, i) => {
            const key = file.name + file.size;
            const preview = previews[key];
            return (
              <div key={key} class="ii-file-upload__item" role="listitem">
                {preview ? (
                  <img
                    class="ii-file-upload__preview"
                    src={preview}
                    alt={file.name}
                  />
                ) : (
                  <span class="ii-file-upload__preview-icon">
                    <Icon name="file" size={20} />
                  </span>
                )}
                <div class="ii-file-upload__info">
                  <div class="ii-file-upload__name">{file.name}</div>
                  <div class="ii-file-upload__size">{formatSize(file.size)}</div>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    class="ii-file-upload__remove"
                    aria-label={`${l.remove} ${file.name}`}
                    onClick={(e: Event) => { e.stopPropagation(); removeFile(i); }}
                  >
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
