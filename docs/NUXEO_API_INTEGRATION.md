# Nuxeo API Integration - Enterprise Architecture Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Creating New Services](#creating-new-services)
6. [Creating New Components](#creating-new-components)
7. [Best Practices](#best-practices)
8. [Code Examples](#code-examples)
9. [Testing Guidelines](#testing-guidelines)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project implements an enterprise-grade Nuxeo JavaScript client integration with Angular 19, following strict architectural patterns for maintainability, scalability, and team collaboration.

### Key Technologies
- **Angular 19** with standalone components
- **Nx Workspace** for monorepo management
- **Satori Design System** for UI components
- **Nuxeo JavaScript Client** for API integration
- **TypeScript** with strict configuration
- **RxJS** for reactive programming
- **Material Design** for additional UI components

---

## 🏗️ Architecture Principles

### 1. Separation of Concerns
- **Core Layer**: Interfaces, constants, and base services
- **Shared Layer**: Reusable utilities and components
- **Feature Layer**: Business logic and feature-specific components

### 2. Type Safety
- All interfaces must be defined in `src/core/interfaces/`
- Use strict TypeScript configuration
- No `any` types allowed in production code

### 3. Reactive Programming
- Use RxJS Observables for all async operations
- Implement proper error handling with try-catch blocks
- Use Angular signals for state management where appropriate

### 4. Enterprise Patterns
- Dependency injection for all services
- Environment-based configuration
- Comprehensive logging and monitoring
- Proper error boundaries and fallbacks

---

## 📁 Project Structure

```
src/
├── core/
│   ├── interfaces/          # TypeScript interfaces
│   │   ├── nuxeo.interface.ts
│   │   └── common.interface.ts
│   ├── constants/           # Application constants
│   │   ├── app.constants.ts
│   │   └── nuxeo.constants.ts
│   └── services/           # Core business services
│       ├── logging.service.ts
│       └── nuxeo.service.ts
├── shared/
│   ├── components/         # Reusable components
│   ├── utilities/          # Helper functions
│   └── guards/            # Route guards
├── features/
│   └── welcome/           # Feature-specific components
└── environments/          # Environment configurations
```

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
Angular CLI >= 19.x
Nx CLI >= 19.x
```

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd POC-WS

# Install dependencies
npm install

# Start development server
nx serve POC-WS

# Run tests
nx test POC-WS

# Build for production
nx build POC-WS
```

### Environment Setup
1. Configure your Nuxeo server details in `src/environments/environment.ts`
2. Update proxy configuration in `proxy.conf.json` if needed
3. Ensure Material Icons font is loaded (already configured)

---

## 🔧 Creating New Services

### Step 1: Define Interfaces First

**Location**: `src/core/interfaces/your-service.interface.ts`

```typescript
export interface IYourServiceConfig {
  readonly baseUrl: string;
  readonly apiKey?: string;
  readonly timeout: number;
}

export interface IYourServiceResponse<T = any> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly timestamp: Date;
}

export interface IYourServiceMethods {
  initialize(config: IYourServiceConfig): Promise<boolean>;
  performOperation<T>(params: any): Promise<IYourServiceResponse<T>>;
  cleanup(): void;
}
```

### Step 2: Create Constants

**Location**: `src/core/constants/your-service.constants.ts`

```typescript
export const YOUR_SERVICE_CONSTANTS = {
  API: {
    ENDPOINTS: {
      BASE: '/api/your-service',
      OPERATIONS: '/operations',
      STATUS: '/status'
    } as const,
    HEADERS: {
      CONTENT_TYPE: 'application/json',
      ACCEPT: 'application/json'
    } as const,
    TIMEOUT: 30000
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  CACHE: {
    TTL: 300000, // 5 minutes
    MAX_SIZE: 100
  }
} as const;

export type YourServiceEndpoints = typeof YOUR_SERVICE_CONSTANTS.API.ENDPOINTS;
```

### Step 3: Implement the Service

**Location**: `src/core/services/your-service.service.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, map, tap, retry, timeout } from 'rxjs/operators';

import { LoggingService } from './logging.service';
import { 
  IYourServiceConfig, 
  IYourServiceResponse, 
  IYourServiceMethods 
} from '../interfaces/your-service.interface';
import { YOUR_SERVICE_CONSTANTS } from '../constants/your-service.constants';

@Injectable({
  providedIn: 'root'
})
export class YourService implements IYourServiceMethods {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggingService);

  // State management with signals
  private readonly _isInitialized = signal<boolean>(false);
  private readonly _config = signal<IYourServiceConfig | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  // Public readonly signals
  public readonly isInitialized = this._isInitialized.asReadonly();
  public readonly config = this._config.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.logger.info('YourService', 'Service instantiated');
  }

  /**
   * Initialize the service with configuration
   */
  public async initialize(config: IYourServiceConfig): Promise<boolean> {
    try {
      this._isLoading.set(true);
      this.logger.info('YourService', 'Initializing service', { config });

      // Validate configuration
      if (!this.validateConfig(config)) {
        throw new Error('Invalid configuration provided');
      }

      // Perform initialization logic
      const testResult = await this.testConnection(config);
      if (!testResult) {
        throw new Error('Connection test failed');
      }

      this._config.set(config);
      this._isInitialized.set(true);
      
      this.logger.info('YourService', 'Service initialized successfully');
      return true;

    } catch (error) {
      this.logger.error('YourService', 'Failed to initialize service', error);
      this._isInitialized.set(false);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Perform a service operation
   */
  public performOperation<T>(params: any): Promise<IYourServiceResponse<T>> {
    return new Promise((resolve, reject) => {
      if (!this._isInitialized()) {
        reject(new Error('Service not initialized'));
        return;
      }

      const config = this._config();
      if (!config) {
        reject(new Error('No configuration available'));
        return;
      }

      this.executeOperation<T>(params, config)
        .pipe(
          timeout(YOUR_SERVICE_CONSTANTS.API.TIMEOUT),
          retry(YOUR_SERVICE_CONSTANTS.RETRY.MAX_ATTEMPTS),
          catchError(error => {
            this.logger.error('YourService', 'Operation failed', error);
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (response) => {
            this.logger.info('YourService', 'Operation completed successfully');
            resolve({
              success: true,
              data: response,
              timestamp: new Date()
            });
          },
          error: (error) => {
            reject({
              success: false,
              error: error.message || 'Unknown error',
              timestamp: new Date()
            });
          }
        });
    });
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this._isInitialized.set(false);
    this._config.set(null);
    this._isLoading.set(false);
    this.logger.info('YourService', 'Service cleaned up');
  }

  // Private helper methods
  private validateConfig(config: IYourServiceConfig): boolean {
    return !!(config?.baseUrl && config?.timeout > 0);
  }

  private async testConnection(config: IYourServiceConfig): Promise<boolean> {
    try {
      const response = await this.http.get(`${config.baseUrl}/health`).toPromise();
      return !!response;
    } catch {
      return false;
    }
  }

  private executeOperation<T>(params: any, config: IYourServiceConfig): Observable<T> {
    const url = `${config.baseUrl}${YOUR_SERVICE_CONSTANTS.API.ENDPOINTS.OPERATIONS}`;
    
    return this.http.post<T>(url, params, {
      headers: YOUR_SERVICE_CONSTANTS.API.HEADERS,
      timeout: config.timeout
    });
  }
}
```

### Step 4: Add Environment Configuration

**Location**: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  // ... existing config
  yourService: {
    baseUrl: 'http://localhost:8080/your-service',
    apiKey: 'your-dev-api-key',
    timeout: 30000,
    features: {
      enableCaching: true,
      enableRetry: true,
      enableLogging: true
    }
  }
};
```

---

## 🎨 Creating New Components

### Step 1: Generate Component Structure

```bash
# Using Nx generator (recommended)
nx generate @nx/angular:component your-feature/your-component --standalone=true --style=scss --changeDetection=OnPush

# Or manually create in appropriate feature folder
# src/features/your-feature/your-component/
```

### Step 2: Component Template

**Location**: `src/features/your-feature/your-component/your-component.component.ts`

```typescript
import { 
  Component, 
  OnInit, 
  OnDestroy, 
  inject, 
  signal,
  computed,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { YourService } from '../../../core/services/your-service.service';
import { LoggingService } from '../../../core/services/logging.service';
import { IYourServiceResponse } from '../../../core/interfaces/your-service.interface';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="component-container">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>{{ componentIcon() }}</mat-icon>
          {{ componentTitle() }}
        </mat-card-title>
        <mat-card-subtitle>{{ componentSubtitle() }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        @if (isLoading()) {
          <div class="loading-state">
            <mat-icon class="spin">refresh</mat-icon>
            Loading...
          </div>
        } @else if (error()) {
          <div class="error-state">
            <mat-icon>error</mat-icon>
            {{ error() }}
          </div>
        } @else {
          <div class="content">
            <!-- Your component content here -->
            {{ data() | json }}
          </div>
        }
      </mat-card-content>

      <mat-card-actions>
        <button mat-raised-button 
                color="primary"
                [disabled]="isLoading()"
                (click)="executeAction()">
          <mat-icon>play_arrow</mat-icon>
          Execute Action
        </button>
        
        <button mat-button 
                [disabled]="isLoading()"
                (click)="resetComponent()">
          <mat-icon>refresh</mat-icon>
          Reset
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .component-container {
      margin: 16px;
      max-width: 600px;
    }

    .loading-state, .error-state {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .error-state {
      color: #f44336;
    }

    .content {
      min-height: 200px;
      padding: 16px;
    }

    mat-card-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class YourComponentComponent implements OnInit, OnDestroy {
  // Service injection
  private readonly yourService = inject(YourService);
  private readonly logger = inject(LoggingService);

  // Component state with signals
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _data = signal<any>(null);

  // Public computed signals
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly data = this._data.asReadonly();

  // Component metadata
  public readonly componentIcon = signal<string>('dashboard');
  public readonly componentTitle = signal<string>('Your Component');
  public readonly componentSubtitle = computed(() => 
    this.isLoading() ? 'Processing...' : 'Ready for action'
  );

  ngOnInit(): void {
    this.logger.info('YourComponent', 'Component initialized');
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.logger.info('YourComponent', 'Component destroyed');
    this.cleanup();
  }

  /**
   * Execute the main component action
   */
  public async executeAction(): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const result = await this.yourService.performOperation({
        // Your operation parameters
      });

      if (result.success) {
        this._data.set(result.data);
        this.logger.info('YourComponent', 'Action executed successfully');
      } else {
        throw new Error(result.error || 'Operation failed');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this._error.set(errorMessage);
      this.logger.error('YourComponent', 'Action execution failed', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Reset component state
   */
  public resetComponent(): void {
    this._isLoading.set(false);
    this._error.set(null);
    this._data.set(null);
    this.logger.info('YourComponent', 'Component reset');
  }

  // Private methods
  private async initializeComponent(): Promise<void> {
    // Component-specific initialization logic
    if (!this.yourService.isInitialized()) {
      this.logger.warn('YourComponent', 'Service not initialized');
    }
  }

  private cleanup(): void {
    // Cleanup logic if needed
  }
}
```

### Step 3: Add Component to Feature Module/Route

**Location**: `src/features/your-feature/your-feature.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const yourFeatureRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./your-component/your-component.component')
      .then(m => m.YourComponentComponent)
  }
];
```

---

## 🎯 Best Practices

### 1. Service Development
- ✅ Always implement interfaces first
- ✅ Use dependency injection for all services
- ✅ Implement proper error handling with try-catch blocks
- ✅ Use signals for reactive state management
- ✅ Add comprehensive logging for debugging
- ✅ Follow the single responsibility principle
- ❌ Don't use `any` types
- ❌ Don't perform business logic in components
- ❌ Don't forget to handle cleanup in OnDestroy

### 2. Component Development
- ✅ Use OnPush change detection strategy
- ✅ Implement OnInit and OnDestroy lifecycle hooks
- ✅ Use standalone components
- ✅ Implement proper loading and error states
- ✅ Use computed signals for derived state
- ✅ Follow consistent naming conventions
- ❌ Don't perform HTTP calls directly in components
- ❌ Don't mutate props or inputs directly
- ❌ Don't forget to unsubscribe from observables

### 3. Code Quality
- ✅ Write unit tests for all services and components
- ✅ Use TypeScript strict mode
- ✅ Follow consistent file and folder naming
- ✅ Document complex business logic
- ✅ Use meaningful variable and function names
- ❌ Don't ignore TypeScript errors or warnings
- ❌ Don't commit commented-out code
- ❌ Don't hardcode configuration values

---

## 📚 Code Examples

### Example: Creating a Document Service

```typescript
// 1. Interface
export interface IDocumentService {
  getDocuments(query?: string): Promise<INuxeoDocument[]>;
  getDocument(id: string): Promise<INuxeoDocument>;
  createDocument(doc: Partial<INuxeoDocument>): Promise<INuxeoDocument>;
  updateDocument(id: string, updates: Partial<INuxeoDocument>): Promise<INuxeoDocument>;
  deleteDocument(id: string): Promise<boolean>;
}

// 2. Service Implementation
@Injectable({
  providedIn: 'root'
})
export class DocumentService implements IDocumentService {
  private readonly nuxeoService = inject(NuxeoService);
  
  async getDocuments(query?: string): Promise<INuxeoDocument[]> {
    // Implementation
  }
  
  // ... other methods
}

// 3. Component Usage
export class DocumentListComponent {
  private readonly documentService = inject(DocumentService);
  public readonly documents = signal<INuxeoDocument[]>([]);
  
  async loadDocuments(): Promise<void> {
    const docs = await this.documentService.getDocuments();
    this.documents.set(docs);
  }
}
```

---

## 🧪 Testing Guidelines

### Unit Test Example

```typescript
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { YourService } from './your-service.service';
import { LoggingService } from './logging.service';

describe('YourService', () => {
  let service: YourService;
  let mockLoggingService: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const logSpy = jasmine.createSpyObj('LoggingService', ['info', 'error', 'warn']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LoggingService, useValue: logSpy }
      ]
    });

    service = TestBed.inject(YourService);
    mockLoggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize successfully with valid config', async () => {
    const config = { baseUrl: 'http://test.com', timeout: 5000 };
    
    const result = await service.initialize(config);
    
    expect(result).toBe(true);
    expect(service.isInitialized()).toBe(true);
  });

  it('should handle initialization errors', async () => {
    const invalidConfig = { baseUrl: '', timeout: 0 };
    
    await expectAsync(service.initialize(invalidConfig)).toBeRejected();
    expect(service.isInitialized()).toBe(false);
  });
});
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Material Icons Not Loading
**Problem**: Icons showing as text or not displaying
**Solution**: 
- Ensure Material Icons font is loaded in `index.html`
- Check styles.scss for proper theme import
- Verify MatIconModule is imported in components

#### 2. Nuxeo Connection Errors
**Problem**: CORS or connection issues
**Solution**:
- Check proxy.conf.json configuration
- Verify Nuxeo server is running and accessible
- Ensure proper authentication credentials

#### 3. TypeScript Compilation Errors
**Problem**: Build failures due to type errors
**Solution**:
- Check interface definitions match implementation
- Ensure all imports are correctly specified
- Verify generic types are properly constrained

#### 4. Service Injection Errors
**Problem**: "No provider for service" errors
**Solution**:
- Ensure services are decorated with `@Injectable({ providedIn: 'root' })`
- Check that services are properly imported
- Verify circular dependency issues

### Debug Commands

```bash
# Check build errors
nx build POC-WS --verbose

# Run with source maps
nx serve POC-WS --source-map

# Run tests with coverage
nx test POC-WS --coverage

# Lint code
nx lint POC-WS

# Check bundle size
nx build POC-WS --stats-json
npx webpack-bundle-analyzer dist/apps/POC-WS/stats.json
```

---

## 📞 Support

For technical issues or questions:
1. Check this documentation first
2. Review existing code examples in the project
3. Check the troubleshooting section
4. Contact the development team lead

---

## 📝 Contributing

When contributing to this project:
1. Follow the architectural patterns outlined in this guide
2. Write comprehensive tests for new functionality
3. Update documentation for any new patterns or services
4. Use the established code review process
5. Ensure all builds pass before submitting PR

---

*Last Updated: October 2025*
*Version: 1.0.0*