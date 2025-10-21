/**
 * Nuxeo Client Library
 * 
 * Handles all communication with the Nuxeo server for constants generation.
 * Provides methods for authentication, API discovery, and data retrieval.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class NuxeoClient {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.server.baseUrl;
    this.auth = config.server.auth;
    this.timeout = config.server.timeout || 30000;
    this.retries = config.server.retries || 3;
    this.retryDelay = config.server.retryDelay || 1000;
    
    // Session management
    this.sessionId = null;
    this.cookies = [];
    
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
      magenta: '\x1b[35m',
      cyan: '\x1b[36m'
    };

    return {
      debug: (msg) => console.log(`${colors.cyan}[DEBUG]${colors.reset} ${msg}`),
      info: (msg) => console.log(`${colors.green}[INFO]${colors.reset} ${msg}`),
      warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
      error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`)
    };
  }

  /**
   * Authenticate with Nuxeo server
   */
  async authenticate() {
    this.log.info('Authenticating with Nuxeo server...');
    
    try {
      const loginData = {
        username: this.auth.username,
        password: this.auth.password
      };

      const response = await this.makeRequest('POST', '/site/automation/login', {
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.cookies) {
        this.cookies = response.cookies;
        this.log.info('Successfully authenticated with Nuxeo server');
        return true;
      }

      throw new Error('Authentication failed - no session cookies received');
    } catch (error) {
      this.log.error(`Authentication failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all available automation operations
   */
  async getAutomationOperations() {
    this.log.info('Fetching automation operations...');
    
    try {
      const response = await this.makeRequest('GET', this.config.server.endpoints.operations);
      
      if (!response.data || !response.data.operations) {
        throw new Error('Invalid response format for operations');
      }

      const operations = response.data.operations;
      this.log.info(`Retrieved ${operations.length} automation operations`);
      
      return operations.map(op => ({
        id: op.id,
        label: op.label,
        category: op.category,
        description: op.description,
        signature: op.signature,
        params: op.params || [],
        aliases: op.aliases || []
      }));
    } catch (error) {
      this.log.error(`Failed to fetch automation operations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all document types
   */
  async getDocumentTypes() {
    this.log.info('Fetching document types...');
    
    try {
      const response = await this.makeRequest('GET', this.config.server.endpoints.doctypes);
      
      if (!response.data || !response.data.doctypes) {
        throw new Error('Invalid response format for document types');
      }

      const docTypesObj = response.data.doctypes;
      // Convert object to array of document types
      const docTypes = Object.keys(docTypesObj).map(key => ({
        name: key,
        ...docTypesObj[key]
      }));
      
      this.log.info(`Retrieved ${docTypes.length} document types`);
      
      return docTypes.map(dt => ({
        name: dt.name,
        label: dt.label || dt.name,
        description: dt.description,
        facets: dt.facets || [],
        schemas: dt.schemas || [],
        parent: dt.parent,
        subtypes: dt.subtypes || []
      }));
    } catch (error) {
      this.log.error(`Failed to fetch document types: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all schemas
   */
  async getSchemas() {
    this.log.info('Fetching schemas...');
    
    try {
      const response = await this.makeRequest('GET', this.config.server.endpoints.schemas);
      
      // Response is a direct array, not wrapped in an object
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format for schemas');
      }

      const schemas = response.data;
      this.log.info(`Retrieved ${schemas.length} schemas`);
      
      return schemas.map(schema => ({
        name: schema.name,
        prefix: schema['@prefix'] || schema.prefix,
        fields: schema.fields || {},
        description: schema.description
      }));
    } catch (error) {
      this.log.error(`Failed to fetch schemas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all facets
   */
  async getFacets() {
    this.log.info('Fetching facets...');
    
    try {
      const response = await this.makeRequest('GET', this.config.server.endpoints.facets);
      
      // Response is a direct array, not wrapped in an object
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format for facets');
      }

      const facets = response.data;
      this.log.info(`Retrieved ${facets.length} facets`);
      
      return facets.map(facet => ({
        name: facet.name,
        description: facet.description,
        schemas: facet.schemas || [],
        perDocumentQuery: facet.perDocumentQuery || false
      }));
    } catch (error) {
      this.log.error(`Failed to fetch facets: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get workflow operations
   */
  async getWorkflowOperations() {
    this.log.info('Fetching workflow operations...');
    
    try {
      const allOperations = await this.getAutomationOperations();
      
      // Filter workflow-related operations
      const workflowOperations = allOperations.filter(op => 
        op.category === 'Workflow' || 
        op.id.includes('Workflow') ||
        op.id.includes('Task') ||
        op.category === 'Business Process'
      );

      this.log.info(`Found ${workflowOperations.length} workflow operations`);
      return workflowOperations;
    } catch (error) {
      this.log.error(`Failed to fetch workflow operations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test server connectivity
   */
  async testConnection() {
    this.log.info('Testing connection to Nuxeo server...');
    
    try {
      const response = await this.makeRequest('GET', '/');
      this.log.info('✅ Server connection successful');
      return true;
    } catch (error) {
      // Accept 302 redirects as successful connection (normal for Nuxeo root)
      if (error.message.includes('HTTP 302')) {
        this.log.info('✅ Server connection successful (redirected)');
        return true;
      }
      this.log.error(`❌ Server connection failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(method, path, options = {}) {
    // Properly construct URL by ensuring path doesn't start with / if baseUrl has a path
    const baseUrl = new URL(this.baseUrl);
    let fullPath = path;
    
    // If baseUrl has a pathname and our path starts with /, combine them properly
    if (baseUrl.pathname !== '/' && path.startsWith('/')) {
      fullPath = baseUrl.pathname + path;
    } else if (baseUrl.pathname !== '/' && !path.startsWith('/')) {
      fullPath = baseUrl.pathname + '/' + path;
    }
    
    const url = new URL(fullPath, `${baseUrl.protocol}//${baseUrl.host}`);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers: {
        'User-Agent': 'Nuxeo-Constants-Generator/1.0',
        'Accept': 'application/json',
        ...options.headers
      },
      timeout: this.timeout
    };

    // Add authentication cookies if available
    if (this.cookies.length > 0) {
      requestOptions.headers['Cookie'] = this.cookies.join('; ');
    }

    // Always add basic auth for Nuxeo automation endpoints
    if (this.auth.username) {
      const auth = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString('base64');
      requestOptions.headers['Authorization'] = `Basic ${auth}`;
    }

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        this.log.debug(`${method} ${url.pathname} (attempt ${attempt}/${this.retries})`);
        
        const result = await this.executeRequest(client, requestOptions, options.body);
        return result;
      } catch (error) {
        if (attempt === this.retries) {
          throw error;
        }
        
        this.log.warn(`Request failed (attempt ${attempt}/${this.retries}): ${error.message}`);
        await this.sleep(this.retryDelay * attempt);
      }
    }
  }

  /**
   * Execute HTTP request
   */
  executeRequest(client, options, body) {
    return new Promise((resolve, reject) => {
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            // Extract cookies from response
            const cookies = this.extractCookies(res.headers['set-cookie']);
            
            // Parse JSON response
            let parsedData = null;
            if (data.trim()) {
              try {
                parsedData = JSON.parse(data);
              } catch (parseError) {
                // If not JSON, return as text
                parsedData = data;
              }
            }

            const response = {
              statusCode: res.statusCode,
              headers: res.headers,
              data: parsedData,
              cookies: cookies
            };

            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${this.timeout}ms`));
      });

      if (body) {
        req.write(body);
      }
      
      req.end();
    });
  }

  /**
   * Extract cookies from response headers
   */
  extractCookies(setCookieHeaders) {
    if (!setCookieHeaders) return [];
    
    return setCookieHeaders.map(cookie => {
      // Extract cookie name=value, ignore attributes
      return cookie.split(';')[0];
    });
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Close connection and cleanup
   */
  async disconnect() {
    if (this.sessionId) {
      try {
        await this.makeRequest('POST', '/site/automation/logout');
        this.log.info('Successfully logged out from Nuxeo server');
      } catch (error) {
        this.log.warn(`Logout failed: ${error.message}`);
      }
    }
    
    this.sessionId = null;
    this.cookies = [];
  }
}

module.exports = NuxeoClient;