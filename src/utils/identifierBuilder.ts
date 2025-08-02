/**
 * Utility function to build field identifiers from labels
 * Converts any string to a valid field identifier format
 * 
 * @param label - The field label to convert to identifier
 * @returns A valid field identifier string
 */
export const buildFieldIdentifier = (label: string): string => {
    if (!label || typeof label !== 'string') {
        return '';
    }

    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/gi, '_') // Replace non-alphanumeric chars with underscore
        .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
        .replace(/_{2,}/g, '_'); // Replace multiple consecutive underscores with single
};

/**
 * Utility function to build duplicate field identifier
 * Adds "_copy" suffix to the original identifier
 * 
 * @param originalLabel - The original field label
 * @returns A valid duplicate field identifier
 */
export const buildDuplicateIdentifier = (originalLabel: string): string => {
    const baseIdentifier = buildFieldIdentifier(originalLabel);
    return baseIdentifier ? `${baseIdentifier}_copy` : 'copy';
};

/**
 * Utility function to validate if a string is a valid field identifier
 * 
 * @param identifier - The identifier to validate
 * @returns True if valid, false otherwise
 */
export const isValidFieldIdentifier = (identifier: string): boolean => {
    if (!identifier || typeof identifier !== 'string') {
        return false;
    }

    // Must start with a letter and contain only letters, numbers, and underscores
    const validPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return validPattern.test(identifier);
}; 