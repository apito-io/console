/** True when the engine can build project S3 storage for /secured/files. */
export function isProjectStorageConfigured(settings) {
    if (!settings) {
        return false;
    }
    if (settings.use_free_cloud_storage) {
        return true;
    }
    return Boolean(settings.bucket?.trim() &&
        settings.access_key_id?.trim() &&
        settings.has_secret_access_key);
}
