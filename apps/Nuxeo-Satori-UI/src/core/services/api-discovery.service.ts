import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { LoggingService } from './logging.service';

export interface IApiEndpoint {
  readonly name: string;
  readonly url: string;
  readonly method: 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE';
  readonly description: string;
  readonly requiresAuth: boolean;
  readonly category: string;
  readonly testPayload?: any;
}

export interface IApiTestResult {
  readonly endpoint: IApiEndpoint;
  readonly available: boolean;
  readonly status: number;
  readonly responseTime: number;
  readonly authMethod?: string;
  readonly error?: string;
  readonly response?: any;
  readonly testedAt: Date;
}

export interface IApiCategory {
  readonly name: string;
  readonly description: string;
  readonly endpoints: IApiEndpoint[];
  readonly color: string;
  readonly icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiDiscoveryService {
  private readonly httpClient = inject(HttpClient);
  private readonly logger = inject(LoggingService);

  // Signals for reactive state
  public readonly testResults = signal<IApiTestResult[]>([]);
  public readonly isTestingInProgress = signal<boolean>(false);
  public readonly lastTestTime = signal<Date | null>(null);

  private readonly API_CATEGORIES: IApiCategory[] = [
    {
      name: 'Authentication',
      description: 'User authentication and session management',
      color: 'primary',
      icon: 'lock',
      endpoints: [
        {
          name: 'Basic Auth Test',
          url: '/nuxeo/api/v1/repo/default',
          method: 'GET',
          description: 'Test Basic Authentication with repository access',
          requiresAuth: true,
          category: 'Authentication'
        },
        {
          name: 'Automation Login',
          url: '/nuxeo/api/v1/automation/login',
          method: 'POST',
          description: 'Login using Automation API (creates session)',
          requiresAuth: false,
          category: 'Authentication',
          testPayload: {
            username: 'Administrator',
            password: 'Administrator'
          }
        },
        {
          name: 'Current User Info',
          url: '/nuxeo/api/v1/me',
          method: 'GET',
          description: 'Get current authenticated user information',
          requiresAuth: true,
          category: 'Authentication'
        },
        {
          name: 'OAuth2 Discovery',
          url: '/nuxeo/oauth2/.well-known/openid_configuration',
          method: 'GET',
          description: 'OAuth2 OpenID Connect discovery endpoint',
          requiresAuth: false,
          category: 'Authentication'
        },
        {
          name: 'JWT Token Info',
          url: '/nuxeo/api/v1/authentication/token',
          method: 'GET',
          description: 'JWT token information endpoint',
          requiresAuth: true,
          category: 'Authentication'
        }
      ]
    },
    {
      name: 'Automation API',
      description: 'Nuxeo operation-based API (matches Welcome component operations)',
      color: 'accent',
      icon: 'settings',
      endpoints: [
        {
          name: 'List Available Operations',
          url: 'http://localhost:8080/nuxeo/site/automation',
          method: 'GET',
          description: 'Get service description and all available automation operations (official endpoint)',
          requiresAuth: true,
          category: 'Automation API'
        },
        {
          name: 'Document Fetch',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Document.Fetch',
          method: 'POST',
          description: 'Fetch document by path or ID (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              value: '/'
            },
            context: {},
            input: 'void'
          }
        },
        {
          name: 'Document Get Children',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Document.GetChildren',
          method: 'POST',
          description: 'Get document children (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              pageSize: 20,
              currentPage: 0
            },
            context: {},
            input: '/'
          }
        },
        {
          name: 'Document Create',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Document.Create',
          method: 'POST',
          description: 'Create new document (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              type: 'Folder',
              name: 'api-discovery-test',
              properties: {
                'dc:title': 'API Discovery Test Folder'
              }
            },
            context: {},
            input: '/'
          }
        },
        {
          name: 'Document Update',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Document.Update',
          method: 'POST',
          description: 'Update document properties (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              properties: {
                'dc:description': 'Updated via API Discovery'
              }
            },
            context: {},
            input: '/'
          }
        },
        {
          name: 'Document Delete',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Document.Delete',
          method: 'POST',
          description: 'Delete document (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {},
            context: {},
            input: '/api-discovery-test'
          }
        },
        {
          name: 'Repository Query',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Repository.Query',
          method: 'POST',
          description: 'Execute NXQL queries (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              query: "SELECT * FROM Document WHERE ecm:primaryType = 'Domain'",
              pageSize: 5,
              currentPage: 0
            },
            context: {},
            input: 'void'
          }
        },
        {
          name: 'Document Copy',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Document.Copy',
          method: 'POST',
          description: 'Copy document to target location (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              target: '/',
              name: 'copied-document'
            },
            context: {},
            input: '/'
          }
        },
        {
          name: 'Document Move',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Document.Move',
          method: 'POST',
          description: 'Move document to target location (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              target: '/'
            },
            context: {},
            input: '/api-discovery-test'
          }
        },
        {
          name: 'Directory Read Entries',
          url: 'http://localhost:8080/nuxeo/api/v1/automation/Directory.ReadEntries',
          method: 'POST',
          description: 'Read directory entries/vocabularies (confirmed available)',
          requiresAuth: true,
          category: 'Automation API',
          testPayload: {
            params: {
              directoryName: 'continent',
              entries: '["europe","asia","africa"]'
            },
            context: {},
            input: 'void'
          }
        }
      ]
    },
    {
      name: 'REST API',
      description: 'Resource-based REST operations',
      color: 'warn',
      icon: 'api',
      endpoints: [
        {
          name: 'Repository Root',
          url: '/nuxeo/api/v1/repo/default',
          method: 'GET',
          description: 'Get repository root information',
          requiresAuth: true,
          category: 'REST API'
        },
        {
          name: 'Repository Path Root',
          url: '/nuxeo/api/v1/repo/default/path/',
          method: 'GET',
          description: 'Get root document via path',
          requiresAuth: true,
          category: 'REST API'
        },
        {
          name: 'Repository Management',
          url: '/nuxeo/api/v1/repo',
          method: 'GET',
          description: 'List available repositories',
          requiresAuth: true,
          category: 'REST API'
        }
      ]
    },
    {
      name: 'CMIS API',
      description: 'OASIS CMIS standard compliance',
      color: 'primary',
      icon: 'schema',
      endpoints: [
        {
          name: 'CMIS Repositories',
          url: '/nuxeo/json/cmis',
          method: 'GET',
          description: 'Get CMIS repository information',
          requiresAuth: false,
          category: 'CMIS API'
        },
        {
          name: 'CMIS Repository Info',
          url: '/nuxeo/json/cmis/default',
          method: 'GET',
          description: 'Get default repository details and capabilities',
          requiresAuth: true,
          category: 'CMIS API'
        },
        {
          name: 'CMIS Root Folder',
          url: '/nuxeo/json/cmis/default/root',
          method: 'GET',
          description: 'Get CMIS root folder information',
          requiresAuth: true,
          category: 'CMIS API'
        },
        {
          name: 'CMIS Type Definitions',
          url: '/nuxeo/json/cmis/default/types',
          method: 'GET',
          description: 'Get CMIS type definitions',
          requiresAuth: true,
          category: 'CMIS API'
        }
      ]
    },
    {
      name: 'Advanced APIs',
      description: 'GraphQL, Search, and specialized endpoints',
      color: 'accent',
      icon: 'explore',
      endpoints: [
        {
          name: 'GraphQL Endpoint',
          url: '/nuxeo/api/v1/graphql',
          method: 'POST',
          description: 'GraphQL query endpoint',
          requiresAuth: true,
          category: 'Advanced APIs',
          testPayload: {
            query: '{ repository { name } }'
          }
        },
        {
          name: 'Search API',
          url: '/nuxeo/api/v1/search/lang/NXQL/execute',
          method: 'GET',
          description: 'Search API with NXQL',
          requiresAuth: true,
          category: 'Advanced APIs'
        },
        {
          name: 'Upload Batch',
          url: '/nuxeo/api/v1/upload',
          method: 'POST',
          description: 'Initialize file upload batch',
          requiresAuth: true,
          category: 'Advanced APIs'
        }
      ]
    },
    {
      name: 'Management APIs',
      description: 'User, group, and system management',
      color: 'warn',
      icon: 'admin_panel_settings',
      endpoints: [
        {
          name: 'User Management',
          url: '/nuxeo/api/v1/user',
          method: 'GET',
          description: 'List users (requires admin)',
          requiresAuth: true,
          category: 'Management APIs'
        },
        {
          name: 'Group Management',
          url: '/nuxeo/api/v1/group',
          method: 'GET',
          description: 'List groups (requires admin)',
          requiresAuth: true,
          category: 'Management APIs'
        },
        {
          name: 'Directory Management',
          url: '/nuxeo/api/v1/directory',
          method: 'GET',
          description: 'List directories/vocabularies',
          requiresAuth: true,
          category: 'Management APIs'
        },
        {
          name: 'Workflow Management',
          url: '/nuxeo/api/v1/workflow',
          method: 'GET',
          description: 'List workflow instances',
          requiresAuth: true,
          category: 'Management APIs'
        }
      ]
    }
  ];

  constructor() {
    this.logger.info('ApiDiscoveryService initialized');
  }

  /**
   * Get all API categories
   */
  public getApiCategories(): IApiCategory[] {
    return this.API_CATEGORIES;
  }

  /**
   * Get all endpoints flattened
   */
  public getAllEndpoints(): IApiEndpoint[] {
    return this.API_CATEGORIES.flatMap(category => category.endpoints);
  }

  /**
   * Test all endpoints
   */
  public async testAllEndpoints(): Promise<void> {
    this.isTestingInProgress.set(true);
    this.logger.info('Starting comprehensive API discovery test');

    try {
      const allEndpoints = this.getAllEndpoints();
      const results: IApiTestResult[] = [];

      for (const endpoint of allEndpoints) {
        try {
          const result = await this.testSingleEndpoint(endpoint);
          results.push(result);
          
          // Update results incrementally for real-time feedback
          this.testResults.set([...results]);
          
          this.logger.info(`Tested ${endpoint.name}`, {
            available: result.available,
            status: result.status,
            responseTime: result.responseTime
          });
          
          // Add small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          this.logger.error(`Failed to test ${endpoint.name}`, error);
        }
      }

      this.lastTestTime.set(new Date());
      this.logger.info('API discovery test completed', { 
        totalEndpoints: allEndpoints.length,
        availableEndpoints: results.filter(r => r.available).length
      });

    } catch (error) {
      this.logger.error('API discovery test failed', error);
    } finally {
      this.isTestingInProgress.set(false);
    }
  }

  /**
   * Test endpoints by category
   */
  public async testCategory(categoryName: string): Promise<void> {
    this.isTestingInProgress.set(true);
    
    try {
      const category = this.API_CATEGORIES.find(c => c.name === categoryName);
      if (!category) {
        throw new Error(`Category ${categoryName} not found`);
      }

      this.logger.info(`Testing category: ${categoryName}`);
      const results: IApiTestResult[] = [...this.testResults()];

      for (const endpoint of category.endpoints) {
        const result = await this.testSingleEndpoint(endpoint);
        
        // Replace existing result or add new one
        const existingIndex = results.findIndex(r => r.endpoint.url === endpoint.url);
        if (existingIndex >= 0) {
          results[existingIndex] = result;
        } else {
          results.push(result);
        }
        
        this.testResults.set([...results]);
      }

    } catch (error) {
      this.logger.error(`Failed to test category ${categoryName}`, error);
    } finally {
      this.isTestingInProgress.set(false);
    }
  }

  /**
   * Test a single endpoint
   */
  private async testSingleEndpoint(endpoint: IApiEndpoint): Promise<IApiTestResult> {
    const startTime = Date.now();
    
    try {
      let headers = new HttpHeaders();

      // Special handling for automation service discovery
      if (endpoint.url === '/nuxeo/site/automation') {
        headers = headers.set('Accept', 'application/json+nxautomation');
        // Add Basic Auth as it's required by the server
        if (endpoint.requiresAuth) {
          headers = headers.set('Authorization', 'Basic ' + btoa('Administrator:Administrator'));
        }
        // Don't set Content-Type for GET requests to automation service discovery
        this.logger.info(`Testing automation service discovery: ${endpoint.url}`, {
          headers: 'Accept: application/json+nxautomation, Authorization: Basic auth'
        });
      }
      // Special handling for other Automation API endpoints
      else if (endpoint.category === 'Automation API') {
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Accept', 'application/json');
        
        // For automation login, don't use Basic Auth
        if (endpoint.name !== 'Automation Login Test' && endpoint.requiresAuth) {
          headers = headers.set('Authorization', 'Basic ' + btoa('Administrator:Administrator'));
        }
      } else {
        headers = headers.set('Content-Type', 'application/json');
        // Add basic auth for non-automation endpoints that require authentication
        if (endpoint.requiresAuth) {
          headers = headers.set('Authorization', 'Basic ' + btoa('Administrator:Administrator'));
        }
      }

      const requestOptions = {
        headers,
        observe: 'response' as const,
        timeout: 15000 // Longer timeout for automation API
      };

      // Log the full request details for all automation API endpoints
      if (endpoint.category === 'Automation API') {
        this.logger.info('Making automation API request', {
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          payload: endpoint.testPayload,
          headers: Object.fromEntries(headers.keys().map(key => [key, headers.get(key)]))
        });
      }

      let response: any;
      
      switch (endpoint.method) {
        case 'GET':
        case 'HEAD':
          response = await this.httpClient.request(endpoint.method, endpoint.url, requestOptions)
            .pipe(
              timeout(15000),
              catchError(error => of({ 
                status: error.status || 0, 
                error: this.getErrorMessage(error, endpoint)
              }))
            )
            .toPromise();
          break;
          
        case 'POST':
        case 'PUT':
          response = await this.httpClient.request(endpoint.method, endpoint.url, {
            ...requestOptions,
            body: endpoint.testPayload || {}
          })
            .pipe(
              timeout(15000),
              catchError(error => of({ 
                status: error.status || 0, 
                error: this.getErrorMessage(error, endpoint)
              }))
            )
            .toPromise();
          break;
      }

      const responseTime = Date.now() - startTime;
      const status = response?.status || 0;
      const available = status >= 200 && status < 400;

      // Log failed automation API requests for debugging
      if (endpoint.category === 'Automation API' && !available) {
        this.logger.error('Automation API request failed', {
          name: endpoint.name,
          url: endpoint.url,
          status: status,
          error: response?.error,
          fullResponse: response
        });
      }

      return {
        endpoint,
        available,
        status,
        responseTime,
        authMethod: endpoint.requiresAuth ? 'Basic Auth' : 'None',
        response: available ? response?.body : undefined,
        error: !available ? response?.error || `HTTP ${status}` : undefined,
        testedAt: new Date()
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint,
        available: false,
        status: 0,
        responseTime,
        authMethod: endpoint.requiresAuth ? 'Basic Auth' : 'None',
        error: (error as any)?.message || 'Unknown error',
        testedAt: new Date()
      };
    }
  }

  /**
   * Get test results summary
   */
  public getTestSummary() {
    const results = this.testResults();
    const total = results.length;
    const available = results.filter(r => r.available).length;
    const unavailable = total - available;
    
    const byCategory = this.API_CATEGORIES.map(category => {
      const categoryResults = results.filter(r => r.endpoint.category === category.name);
      const categoryAvailable = categoryResults.filter(r => r.available).length;
      
      return {
        name: category.name,
        total: category.endpoints.length,
        available: categoryAvailable,
        unavailable: category.endpoints.length - categoryAvailable,
        color: category.color,
        icon: category.icon
      };
    });

    return {
      total,
      available,
      unavailable,
      successRate: total > 0 ? Math.round((available / total) * 100) : 0,
      byCategory,
      lastTestTime: this.lastTestTime()
    };
  }

  /**
   * Clear test results
   */
  public clearResults(): void {
    this.testResults.set([]);
    this.lastTestTime.set(null);
    this.logger.info('API discovery results cleared');
  }

  /**
   * Export test results
   */
  public exportResults(): string {
    const summary = this.getTestSummary();
    const results = this.testResults();
    
    const exportData = {
      summary,
      results: results.map(r => ({
        endpoint: r.endpoint.name,
        url: r.endpoint.url,
        method: r.endpoint.method,
        category: r.endpoint.category,
        available: r.available,
        status: r.status,
        responseTime: r.responseTime,
        error: r.error,
        testedAt: r.testedAt
      })),
      exportedAt: new Date().toISOString(),
      nuxeoServer: 'http://localhost:8080'
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get detailed error message for better troubleshooting
   */
  private getErrorMessage(error: any, endpoint: IApiEndpoint): string {
    if (!error) return 'Unknown error';

    // Handle CORS errors specifically for Automation API
    if (endpoint.category === 'Automation API') {
      if (error.status === 0) {
        return 'CORS Error: Direct browser requests to Automation API may be blocked. Use NuxeoService.connect() instead.';
      }
      if (error.status === 401) {
        return 'Authentication failed: Check credentials or use proper Nuxeo client authentication.';
      }
      if (error.status === 403) {
        return 'Access forbidden: User may not have required permissions for automation operations.';
      }
    }

    // Handle common HTTP errors
    switch (error.status) {
      case 0:
        return 'Network error: Unable to connect to server (check CORS, network, or server status)';
      case 401:
        return 'Authentication required: Invalid or missing credentials';
      case 403:
        return 'Access forbidden: Insufficient permissions';
      case 404:
        return 'Endpoint not found: URL may be incorrect or feature not available';
      case 405:
        return 'Method not allowed: HTTP method not supported for this endpoint';
      case 500:
        return 'Internal server error: Check server logs for details';
      case 503:
        return 'Service unavailable: Server may be starting up or under maintenance';
      default:
        return error.message || error.error || `HTTP ${error.status}`;
    }
  }
}