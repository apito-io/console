export function formatBytes(size) {
    if (!Number.isFinite(size) || size <= 0) {
        return "0 B";
    }
    const units = ["B", "KB", "MB", "GB"];
    let value = size;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    const precision = unitIndex === 0 ? 0 : 1;
    return `${value.toFixed(precision)} ${units[unitIndex]}`;
}
export function formatRelativeTime(iso) {
    if (!iso) {
        return "";
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) {
        return "just now";
    }
    if (minutes < 60) {
        return `${minutes} min ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hr ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }
    return date.toLocaleDateString();
}
export function isImageFile(file) {
    if (file.file_type === "media") {
        return true;
    }
    const ct = (file.content_type ?? "").toLowerCase();
    return ct.startsWith("image/");
}
export function displayFileName(file) {
    const base = file.file_name?.trim() || "file";
    const ext = file.file_extension?.trim();
    if (!ext) {
        return base;
    }
    if (base.toLowerCase().endsWith(`.${ext.toLowerCase()}`)) {
        return base;
    }
    return `${base}.${ext}`;
}
export const FILE_TYPE_OPTIONS = [
    { label: "All types", value: "" },
    { label: "Media", value: "media" },
    { label: "PDF", value: "pdf" },
    { label: "Documents", value: "document" },
    { label: "Other", value: "other" },
];
export const UPLOAD_FILE_TYPE_OPTIONS = FILE_TYPE_OPTIONS.filter((opt) => opt.value !== "");
