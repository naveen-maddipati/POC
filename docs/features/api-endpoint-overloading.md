# Nuxeo API Endpoint Overloading System

## 🎯 Overview

This document describes the sophisticated API endpoint overloading and routing system used in the Nuxeo Angular integration. The system provides intelligent request routing, fallback mechanisms, and endpoint versioning.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Client        │    │  Overloading     │    │  Nuxeo Server       │
│   Request       │───▶│  Router          │───▶│  Endpoints          │
│                 │    │                  │    │                     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
        │                        │                        │
        │                        │                        │
   API Call                Intelligent              /nuxeo/api/v1/
   Parameters              Routing Logic            /nuxeo/site/automation
                           + Fallbacks              /nuxeo/api/v2/ (future)
```

## 🚀 Core Concepts

### Endpoint Overloading
Multiple endpoints can handle the same logical operation with different capabilities:

```typescript
// Document creation can use multiple endpoints
const documentCreationEndpoints = {
  primary: '/api/v1/automation/Document.Create',      // Standard creation
  batch: '/api/v1/automation/FileManager.Import',    // With file upload
  workflow: '/api/v1/automation/Document.CreateAndStartWorkflow', // With workflow
  bulk: '/api/v1/automation/Bulk.RunAction'          // Bulk operations
};
```

### Smart Routing Logic
The system automatically selects the best endpoint based on:

- **Request parameters** (file upload, workflow, bulk operation)
- **Server capabilities** (available operations, API versions)
- **Performance characteristics** (endpoint speed, reliability)
- **Fallback availability** (graceful degradation)

## 📋 Endpoint Categories

### 1. Document Operations
```typescript
export const DOCUMENT_ENDPOINTS = {
  CREATE: {
    primary: '/api/v1/automation/Document.Create',
    withFiles: '/api/v1/automation/FileManager.Import',
    withWorkflow: '/api/v1/automation/Document.CreateAndStartWorkflow',
    batch: '/api/v1/automation/Bulk.RunAction'
  },
  
  UPDATE: {
    primary: '/api/v1/automation/Document.Update',
    metadata: '/api/v1/automation/Document.SetProperty',
    bulk: '/api/v1/automation/Bulk.RunAction',
    atomic: '/api/v1/automation/Document.AtomicUpdate'
  },
  
  QUERY: {
    primary: '/api/v1/automation/Repository.Query',
    paginated: '/api/v1/automation/Repository.PageProvider',
    aggregated: '/api/v1/automation/Repository.ResultSetPageProvider',
    elastic: '/api/v1/automation/Elasticsearch.Query'
  }
} as const;
```

### 2. File Management
```typescript
export const FILE_ENDPOINTS = {
  UPLOAD: {
    single: '/api/v1/automation/FileManager.Import',
    batch: '/api/v1/automation/Batch.Create',
    chunked: '/api/v1/automation/Batch.Upload',
    s3Direct: '/api/v1/automation/S3.GetDirectUploadUrl'
  },
  
  DOWNLOAD: {
    direct: '/api/v1/automation/Blob.Get',
    signed: '/api/v1/automation/Blob.GetSignedUrl',
    streaming: '/api/v1/automation/Blob.Stream',
    thumbnail: '/api/v1/automation/Picture.GetThumbnail'
  }
} as const;
```

### 3. Authentication
```typescript
export const AUTH_ENDPOINTS = {
  LOGIN: {
    basic: '/api/v1/automation/login',
    token: '/api/v1/authentication/token',
    oauth: '/api/v1/oauth2/authorize',
    saml: '/api/v1/saml/login'
  },
  
  VALIDATION: {
    current: '/api/v1/automation/User.Get',
    permissions: '/api/v1/automation/Document.GetACL',
    capabilities: '/api/v1/automation/Repository.GetCapabilities'
  }
} as const;
```

## 🛠️ Implementation Details

### Endpoint Router Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class EndpointRouterService {
  
  constructor(
    private discovery: ApiDiscoveryService,
    private capabilities: ServerCapabilitiesService
  ) {}
  
  /**
   * Select best endpoint for operation based on context
   */
  async selectEndpoint(
    operation: string, 
    context: OperationContext
  ): Promise<EndpointInfo> {
    
    const availableEndpoints = this.getEndpointsForOperation(operation);
    
    // Apply selection strategy
    const strategy = this.getSelectionStrategy(context);
    const selectedEndpoint = strategy.select(availableEndpoints, context);
    
    // Validate endpoint availability
    await this.validateEndpoint(selectedEndpoint);
    
    return selectedEndpoint;
  }
  
  /**
   * Get all available endpoints for an operation
   */
  private getEndpointsForOperation(operation: string): EndpointInfo[] {
    const endpoints: EndpointInfo[] = [];
    
    // Primary endpoint
    const primary = this.discovery.getOperation(operation);
    if (primary) {
      endpoints.push({
        url: primary.url,
        type: 'primary',
        capabilities: primary.capabilities,
        priority: 100
      });
    }
    
    // Alternative endpoints
    const alternatives = this.discovery.getAlternatives(operation);
    alternatives.forEach(alt => {
      endpoints.push({
        url: alt.url,
        type: 'alternative',
        capabilities: alt.capabilities,
        priority: alt.priority
      });
    });
    
    // Fallback endpoints
    const fallbacks = this.discovery.getFallbacks(operation);
    fallbacks.forEach(fallback => {
      endpoints.push({
        url: fallback.url,
        type: 'fallback',
        capabilities: fallback.capabilities,
        priority: fallback.priority
      });
    });
    
    return endpoints.sort((a, b) => b.priority - a.priority);
  }
}
```

### Selection Strategies

#### 1. Performance-Based Selection
```typescript
export class PerformanceStrategy implements SelectionStrategy {
  
  select(endpoints: EndpointInfo[], context: OperationContext): EndpointInfo {
    // Consider historical performance data
    const performanceMetrics = this.metricsService.getMetrics(endpoints);
    
    // Weight by average response time and success rate
    const scored = endpoints.map(endpoint => ({
      endpoint,
      score: this.calculatePerformanceScore(endpoint, performanceMetrics)
    }));
    
    return scored.sort((a, b) => b.score - a.score)[0].endpoint;
  }
  
  private calculatePerformanceScore(
    endpoint: EndpointInfo, 
    metrics: PerformanceMetrics
  ): number {
    const metric = metrics[endpoint.url];
    if (!metric) return endpoint.priority;
    
    // Score based on success rate and response time
    const successRate = metric.successCount / metric.totalRequests;
    const responseTimeScore = 1000 / metric.averageResponseTime; // Faster = higher score
    
    return endpoint.priority * successRate * responseTimeScore;
  }
}
```

#### 2. Capability-Based Selection
```typescript
export class CapabilityStrategy implements SelectionStrategy {
  
  select(endpoints: EndpointInfo[], context: OperationContext): EndpointInfo {
    // Filter endpoints that support required capabilities
    const compatibleEndpoints = endpoints.filter(endpoint =>
      this.supportsRequiredCapabilities(endpoint, context.requirements)
    );
    
    if (compatibleEndpoints.length === 0) {
      throw new Error(`No endpoints support required capabilities: ${context.requirements}`);
    }
    
    // Select endpoint with best capability match
    return this.selectBestCapabilityMatch(compatibleEndpoints, context);
  }
  
  private supportsRequiredCapabilities(
    endpoint: EndpointInfo, 
    requirements: string[]
  ): boolean {
    return requirements.every(req => 
      endpoint.capabilities.includes(req)
    );
  }
}
```

#### 3. Fallback Strategy
```typescript
export class FallbackStrategy implements SelectionStrategy {
  
  select(endpoints: EndpointInfo[], context: OperationContext): EndpointInfo {
    // Try endpoints in priority order with fallback logic
    for (const endpoint of endpoints) {
      if (this.isEndpointHealthy(endpoint)) {
        return endpoint;
      }
    }
    
    // If all endpoints are unhealthy, return lowest priority (most basic)
    return endpoints[endpoints.length - 1];
  }
  
  private isEndpointHealthy(endpoint: EndpointInfo): boolean {
    const healthCheck = this.healthService.getStatus(endpoint.url);
    return healthCheck.status === 'healthy' && healthCheck.responseTime < 5000;
  }
}
```

## 🔧 Configuration

### Endpoint Configuration
```typescript
// endpoint-overloading.config.ts
export const ENDPOINT_CONFIG = {
  strategies: {
    default: 'performance',
    fallback: 'capability',
    emergency: 'fallback'
  },
  
  timeouts: {
    primary: 30000,      // 30 seconds
    alternative: 45000,  // 45 seconds  
    fallback: 60000      // 60 seconds
  },
  
  retries: {
    primary: 3,
    alternative: 2,
    fallback: 1
  },
  
  healthCheck: {
    interval: 60000,     // Check every minute
    timeout: 5000,       // 5 second timeout
    consecutiveFailures: 3 // Mark unhealthy after 3 failures
  },
  
  capabilities: {
    fileUpload: ['Document.Create', 'FileManager.Import'],
    bulkOperations: ['Bulk.RunAction', 'Repository.BulkUpdate'],
    workflow: ['Workflow.Start', 'Document.CreateAndStartWorkflow'],
    versioning: ['Document.CheckIn', 'Document.CheckOut']
  }
} as const;
```

### Operation Context
```typescript
export interface OperationContext {
  // Required capabilities
  requirements: string[];
  
  // Performance hints
  expectedDataSize: 'small' | 'medium' | 'large';
  priority: 'low' | 'normal' | 'high';
  timeout?: number;
  
  // Request characteristics  
  hasFiles: boolean;
  isBulkOperation: boolean;
  requiresTransaction: boolean;
  
  // User context
  userPermissions: string[];
  userGroups: string[];
}
```

## 📊 Monitoring & Analytics

### Endpoint Performance Tracking
```typescript
@Injectable({
  providedIn: 'root'
})
export class EndpointMetricsService {
  
  private metrics = new Map<string, EndpointMetrics>();
  
  recordRequest(endpoint: string, startTime: number, success: boolean): void {
    const duration = Date.now() - startTime;
    
    const metric = this.metrics.get(endpoint) || this.createEmptyMetrics();
    
    metric.totalRequests++;
    metric.totalResponseTime += duration;
    metric.averageResponseTime = metric.totalResponseTime / metric.totalRequests;
    
    if (success) {
      metric.successCount++;
    } else {
      metric.errorCount++;
    }
    
    metric.successRate = metric.successCount / metric.totalRequests;
    metric.lastUpdated = Date.now();
    
    this.metrics.set(endpoint, metric);
    
    // Log slow requests
    if (duration > 10000) {
      console.warn(`Slow endpoint response: ${endpoint} took ${duration}ms`);
    }
  }
  
  getMetrics(endpoint: string): EndpointMetrics | null {
    return this.metrics.get(endpoint) || null;
  }
  
  getAllMetrics(): Map<string, EndpointMetrics> {
    return new Map(this.metrics);
  }
}
```

### Health Check System
```typescript
@Injectable({
  providedIn: 'root'
})
export class EndpointHealthService {
  
  private healthStatus = new Map<string, HealthStatus>();
  
  async checkEndpointHealth(endpoint: string): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      const response = await this.http.get(`${endpoint}/health`, {
        timeout: ENDPOINT_CONFIG.healthCheck.timeout
      }).toPromise();
      
      const responseTime = Date.now() - startTime;
      const status: HealthStatus = {
        endpoint,
        status: 'healthy',
        responseTime,
        lastChecked: Date.now(),
        consecutiveFailures: 0
      };
      
      this.healthStatus.set(endpoint, status);
      return status;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const currentStatus = this.healthStatus.get(endpoint);
      const consecutiveFailures = (currentStatus?.consecutiveFailures || 0) + 1;
      
      const status: HealthStatus = {
        endpoint,
        status: consecutiveFailures >= ENDPOINT_CONFIG.healthCheck.consecutiveFailures 
          ? 'unhealthy' : 'degraded',
        responseTime,
        lastChecked: Date.now(),
        consecutiveFailures,
        error: error.message
      };
      
      this.healthStatus.set(endpoint, status);
      return status;
    }
  }
}
```

## 🎯 Usage Examples

### Document Creation with File Upload
```typescript
// Service automatically selects FileManager.Import for file uploads
const context: OperationContext = {
  requirements: ['fileUpload'],
  hasFiles: true,
  expectedDataSize: 'large',
  priority: 'normal'
};

const result = await this.documentService.createDocument({
  name: 'My Document',
  type: 'File',
  properties: { 'dc:title': 'Important Document' }
}, files, context);
```

### Bulk Document Updates
```typescript
// Service automatically selects Bulk.RunAction for bulk operations
const context: OperationContext = {
  requirements: ['bulkOperations'],
  isBulkOperation: true,
  expectedDataSize: 'large',
  priority: 'low'
};

const result = await this.documentService.updateDocuments(
  documentIds,
  updates,
  context
);
```

### High-Priority Document Query
```typescript
// Service selects fastest available query endpoint
const context: OperationContext = {
  requirements: ['fastQuery'],
  priority: 'high',
  expectedDataSize: 'medium',
  timeout: 5000
};

const results = await this.documentService.queryDocuments(
  'SELECT * FROM Document WHERE dc:title LIKE "%urgent%"',
  context
);
```

## 🚨 Troubleshooting

### Common Issues

#### Endpoint Selection Failure
```typescript
Error: No endpoints support required capabilities: ['fileUpload', 'bulkOperations']
```
**Solution**: Check if your Nuxeo server supports the required operations

#### Performance Degradation
```typescript
Warning: Slow endpoint response: /api/v1/automation/Document.Create took 15000ms
```
**Solution**: Review endpoint health and consider endpoint switching

#### Fallback Loop
```typescript
Error: All endpoints failed, falling back to basic endpoint repeatedly
```
**Solution**: Check server connectivity and endpoint health

### Debug Commands
```bash
# Check endpoint health status
npm run debug:endpoints:health

# View endpoint performance metrics  
npm run debug:endpoints:metrics

# Test endpoint selection for operation
npm run debug:endpoints:select -- --operation=Document.Create --context='{"hasFiles":true}'

# Reset endpoint metrics
npm run debug:endpoints:reset-metrics
```

## 🔗 Related Documentation

- [API Integration Guide](../guides/api-integration.md)
- [Constants Generation](./constants-generation.md)
- [Dynamic Discovery](./dynamic-discovery.md)
- [Enterprise Architecture](../guides/architecture.md)

## 📄 Implementation Files

```
src/core/services/
├── endpoint-router.service.ts        # Main routing logic
├── endpoint-metrics.service.ts       # Performance tracking
├── endpoint-health.service.ts        # Health monitoring
├── selection-strategies/
│   ├── performance.strategy.ts       # Performance-based selection
│   ├── capability.strategy.ts        # Capability-based selection
│   └── fallback.strategy.ts          # Fallback logic
└── config/
    ├── endpoint-overloading.config.ts # Configuration
    └── operation-mappings.config.ts   # Operation → Endpoint mappings
```

## 🎯 Advanced Features

### A/B Testing Endpoints
```typescript
// Test new endpoint versions with traffic splitting
const abTestConfig = {
  'Document.Create': {
    v1: { endpoint: '/api/v1/automation/Document.Create', traffic: 90 },
    v2: { endpoint: '/api/v2/automation/Document.Create', traffic: 10 }
  }
};
```

### Circuit Breaker Pattern
```typescript
// Automatically disable failing endpoints
const circuitBreakerConfig = {
  failureThreshold: 5,      // Failures before opening circuit
  recoveryTimeout: 30000,   // Wait time before retry
  halfOpenRequests: 1       // Test requests when half-open
};
```

### Load Balancing
```typescript
// Distribute load across multiple endpoints
const loadBalancingConfig = {
  strategy: 'round-robin', // 'round-robin' | 'least-connections' | 'weighted'
  healthCheckRequired: true,
  maxConcurrentRequests: 10
};
```

---

> **💡 Pro Tip**: Use the performance strategy for most operations, but switch to capability strategy when you need specific features like file upload or bulk operations.