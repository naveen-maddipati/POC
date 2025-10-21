#!/usr/bin/env node

/**
 * Nuxeo Constants Generation Script
 * 
 * Simple script that connects to Nuxeo server, fetches operations,
 * handles duplicates and aliases, and regenerates the constants file.
 */

const fs = require('fs');
const path = require('path');
const NuxeoClient = require('./lib/nuxeo-client');
const baseConfig = require('./generation.config');

// Merge environment-specific configuration
function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = baseConfig.environments[env] || {};
  
  // Deep merge environment config with base config
  const config = JSON.parse(JSON.stringify(baseConfig)); // Deep clone
  
  if (envConfig.server) {
    Object.assign(config.server, envConfig.server);
  }
  if (envConfig.logging) {
    Object.assign(config.logging, envConfig.logging);
  }
  if (envConfig.validation) {
    Object.assign(config.validation, envConfig.validation);
  }
  if (envConfig.backup) {
    Object.assign(config.backup, envConfig.backup);
  }
  
  return config;
}

const config = getConfig();

class ConstantsGenerator {
  constructor() {
    this.client = null;
    this.operations = new Map();
    this.duplicates = new Map();
    this.aliases = new Map();
    
    this.log = this.createLogger();
  }

  createLogger() {
    const colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m'
    };

    return {
      info: (msg) => console.log(`${colors.green}[INFO]${colors.reset} ${msg}`),
      warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
      error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
      success: (msg) => console.log(`${colors.cyan}[SUCCESS]${colors.reset} ${msg}`)
    };
  }

  async run() {
    try {
      this.log.info('🚀 Starting Nuxeo constants generation...');
      
      // Initialize client
      this.client = new NuxeoClient(config);
      
      // Test connection
      const connected = await this.client.testConnection();
      if (!connected) {
        this.log.warn('⚠️ Nuxeo server not available, using existing constants...');
        this.generateFallbackMessage();
        return;
      }
      
      // Try to fetch operations directly with basic auth (skip separate login)
      this.log.info('🔑 Using basic authentication...');
      
      // Fetch all data types
      await this.fetchAllData();
      
      // Process all data (handle duplicates and aliases)
      this.processAllData();
      
      // Generate TypeScript constants file
      await this.generateConstantsFile();
      
      // Cleanup
      await this.client.disconnect();
      
      this.log.success('✅ Constants generation completed successfully!');
      
    } catch (error) {
      this.log.warn(`⚠️ Generation failed: ${error.message}`);
      this.log.info('📋 Using existing constants file...');
      this.generateFallbackMessage();
    }
  }

  generateFallbackMessage() {
    this.log.info('💡 To generate fresh constants, ensure Nuxeo server is running at:');
    this.log.info(`   ${config.server.baseUrl}`);
    this.log.info('💡 Or set NUXEO_URL environment variable to your server URL');
    this.log.info('🔄 Build will continue with existing constants file');
  }

  async fetchAllData() {
    this.log.info('📡 Fetching all data from Nuxeo server...');
    
    try {
      // Fetch operations
      const operations = await this.client.getAutomationOperations();
      this.log.info(`📦 Retrieved ${operations.length} operations`);
      
      // Store operations in map for easier processing
      operations.forEach(op => {
        this.operations.set(op.id, op);
      });

      // Fetch document types
      try {
        this.documentTypes = await this.client.getDocumentTypes();
        this.log.info(`📄 Retrieved ${this.documentTypes.length} document types`);
      } catch (error) {
        this.log.warn(`Could not fetch document types: ${error.message}`);
        this.documentTypes = [];
      }

      // Fetch schemas
      try {
        this.schemas = await this.client.getSchemas();
        this.log.info(`📋 Retrieved ${this.schemas.length} schemas`);
      } catch (error) {
        this.log.warn(`Could not fetch schemas: ${error.message}`);
        this.schemas = [];
      }

      // Fetch facets
      try {
        this.facets = await this.client.getFacets();
        this.log.info(`🏷️ Retrieved ${this.facets.length} facets`);
      } catch (error) {
        this.log.warn(`Could not fetch facets: ${error.message}`);
        this.facets = [];
      }
      
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  processAllData() {
    this.log.info('🔧 Processing all data and handling duplicates...');
    
    // Process operations
    this.processOperations();
    
    // Process document types
    this.processDocumentTypes();
    
    // Process schemas
    this.processSchemas();
    
    // Process facets
    this.processFacets();
  }

  processOperations() {
    this.log.info('🔧 Processing operations and handling duplicates...');
    
    const processedConstants = new Map();
    const nameCount = new Map();
    
    // First pass: count all potential constant names
    for (const [id, operation] of this.operations) {
      const constantName = this.generateConstantName(id);
      nameCount.set(constantName, (nameCount.get(constantName) || 0) + 1);
      
      // Also count aliases
      if (operation.aliases && operation.aliases.length > 0) {
        operation.aliases.forEach(alias => {
          const aliasConstantName = this.generateConstantName(alias);
          nameCount.set(aliasConstantName, (nameCount.get(aliasConstantName) || 0) + 1);
        });
      }
    }
    
    // Second pass: generate unique names for duplicates
    const usedNames = new Set();
    
    for (const [id, operation] of this.operations) {
      const baseConstantName = this.generateConstantName(id);
      let finalConstantName = baseConstantName;
      
      // Handle duplicates by adding suffix
      if (nameCount.get(baseConstantName) > 1) {
        let suffix = 1;
        while (usedNames.has(finalConstantName)) {
          finalConstantName = `${baseConstantName}_${suffix}`;
          suffix++;
        }
        
        if (finalConstantName !== baseConstantName) {
          this.log.warn(`🔄 Duplicate detected: ${baseConstantName} -> ${finalConstantName}`);
          this.duplicates.set(id, finalConstantName);
        }
      }
      
      usedNames.add(finalConstantName);
      processedConstants.set(finalConstantName, {
        id: id,
        operation: operation,
        originalName: baseConstantName
      });
      
      // Process aliases
      if (operation.aliases && operation.aliases.length > 0) {
        operation.aliases.forEach(alias => {
          const aliasConstantName = this.generateConstantName(alias);
          let finalAliasName = aliasConstantName;
          
          // Handle alias duplicates
          if (nameCount.get(aliasConstantName) > 1 || usedNames.has(aliasConstantName)) {
            let suffix = 1;
            while (usedNames.has(finalAliasName)) {
              finalAliasName = `${aliasConstantName}_ALIAS_${suffix}`;
              suffix++;
            }
            
            this.log.warn(`🔄 Alias duplicate: ${aliasConstantName} -> ${finalAliasName}`);
          }
          
          usedNames.add(finalAliasName);
          this.aliases.set(finalAliasName, alias);
          processedConstants.set(finalAliasName, {
            id: alias,
            operation: operation,
            originalName: aliasConstantName,
            isAlias: true,
            aliasFor: id
          });
        });
      }
    }
    
    this.processedConstants = processedConstants;
    
    this.log.info(`✅ Processed ${processedConstants.size} total constants`);
    this.log.info(`🔄 Found ${this.duplicates.size} duplicates`);
    this.log.info(`🏷️ Found ${this.aliases.size} aliases`);
  }

  processDocumentTypes() {
    if (!this.documentTypes || this.documentTypes.length === 0) {
      this.processedDocumentTypes = new Map();
      return;
    }

    this.log.info('🔧 Processing document types...');
    const processedDocTypes = new Map();
    
    this.documentTypes.forEach(docType => {
      const constantName = this.generateConstantName(docType.name);
      processedDocTypes.set(constantName, {
        name: docType.name,
        label: docType.label,
        description: docType.description,
        facets: docType.facets || [],
        schemas: docType.schemas || []
      });
    });

    this.processedDocumentTypes = processedDocTypes;
    this.log.info(`✅ Processed ${processedDocTypes.size} document types`);
  }

  processSchemas() {
    if (!this.schemas || this.schemas.length === 0) {
      this.processedSchemas = new Map();
      return;
    }

    this.log.info('🔧 Processing schemas...');
    const processedSchemas = new Map();
    
    this.schemas.forEach(schema => {
      const constantName = this.generateConstantName(schema.name);
      processedSchemas.set(constantName, {
        name: schema.name,
        prefix: schema.prefix,
        description: schema.description,
        fields: schema.fields || []
      });
    });

    this.processedSchemas = processedSchemas;
    this.log.info(`✅ Processed ${processedSchemas.size} schemas`);
  }

  processFacets() {
    if (!this.facets || this.facets.length === 0) {
      this.processedFacets = new Map();
      return;
    }

    this.log.info('🔧 Processing facets...');
    const processedFacets = new Map();
    
    this.facets.forEach(facet => {
      const constantName = this.generateConstantName(facet.name);
      processedFacets.set(constantName, {
        name: facet.name,
        description: facet.description,
        schemas: facet.schemas || [],
        perDocumentQuery: facet.perDocumentQuery || false
      });
    });

    this.processedFacets = processedFacets;
    this.log.info(`✅ Processed ${processedFacets.size} facets`);
  }

  generateConstantName(operationId) {
    // Use the operation ID directly as property name, making it JS-safe
    // Example: "Document.Create" -> "Document_Create"
    // Example: "BlobHolder.AttachOnCurrentDocument" -> "BlobHolder_AttachOnCurrentDocument"
    return operationId
      .replace(/\./g, '_')           // Replace dots with underscores
      .replace(/[^A-Za-z0-9_]/g, '_') // Replace non-alphanumeric with underscore
      .replace(/_+/g, '_')           // Replace multiple underscores with single
      .replace(/^_|_$/g, '');        // Remove leading/trailing underscores
  }

  async generateConstantsFile() {
    this.log.info('📝 Generating TypeScript constants file...');
    
    const outputPath = config.output.files.operations;
    const outputDir = path.dirname(outputPath);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate file content
    const content = this.generateFileContent();
    
    // Write file
    fs.writeFileSync(outputPath, content, 'utf8');
    
    this.log.success(`📁 Constants file generated: ${outputPath}`);
    this.log.info(`📊 Generated ${this.processedConstants.size} constants`);
  }

  generateFileContent() {
    const timestamp = new Date().toISOString();
    const totalOperations = this.operations.size;
    const totalConstants = this.processedConstants.size;
    const duplicateCount = this.duplicates.size;
    const aliasCount = this.aliases.size;
    
    // Calculate detailed statistics
    const stats = this.calculateDetailedStats();
    
    let content = `/**
 * Nuxeo Automation Operations Constants
 * 
 * Auto-generated from Nuxeo server API
 * Generated: ${timestamp}
 * Server: ${config.server.baseUrl}
 * 
 * 📊 GENERATION STATISTICS:
 * ========================
 * Total Operations Fetched: ${totalOperations}
 * Total Constants Generated: ${totalConstants}
 * Duplicates Resolved: ${duplicateCount}
 * Aliases Processed: ${aliasCount}
 * 
 * 📈 OPERATIONS BY CATEGORY:
 * =========================
${this.formatCategoryStats(stats.categories)}
 * 
 * 🔢 CONSTANT COUNTS:
 * ==================
 * NUXEO_OPERATIONS: ${stats.operationCount} properties
 * NUXEO_OPERATION_CATEGORIES: ${stats.categoryCount} categories
 * NUXEO_OPERATION_ALIASES: ${stats.aliasCount} aliases
 * 
 * 🏷️ PROCESSING DETAILS:
 * ======================
 * Successfully Processed: ${stats.successCount}
 * Duplicates Found: ${stats.duplicateDetails.length}
 * Aliases Created: ${stats.aliasDetails.length}
 * Categories Identified: ${stats.categoryCount}
 * 
 * DO NOT EDIT MANUALLY - This file is auto-generated
 * Use 'npm run constants:generate' to regenerate
 */

`;

    // Sort constants alphabetically
    const sortedConstants = Array.from(this.processedConstants.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    // Generate operations constants with individual header
    content += `/**\n * Nuxeo Automation Operations (${sortedConstants.length} operations)\n * \n * Auto-generated operation constants for Nuxeo automation calls.\n * Each constant represents a server-side automation operation.\n */\n`;
    content += 'export const NUXEO_OPERATIONS = {\n';
    
    sortedConstants.forEach(([constantName, data]) => {
      const { id, operation, isAlias, aliasFor } = data;
      
      // Add comment with operation info
      if (operation.label || operation.description) {
        content += `  /** ${operation.label || id}`;
        if (operation.description && operation.description !== operation.label) {
          content += ` - ${operation.description}`;
        }
        if (isAlias) {
          content += ` (Alias for ${aliasFor})`;
        }
        content += ' */\n';
      }
      
      content += `  ${constantName}: '${id}',\n`;
    });
    
    content += '} as const;\n\n';
    
    // Generate document types if available
    if (this.processedDocumentTypes && this.processedDocumentTypes.size > 0) {
      content += this.generateDocumentTypesSection();
    }
    
    // Generate schemas if available
    if (this.processedSchemas && this.processedSchemas.size > 0) {
      content += this.generateSchemasSection();
    }
    
    // Generate facets if available
    if (this.processedFacets && this.processedFacets.size > 0) {
      content += this.generateFacetsSection();
    }
    
    // Generate type definitions
    content += '// Type definitions\n';
    content += 'export type NuxeoOperation = typeof NUXEO_OPERATIONS[keyof typeof NUXEO_OPERATIONS];\n';
    if (this.processedDocumentTypes && this.processedDocumentTypes.size > 0) {
      content += 'export type NuxeoDocumentType = typeof NUXEO_DOCUMENT_TYPES[keyof typeof NUXEO_DOCUMENT_TYPES];\n';
    }
    if (this.processedSchemas && this.processedSchemas.size > 0) {
      content += 'export type NuxeoSchema = typeof NUXEO_SCHEMAS[keyof typeof NUXEO_SCHEMAS];\n';
    }
    if (this.processedFacets && this.processedFacets.size > 0) {
      content += 'export type NuxeoFacet = typeof NUXEO_FACETS[keyof typeof NUXEO_FACETS];\n';
    }
    content += '\n';
    
    // Generate operation categories if available
    const categories = this.generateCategoriesSection();
    if (categories) {
      content += categories;
    }
    
    // Generate aliases mapping
    if (this.aliases.size > 0) {
      content += this.generateAliasesSection();
    }
    
    // Generate duplicates info
    if (this.duplicates.size > 0) {
      content += this.generateDuplicatesSection();
    }
    
    return content;
  }

  generateDocumentTypesSection() {
    const sortedDocTypes = Array.from(this.processedDocumentTypes.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    let content = `/**\n * Nuxeo Document Types (${sortedDocTypes.length} types)\n * \n * Document type constants representing the various content types\n * available in the Nuxeo repository.\n */\n`;
    content += 'export const NUXEO_DOCUMENT_TYPES = {\n';
    
    sortedDocTypes.forEach(([constantName, data]) => {
      // Add comment with document type info
      if (data.label || data.description) {
        content += `  /** ${data.label || data.name}`;
        if (data.description && data.description !== data.label) {
          content += ` - ${data.description}`;
        }
        if (data.facets && data.facets.length > 0) {
          content += ` (Facets: ${data.facets.join(', ')})`;
        }
        content += ' */\n';
      }
      
      content += `  ${constantName}: '${data.name}',\n`;
    });
    
    content += '} as const;\n\n';
    return content;
  }

  generateSchemasSection() {
    const sortedSchemas = Array.from(this.processedSchemas.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    let content = `/**\n * Nuxeo Schemas (${sortedSchemas.length} schemas)\n * \n * Schema constants representing the metadata schemas\n * used by documents in the Nuxeo repository.\n */\n`;
    content += 'export const NUXEO_SCHEMAS = {\n';
    
    sortedSchemas.forEach(([constantName, data]) => {
      // Add comment with schema info
      if (data.description || data.prefix) {
        content += `  /** ${data.name}`;
        if (data.prefix) {
          content += ` (prefix: ${data.prefix})`;
        }
        if (data.description) {
          content += ` - ${data.description}`;
        }
        content += ' */\n';
      }
      
      content += `  ${constantName}: '${data.name}',\n`;
    });
    
    content += '} as const;\n\n';
    return content;
  }

  generateFacetsSection() {
    const sortedFacets = Array.from(this.processedFacets.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    let content = `/**\n * Nuxeo Facets (${sortedFacets.length} facets)\n * \n * Facet constants representing the behaviors and capabilities\n * that can be applied to documents in the Nuxeo repository.\n */\n`;
    content += 'export const NUXEO_FACETS = {\n';
    
    sortedFacets.forEach(([constantName, data]) => {
      // Add comment with facet info
      if (data.description || (data.schemas && data.schemas.length > 0)) {
        content += `  /** ${data.name}`;
        if (data.description) {
          content += ` - ${data.description}`;
        }
        if (data.schemas && data.schemas.length > 0) {
          content += ` (schemas: ${data.schemas.join(', ')})`;
        }
        content += ' */\n';
      }
      
      content += `  ${constantName}: '${data.name}',\n`;
    });
    
    content += '} as const;\n\n';
    return content;
  }

  generateCategoriesSection() {
    const categories = new Map();
    
    // Group operations by category
    for (const [constantName, data] of this.processedConstants) {
      const category = data.operation.category || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(constantName);
    }
    
    if (categories.size <= 1) return '';
    
    let content = `/**\n * Nuxeo Operation Categories (${categories.size} categories)\n * \n * Operations grouped by their functional categories.\n * Useful for organizing and filtering operations.\n */\n`;
    content += 'export const NUXEO_OPERATION_CATEGORIES = {\n';
    
    const sortedCategories = Array.from(categories.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    sortedCategories.forEach(([category, operations]) => {
      const categoryConstant = this.generateConstantName(category);
      content += `  ${categoryConstant}: [\n`;
      operations.sort().forEach(op => {
        content += `    NUXEO_OPERATIONS.${op},\n`;
      });
      content += `  ],\n`;
    });
    
    content += '} as const;\n\n';
    
    return content;
  }

  generateAliasesSection() {
    let content = `/**\n * Nuxeo Operation Aliases (${this.aliases.size} aliases)\n * \n * Alternative names for operations. These aliases can be used\n * interchangeably with the main operation names.\n */\n`;
    content += 'export const NUXEO_OPERATION_ALIASES = {\n';
    
    const sortedAliases = Array.from(this.aliases.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    sortedAliases.forEach(([constantName, originalId]) => {
      content += `  ${constantName}: '${originalId}', // Alias\n`;
    });
    
    content += '} as const;\n\n';
    
    return content;
  }

  generateDuplicatesSection() {
    let content = '/*\n';
    content += ` * Duplicate Operations Resolved (${this.duplicates.size} conflicts):\n`;
    content += ' * The following operations had naming conflicts and were resolved with suffixes:\n';
    content += ' *\n';
    
    const sortedDuplicates = Array.from(this.duplicates.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    sortedDuplicates.forEach(([originalId, resolvedName]) => {
      const originalConstant = this.generateConstantName(originalId);
      content += ` * - ${originalId} -> ${originalConstant} -> ${resolvedName}\n`;
    });
    
    content += ' */\n\n';
    
    return content;
  }

  calculateDetailedStats() {
    const categories = new Map();
    const duplicateDetails = [];
    const aliasDetails = [];
    let successCount = 0;

    // Analyze operations by category
    for (const [constantName, data] of this.processedConstants) {
      const category = data.operation.category || 'Other';
      if (!categories.has(category)) {
        categories.set(category, { count: 0, operations: [] });
      }
      categories.get(category).count++;
      categories.get(category).operations.push(constantName);
      successCount++;

      // Collect duplicate details
      if (this.duplicates.has(data.id)) {
        duplicateDetails.push({
          original: data.id,
          resolved: this.duplicates.get(data.id),
          constant: constantName
        });
      }

      // Collect alias details
      if (data.isAlias) {
        aliasDetails.push({
          alias: data.id,
          original: data.aliasFor,
          constant: constantName
        });
      }
    }

    return {
      categories,
      operationCount: this.processedConstants.size,
      categoryCount: categories.size,
      aliasCount: this.aliases.size,
      successCount,
      duplicateDetails,
      aliasDetails
    };
  }

  formatCategoryStats(categories) {
    const sortedCategories = Array.from(categories.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    
    return sortedCategories
      .map(([category, data]) => ` * ${category}: ${data.count} operations`)
      .join('\n');
  }
}

// Run the generator
if (require.main === module) {
  const generator = new ConstantsGenerator();
  generator.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = ConstantsGenerator;