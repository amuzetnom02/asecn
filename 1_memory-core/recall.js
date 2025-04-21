/**
 * Memory Core recall module
 * Advanced memory search and retrieval functionality
 */
const logger = require('../8_utilities/logger');
const readMemory = require('./read');

/**
 * Searches for and retrieves memory entries matching criteria
 * 
 * @param {string|Object} query - Search query string or filter object
 * @param {Object} [options] - Search options
 * @param {boolean} [options.caseSensitive=false] - Whether to perform case-sensitive text search
 * @param {string} [options.sortBy='timestamp'] - Field to sort results by
 * @param {boolean} [options.sortDesc=true] - Whether to sort in descending order
 * @param {number} [options.limit] - Maximum number of results to return
 * @param {string[]} [options.fields] - Specific fields to search in (for string queries)
 * @param {boolean} [options.exactMatch=false] - For object queries, whether fields must match exactly
 * @returns {Array} Matching memory entries
 */
function recallMemory(query = '', options = {}) {
  try {
    // Set default options
    const {
      caseSensitive = false,
      sortBy = 'timestamp',
      sortDesc = true,
      limit,
      fields,
      exactMatch = false
    } = options;
    
    // Read memory state
    const memory = readMemory();
    
    // If no query, return all (possibly limited) entries
    if (!query) {
      logger.debug('memory-core', 'Recalling all memory entries');
      return sortAndLimitResults(memory, sortBy, sortDesc, limit);
    }
    
    let results;
    
    // Handle string queries (text search)
    if (typeof query === 'string') {
      const searchTerms = caseSensitive ? query : query.toLowerCase();
      
      results = memory.filter(entry => {
        // If fields are specified, only search in those fields
        if (fields && Array.isArray(fields) && fields.length > 0) {
          return fields.some(field => {
            const value = entry[field];
            if (typeof value === 'string') {
              return caseSensitive ? 
                value.includes(searchTerms) : 
                value.toLowerCase().includes(searchTerms);
            }
            return false;
          });
        }
        
        // Otherwise search in the entire stringified entry
        const entryString = caseSensitive ? 
          JSON.stringify(entry) : 
          JSON.stringify(entry).toLowerCase();
        
        return entryString.includes(searchTerms);
      });
      
      logger.debug('memory-core', `Text search for "${query}" returned ${results.length} results`);
    } 
    // Handle object queries (field matching)
    else if (typeof query === 'object' && query !== null) {
      results = memory.filter(entry => {
        return Object.entries(query).every(([field, value]) => {
          // Skip null or undefined query values
          if (value === null || value === undefined) {
            return true;
          }
          
          // Handle exact matching
          if (exactMatch) {
            return JSON.stringify(entry[field]) === JSON.stringify(value);
          }
          
          // Handle field doesn't exist
          if (entry[field] === undefined) {
            return false;
          }
          
          // Handle different types of values
          if (typeof value === 'string') {
            // String comparison (case insensitive unless specified)
            const entryValue = entry[field];
            return typeof entryValue === 'string' && (
              caseSensitive ? 
                entryValue.includes(value) : 
                entryValue.toLowerCase().includes(value.toLowerCase())
            );
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            // Direct comparison for numbers and booleans
            return entry[field] === value;
          } else if (Array.isArray(value)) {
            // Check if array contains all elements
            return Array.isArray(entry[field]) && 
                  value.every(v => entry[field].includes(v));
          } else if (typeof value === 'object') {
            // Recursive object comparison
            return typeof entry[field] === 'object' &&
                  entry[field] !== null &&
                  Object.keys(value).every(k => 
                    JSON.stringify(entry[field][k]) === JSON.stringify(value[k])
                  );
          }
          
          return false;
        });
      });
      
      logger.debug('memory-core', `Object query returned ${results.length} results`);
    } else {
      // Invalid query type
      logger.warn('memory-core', `Invalid recall query type: ${typeof query}`);
      return [];
    }
    
    return sortAndLimitResults(results, sortBy, sortDesc, limit);
  } catch (error) {
    logger.error('memory-core', 'Error in memory recall', { query, options }, error);
    return [];
  }
}

/**
 * Helper function to sort and limit results
 * 
 * @param {Array} results - Results to sort and limit
 * @param {string} sortBy - Field to sort by
 * @param {boolean} sortDesc - Whether to sort in descending order
 * @param {number} limit - Maximum number of results
 * @returns {Array} Sorted and limited results
 */
function sortAndLimitResults(results, sortBy, sortDesc, limit) {
  // Sort results if sortBy is specified
  if (sortBy) {
    results.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      // Handle undefined values
      if (valueA === undefined && valueB === undefined) return 0;
      if (valueA === undefined) return sortDesc ? 1 : -1;
      if (valueB === undefined) return sortDesc ? -1 : 1;
      
      // Handle different value types
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDesc ? 
          valueB.localeCompare(valueA) : 
          valueA.localeCompare(valueB);
      } else {
        return sortDesc ? 
          (valueB > valueA ? 1 : -1) : 
          (valueA > valueB ? 1 : -1);
      }
    });
  }
  
  // Limit results if limit is specified
  if (limit && limit > 0) {
    return results.slice(0, limit);
  }
  
  return results;
}

module.exports = recallMemory;
