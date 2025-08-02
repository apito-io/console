/**
 * Utility functions for handling different data types in tables
 */

/**
 * Check if a value is a simple data type that can be displayed in table columns
 */
export const isSimpleDataType = (value: any): boolean => {
    if (value === null || value === undefined) return true;

    const type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
};

/**
 * Check if a value is a complex data type (object or array)
 */
export const isComplexDataType = (value: any): boolean => {
    if (value === null || value === undefined) return false;

    return typeof value === 'object' || Array.isArray(value);
};

/**
 * Get the display value for a simple data type
 */
export const getSimpleDisplayValue = (value: any): string => {
    if (value === null || value === undefined) return '-';

    const type = typeof value;

    if (type === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (type === 'number') {
        return value.toString();
    }

    return String(value);
};

/**
 * Format field name for display (convert snake_case to Title Case)
 */
export const formatFieldName = (fieldName: string): string => {
    return fieldName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Determine if a field should be displayed as a wrapped title (for long names)
 */
export const shouldWrapTitle = (title: string): boolean => {
    return title.length > 15;
};

/**
 * Split long titles into multiple lines for better display
 */
export const splitTitle = (title: string): string[] => {
    if (title.length <= 15) return [title];

    const words = title.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        if (currentLine === '') {
            currentLine = word;
        } else if ((currentLine + ' ' + word).length <= 15) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
};

/**
 * Classify fields in a dataset into simple and complex types
 */
export const classifyFields = (data: Record<string, any>[]): {
    simpleFields: string[];
    complexFields: string[];
} => {
    if (data.length === 0) {
        return { simpleFields: [], complexFields: [] };
    }

    const allFields = new Set<string>();
    const simpleFields = new Set<string>();
    const complexFields = new Set<string>();

    // Collect all fields from all records (filter out system_ fields)
    data.forEach(record => {
        Object.keys(record).forEach(key => {
            if (key !== 'id' && key !== 'meta' && !key.startsWith('system_')) {
                allFields.add(key);
            }
        });
    });

    // Classify each field based on its values across all records
    allFields.forEach(field => {
        let hasSimpleType = false;
        let hasComplexType = false;

        // Check the field type across multiple records to get a better classification
        for (let i = 0; i < Math.min(data.length, 5); i++) {
            const value = data[i][field];

            if (isSimpleDataType(value)) {
                hasSimpleType = true;
            } else if (isComplexDataType(value)) {
                hasComplexType = true;
            }
        }

        // If field has any complex type, classify it as complex
        // This ensures consistency across all records
        if (hasComplexType) {
            complexFields.add(field);
        } else if (hasSimpleType) {
            simpleFields.add(field);
        }
    });

    return {
        simpleFields: Array.from(simpleFields),
        complexFields: Array.from(complexFields)
    };
};

/**
 * Get a preview of complex data for display in collapsed state
 */
export const getComplexDataPreview = (value: any): string => {
    if (value === null || value === undefined) return '-';

    if (Array.isArray(value)) {
        return `Array (${value.length} items)`;
    }

    if (typeof value === 'object') {
        const keys = Object.keys(value);
        return `Object (${keys.length} properties)`;
    }

    return String(value);
}; 