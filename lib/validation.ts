/**
 * Input validation utilities for API routes
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates required string fields
 */
export function validateRequiredString(value: any, fieldName: string): ValidationError | null {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return {
      field: fieldName,
      message: `${fieldName} is required and must be a non-empty string`
    };
  }
  return null;
}

/**
 * Validates required number fields
 */
export function validateRequiredNumber(value: any, fieldName: string): ValidationError | null {
  if (value === undefined || value === null || typeof value !== 'number' || isNaN(value)) {
    return {
      field: fieldName,
      message: `${fieldName} is required and must be a valid number`
    };
  }
  return null;
}

/**
 * Validates positive number fields
 */
export function validatePositiveNumber(value: any, fieldName: string): ValidationError | null {
  const numberError = validateRequiredNumber(value, fieldName);
  if (numberError) return numberError;
  
  if (value <= 0) {
    return {
      field: fieldName,
      message: `${fieldName} must be a positive number`
    };
  }
  return null;
}

/**
 * Validates number range
 */
export function validateNumberRange(value: any, fieldName: string, min: number, max: number): ValidationError | null {
  const numberError = validateRequiredNumber(value, fieldName);
  if (numberError) return numberError;
  
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`
    };
  }
  return null;
}

/**
 * Validates UUID format
 */
export function validateUUID(value: any, fieldName: string): ValidationError | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!value || typeof value !== 'string' || !uuidRegex.test(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid UUID`
    };
  }
  return null;
}

/**
 * Validates array fields
 */
export function validateArray(value: any, fieldName: string, minLength: number = 0): ValidationError | null {
  if (!Array.isArray(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be an array`
    };
  }
  
  if (value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must contain at least ${minLength} items`
    };
  }
  
  return null;
}

/**
 * Validates enum values
 */
export function validateEnum(value: any, fieldName: string, allowedValues: string[]): ValidationError | null {
  if (!value || !allowedValues.includes(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be one of: ${allowedValues.join(', ')}`
    };
  }
  return null;
}

/**
 * Validates object structure
 */
export function validateObject(value: any, fieldName: string, requiredFields: string[]): ValidationError | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be an object`
    };
  }
  
  for (const field of requiredFields) {
    if (!(field in value)) {
      return {
        field: fieldName,
        message: `${fieldName} must contain required field: ${field}`
      };
    }
  }
  
  return null;
}

/**
 * Validates string length
 */
export function validateStringLength(value: any, fieldName: string, minLength: number, maxLength: number): ValidationError | null {
  const stringError = validateRequiredString(value, fieldName);
  if (stringError) return stringError;
  
  if (value.length < minLength || value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${minLength} and ${maxLength} characters`
    };
  }
  return null;
}

/**
 * Validates session ID format (alphanumeric with hyphens)
 */
export function validateSessionId(value: any, fieldName: string): ValidationError | null {
  const sessionIdRegex = /^[a-zA-Z0-9-_]+$/;
  if (!value || typeof value !== 'string' || !sessionIdRegex.test(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid session ID (alphanumeric with hyphens and underscores)`
    };
  }
  return null;
}

/**
 * Combines multiple validation results
 */
export function combineValidationResults(...results: (ValidationError | null)[]): ValidationResult {
  const errors = results.filter((result): result is ValidationError => result !== null);
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates a standardized error response for validation failures
 */
export function createValidationErrorResponse(errors: ValidationError[], statusCode: number = 400) {
  return {
    error: 'Validation failed',
    details: errors,
    message: `Validation failed for ${errors.length} field(s)`
  };
}
