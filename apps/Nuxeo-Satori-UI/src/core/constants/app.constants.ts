/**
 * Enterprise Application Constants
 * Centralized constants for Nuxeo integration and application configuration
 */

export const APP_CONSTANTS = {
  // Application Information
  APP: {
    NAME: 'POC Enterprise Nuxeo Integration',
    VERSION: '1.0.0',
    DESCRIPTION: 'Enterprise-grade Angular integration with Nuxeo Platform'
  },

  // HTTP Configuration
  HTTP: {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    CHUNK_SIZE: 1024 * 1024 // 1MB chunks
  },

  // Cache Configuration
  CACHE: {
    DEFAULT_TTL: 300000, // 5 minutes
    USER_TTL: 900000, // 15 minutes
    DOCUMENT_TTL: 600000, // 10 minutes
    DIRECTORY_TTL: 1800000 // 30 minutes
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    DEFAULT_SORT_FIELD: 'dc:modified',
    DEFAULT_SORT_ORDER: 'DESC'
  },

  // UI Constants
  UI: {
    DEBOUNCE_TIME: 300,
    TOAST_DURATION: 5000,
    LOADING_DELAY: 500,
    ANIMATION_DURATION: 250
  },

  // Validation Rules
  VALIDATION: {
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 255,
    MAX_DESCRIPTION_LENGTH: 2000,
    ALLOWED_FILE_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png', '.gif'],
    USERNAME_PATTERN: /^[a-zA-Z0-9_.-]+$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  // Error Codes
  ERRORS: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  }
} as const;