/**
 * Constants Generation Configuration
 * 
 * This file contains all configuration settings for the Nuxeo constants
 * generation system. It defines server connections, output paths, and
 * generation behavior settings.
 */

module.exports = {
  // Server Configuration
  server: {
    // Base URL for Nuxeo server
    baseUrl: process.env.NUXEO_URL || 'http://localhost:8080/nuxeo',
    
    // Authentication credentials
    auth: {
      username: process.env.NUXEO_USERNAME || 'Administrator',
      password: process.env.NUXEO_PASSWORD || 'Administrator'
    },
    
    // API endpoints for discovery
    endpoints: {
      automation: '/site/automation',
      operations: '/site/automation',
      schemas: '/api/v1/config/schemas',
      doctypes: '/api/v1/config/types',
      facets: '/api/v1/config/facets'
    },
    
    // Request configuration
    timeout: 30000,
    retries: 3,
    retryDelay: 1000
  },

  // Output Configuration
  output: {
    // Base directory for generated constants
    baseDir: './src/core/constants',
    
    // Specific file paths
    files: {
      operations: './src/core/constants/nuxeo.constants.ts',
      documentTypes: './src/core/constants/nuxeo.constants.ts',
      schemas: './src/core/constants/nuxeo.constants.ts',
      workflows: './src/core/constants/nuxeo.constants.ts',
      index: './src/core/constants/nuxeo.constants.ts'
    },
    
    // Backup settings
    backup: {
      enabled: true,
      directory: './backups/constants',
      keepCount: 10
    }
  },

  // Generation Behavior
  generation: {
    // Include categories
    categories: {
      operations: true,
      documentTypes: true,
      schemas: true,
      workflows: true,
      userInterface: false, // UI operations are less stable
      system: false        // System operations are internal
    },
    
    // Naming conventions
    naming: {
      constantCase: 'SCREAMING_SNAKE_CASE',
      duplicateStrategy: 'suffix', // 'suffix' | 'namespace' | 'skip'
      prefixes: {
        operations: 'OP_',
        documentTypes: 'DOC_',
        schemas: 'SCHEMA_',
        workflows: 'WF_'
      }
    },
    
    // Code generation options
    codeStyle: {
      indentation: '  ', // 2 spaces
      lineLength: 100,
      sortAlphabetically: true,
      includeDescriptions: true,
      includeMetadata: true
    },
    
    // Validation settings
    validation: {
      checkDuplicates: true,
      validateNaming: true,
      requireDescriptions: false,
      failOnWarnings: false
    }
  },

  // Logging Configuration
  logging: {
    level: 'info', // 'debug' | 'info' | 'warn' | 'error'
    outputFile: './logs/generation.log',
    includeTimestamps: true,
    colorOutput: true
  },

  // Environment-specific overrides
  environments: {
    development: {
      server: {
        baseUrl: 'http://localhost:8080/nuxeo'
      },
      logging: {
        level: 'debug'
      }
    },
    
    staging: {
      server: {
        baseUrl: process.env.NUXEO_STAGING_URL
      },
      validation: {
        failOnWarnings: true
      }
    },
    
    production: {
      server: {
        baseUrl: process.env.NUXEO_PROD_URL
      },
      validation: {
        failOnWarnings: true
      },
      backup: {
        keepCount: 20
      }
    }
  },

  // Feature flags
  features: {
    experimentalOperations: false,
    asyncGeneration: true,
    parallelRequests: true,
    cacheResults: true,
    diffGeneration: true
  }
};