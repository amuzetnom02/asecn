/**
 * Schema validator utility for ensuring data integrity across ASECN
 */

/**
 * Validates an object against a schema definition
 * @param {Object} data - Data to validate
 * @param {Object} schema - Schema definition
 * @returns {Object} Validation result with success flag and errors
 */
function validate(data, schema) {
  const errors = [];
  const result = { success: true, errors: [] };

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (data[field] === undefined) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Validate field types and formats
  if (schema.properties) {
    for (const [field, definition] of Object.entries(schema.properties)) {
      if (data[field] !== undefined) {
        // Type checking
        if (definition.type && !checkType(data[field], definition.type)) {
          errors.push(`Invalid type for ${field}: expected ${definition.type}`);
        }

        // Format validation
        if (definition.format && !checkFormat(data[field], definition.format)) {
          errors.push(`Invalid format for ${field}: expected ${definition.format}`);
        }

        // Min/Max validation for numbers
        if (definition.type === 'number' || definition.type === 'integer') {
          if (definition.minimum !== undefined && data[field] < definition.minimum) {
            errors.push(`${field} must be at least ${definition.minimum}`);
          }
          if (definition.maximum !== undefined && data[field] > definition.maximum) {
            errors.push(`${field} must be at most ${definition.maximum}`);
          }
        }

        // Length validation for strings and arrays
        if ((definition.type === 'string' || definition.type === 'array') && data[field].length !== undefined) {
          if (definition.minLength !== undefined && data[field].length < definition.minLength) {
            errors.push(`${field} must have at least ${definition.minLength} items/characters`);
          }
          if (definition.maxLength !== undefined && data[field].length > definition.maxLength) {
            errors.push(`${field} must have at most ${definition.maxLength} items/characters`);
          }
        }

        // Pattern validation for strings
        if (definition.type === 'string' && definition.pattern) {
          const regex = new RegExp(definition.pattern);
          if (!regex.test(data[field])) {
            errors.push(`${field} does not match required pattern`);
          }
        }

        // Enum validation
        if (definition.enum && !definition.enum.includes(data[field])) {
          errors.push(`${field} must be one of: ${definition.enum.join(', ')}`);
        }

        // Nested object validation
        if (definition.type === 'object' && definition.properties) {
          const nestedResult = validate(data[field], definition);
          if (!nestedResult.success) {
            errors.push(...nestedResult.errors.map(err => `${field}.${err}`));
          }
        }

        // Array item validation
        if (definition.type === 'array' && definition.items && Array.isArray(data[field])) {
          for (let i = 0; i < data[field].length; i++) {
            if (definition.items.type === 'object' && definition.items.properties) {
              const itemResult = validate(data[field][i], definition.items);
              if (!itemResult.success) {
                errors.push(...itemResult.errors.map(err => `${field}[${i}].${err}`));
              }
            } else {
              if (!checkType(data[field][i], definition.items.type)) {
                errors.push(`Invalid type for item in ${field} at index ${i}: expected ${definition.items.type}`);
              }
            }
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    result.success = false;
    result.errors = errors;
  }

  return result;
}

/**
 * Checks if a value matches the specified type
 * @param {any} value - Value to check
 * @param {string} type - Expected type
 * @returns {boolean} Whether the value matches the type
 */
function checkType(value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'integer':
      return Number.isInteger(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'null':
      return value === null;
    default:
      return true; // Unknown type, assume valid
  }
}

/**
 * Checks if a value matches the specified format
 * @param {any} value - Value to check
 * @param {string} format - Expected format
 * @returns {boolean} Whether the value matches the format
 */
function checkFormat(value, format) {
  switch (format) {
    case 'date':
      return !isNaN(Date.parse(value));
    case 'date-time':
      return !isNaN(Date.parse(value));
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'uri':
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    case 'ipv4':
      return /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
    case 'hex':
      return /^[0-9a-fA-F]+$/.test(value);
    case 'base64':
      return /^[a-zA-Z0-9+/]+=*$/.test(value);
    case 'uuid':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    case 'ethereum-address':
      return /^0x[a-fA-F0-9]{40}$/.test(value);
    case 'transaction-hash':
      return /^0x[a-fA-F0-9]{64}$/.test(value);
    default:
      return true; // Unknown format, assume valid
  }
}

/**
 * Creates a validator function for a specific schema
 * @param {Object} schema - Schema definition
 * @returns {Function} Validator function that accepts data and returns validation result
 */
function createValidator(schema) {
  return (data) => validate(data, schema);
}

// Common schemas for ASECN
const SCHEMAS = {
  ethereumTransaction: {
    type: 'object',
    required: ['to', 'value'],
    properties: {
      to: { type: 'string', format: 'ethereum-address' },
      value: { type: 'string' }, // String for big numbers in wei
      data: { type: 'string', format: 'hex' },
      gasLimit: { type: 'string' },
      gasPrice: { type: 'string' },
      nonce: { type: 'integer', minimum: 0 }
    }
  },
  
  nftMetadata: {
    type: 'object',
    required: ['name', 'description'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      image: { type: 'string', format: 'uri' },
      attributes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            trait_type: { type: 'string' },
            value: { type: 'string' }
          }
        }
      }
    }
  },
  
  memoryEntry: {
    type: 'object',
    required: ['timestamp'],
    properties: {
      timestamp: { type: 'string', format: 'date-time' },
      source: { type: 'string' },
      data: { type: 'object' }
    }
  }
};

module.exports = {
  validate,
  createValidator,
  SCHEMAS
};