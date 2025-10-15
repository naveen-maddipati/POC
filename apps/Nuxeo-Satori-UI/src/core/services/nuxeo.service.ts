/**
 * Enterprise Nuxeo Service
 * Comprehensive service implementing official Nuxeo JavaScript Client patterns
 * Follows documentation best practices with enterprise-grade error handling
 */

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError, timer } from 'rxjs';
import { catchError, retryWhen, switchMap, tap, timeout, map } from 'rxjs/operators';

// Dynamic import for Nuxeo client to handle CommonJS module
let Nuxeo: any = null;

import { 
  INuxeoConfig, 
  INuxeoConnection, 
  INuxeoDocument, 
  INuxeoUser,
  IApiResponse,
  INuxeoDocuments 
} from '../interfaces';
import { LoggingService } from './logging.service';
import { environment } from '../../../../../src/environments/environment';
import { APP_CONSTANTS, NUXEO_OPERATIONS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class NuxeoService {
  private readonly logger = inject(LoggingService);
  
  private nuxeoClient: any = null;
  private connectionSubject = new BehaviorSubject<INuxeoConnection>({ connected: false });
  
  public readonly connection$ = this.connectionSubject.asObservable();
  public readonly isConnected$ = this.connection$.pipe(map(conn => conn.connected));

  constructor() {
    this.logger.info('NuxeoService initialized', { 
      environment: environment.name,
      baseURL: environment.nuxeo.baseURL 
    });
    
    // Load Nuxeo client and auto-connect in development mode
    this.loadNuxeoClient().then(() => {
      if (!environment.production) {
        this.connect().subscribe({
          next: () => this.logger.info('Auto-connection successful'),
          error: (error) => this.logger.warn('Auto-connection failed', error)
        });
      }
    }).catch((error: any) => {
      this.logger.error('Failed to load Nuxeo client', error);
    });
  }

  /**
   * Dynamically load Nuxeo client to handle CommonJS module
   */
  private async loadNuxeoClient(): Promise<void> {
    if (Nuxeo) {
      return; // Already loaded
    }

    try {
      // Use dynamic import to load the CommonJS module
      const nuxeoModule = await import('nuxeo' as any);
      Nuxeo = (nuxeoModule as any).default || nuxeoModule;
      this.logger.info('Nuxeo client loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load Nuxeo client module', error);
      throw new Error('Could not load Nuxeo client. Please ensure nuxeo package is installed.');
    }
  }

  /**
   * Ensure Nuxeo client is loaded before operations
   */
  private async ensureNuxeoLoaded(): Promise<void> {
    if (!Nuxeo) {
      await this.loadNuxeoClient();
    }
  }

  /**
   * Connect to Nuxeo server following official documentation pattern
   */
  connect(config?: Partial<INuxeoConfig>): Observable<INuxeoConnection> {
    const startTime = performance.now();
    const nuxeoConfig = { ...environment.nuxeo, ...config };
    
    this.logger.info('Connecting to Nuxeo server', { 
      baseURL: nuxeoConfig.baseURL,
      authMethod: nuxeoConfig.auth.method 
    });

    return from(this.performConnection(nuxeoConfig)).pipe(
      timeout(nuxeoConfig.httpTimeout || APP_CONSTANTS.HTTP.TIMEOUT),
      retryWhen(errors => this.createRetryLogic(errors)),
      tap((connection) => {
        this.logger.logPerformance('Nuxeo Connection', startTime);
        this.connectionSubject.next(connection);
        this.logger.info('Successfully connected to Nuxeo', {
          serverVersion: connection.serverVersion,
          user: connection.user?.properties?.username
        });
      }),
      catchError((error) => {
        this.logger.logNuxeoError('connect', error);
        this.connectionSubject.next({ connected: false });
        return throwError(() => this.createApiError('CONNECTION_FAILED', error));
      })
    );
  }

  /**
   * Disconnect from Nuxeo server
   */
  disconnect(): void {
    this.nuxeoClient = null;
    this.connectionSubject.next({ connected: false });
    this.logger.info('Disconnected from Nuxeo server');
  }

  /**
   * Get current user information
   */
  getCurrentUser(): Observable<IApiResponse<INuxeoUser>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        return from(this.nuxeoClient.request('user/Administrator').get() as Promise<INuxeoUser>).pipe(
          tap(() => this.logger.logPerformance('Get Current User', startTime)),
          map((user: INuxeoUser) => ({ success: true, data: user })),
          catchError((error) => {
            this.logger.logNuxeoError('getCurrentUser', error);
            return throwError(() => this.createApiError('USER_FETCH_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Fetch document by path or ID
   */
  fetchDocument(pathOrId: string, schemas?: string[]): Observable<IApiResponse<INuxeoDocument>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        const fetchOptions = schemas ? { schemas } : {};
        
        this.logger.logNuxeoOperation('fetchDocument', { pathOrId, schemas });
        
        return from(this.nuxeoClient.repository().fetch(pathOrId, fetchOptions) as Promise<INuxeoDocument>).pipe(
          tap(() => this.logger.logPerformance('Fetch Document', startTime)),
          map((doc: INuxeoDocument) => ({ success: true, data: doc })),
          catchError((error) => {
            this.logger.logNuxeoError('fetchDocument', error, { pathOrId, schemas });
            return throwError(() => this.createApiError('DOCUMENT_FETCH_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Get children of a document (folder contents)
   */
  getChildren(pathOrId: string, pageSize = 20, currentPage = 0): Observable<IApiResponse<INuxeoDocuments>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        const params = {
          pageSize: pageSize.toString(),
          currentPageIndex: currentPage.toString()
        };

        this.logger.logNuxeoOperation('getChildren', { pathOrId, ...params });

        return from(
          this.nuxeoClient.operation(NUXEO_OPERATIONS.DOCUMENT_GET_CHILDREN)
            .input(pathOrId)
            .params(params)
            .execute() as Promise<INuxeoDocuments>
        ).pipe(
          tap(() => this.logger.logPerformance('Get Children', startTime)),
          map((docs: INuxeoDocuments) => ({ success: true, data: docs })),
          catchError((error) => {
            this.logger.logNuxeoError('getChildren', error, { pathOrId, ...params });
            return throwError(() => this.createApiError('CHILDREN_FETCH_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Create a new document
   */
  createDocument(parentPath: string, document: Partial<INuxeoDocument>): Observable<IApiResponse<INuxeoDocument>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        
        this.logger.logNuxeoOperation('createDocument', { parentPath, type: document.type, name: (document as any).name });

        return from(this.nuxeoClient.repository().create(parentPath, document) as Promise<INuxeoDocument>).pipe(
          tap(() => this.logger.logPerformance('Create Document', startTime)),
          map((doc: INuxeoDocument) => ({ success: true, data: doc })),
          catchError((error) => {
            this.logger.logNuxeoError('createDocument', error, { parentPath, document });
            return throwError(() => this.createApiError('DOCUMENT_CREATE_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Update an existing document
   */
  updateDocument(document: INuxeoDocument): Observable<IApiResponse<INuxeoDocument>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        
        this.logger.logNuxeoOperation('updateDocument', { uid: document.uid, path: document.path });

        // Create a document object and update it
        const docToUpdate = {
          ...document,
          save: () => this.nuxeoClient.repository().update(document)
        };

        return from(docToUpdate.save() as Promise<INuxeoDocument>).pipe(
          tap(() => this.logger.logPerformance('Update Document', startTime)),
          map((doc: INuxeoDocument) => ({ success: true, data: doc })),
          catchError((error) => {
            this.logger.logNuxeoError('updateDocument', error, { uid: document.uid });
            return throwError(() => this.createApiError('DOCUMENT_UPDATE_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Delete a document
   */
  deleteDocument(pathOrId: string): Observable<IApiResponse<void>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        
        this.logger.logNuxeoOperation('deleteDocument', { pathOrId });

        return from(this.nuxeoClient.repository().delete(pathOrId)).pipe(
          tap(() => this.logger.logPerformance('Delete Document', startTime)),
          map(() => ({ success: true })),
          catchError((error) => {
            this.logger.logNuxeoError('deleteDocument', error, { pathOrId });
            return throwError(() => this.createApiError('DOCUMENT_DELETE_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Execute a Nuxeo operation
   */
  executeOperation(operationId: string, input?: any, params?: any): Observable<IApiResponse<any>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        
        this.logger.logNuxeoOperation('executeOperation', { operationId, input, params });

        let operation = this.nuxeoClient.operation(operationId);
        
        if (input !== undefined) {
          operation = operation.input(input);
        }
        
        if (params) {
          operation = operation.params(params);
        }

        return from(operation.execute()).pipe(
          tap(() => this.logger.logPerformance(`Operation: ${operationId}`, startTime)),
          map((result: any) => ({ success: true, data: result })),
          catchError((error) => {
            this.logger.logNuxeoError('executeOperation', error, { operationId, input, params });
            return throwError(() => this.createApiError('OPERATION_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Perform NXQL query
   */
  query(nxql: string, pageSize = 20, currentPage = 0): Observable<IApiResponse<INuxeoDocuments>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        const params = {
          query: nxql,
          pageSize: pageSize.toString(),
          currentPageIndex: currentPage.toString()
        };

        this.logger.logNuxeoOperation('query', params);

        return from(
          this.nuxeoClient.operation(NUXEO_OPERATIONS.DOCUMENT_QUERY)
            .params(params)
            .execute() as Promise<INuxeoDocuments>
        ).pipe(
          tap(() => this.logger.logPerformance('NXQL Query', startTime)),
          map((docs: INuxeoDocuments) => ({ success: true, data: docs })),
          catchError((error) => {
            this.logger.logNuxeoError('query', error, params);
            return throwError(() => this.createApiError('QUERY_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Get server information
   */
  getServerInfo(): Observable<IApiResponse<any>> {
    return this.ensureConnection().pipe(
      switchMap(() => {
        const startTime = performance.now();
        
        return from(this.nuxeoClient.request('').get()).pipe(
          tap(() => this.logger.logPerformance('Get Server Info', startTime)),
          map((info: any) => ({ success: true, data: info })),
          catchError((error) => {
            this.logger.logNuxeoError('getServerInfo', error);
            return throwError(() => this.createApiError('SERVER_INFO_FAILED', error));
          })
        );
      })
    );
  }

  /**
   * Private method to perform the actual connection
   */
  private async performConnection(config: INuxeoConfig): Promise<INuxeoConnection> {
    // Ensure Nuxeo client is loaded
    await this.ensureNuxeoLoaded();
    
    // Create Nuxeo client following official documentation
    this.nuxeoClient = new Nuxeo(config);
    
    // Connect using the documented pattern
    const connectedClient = await this.nuxeoClient.connect();
    
    return {
      connected: true,
      user: connectedClient.user,
      serverVersion: connectedClient.serverVersion,
      client: connectedClient
    };
  }

  /**
   * Ensure we have an active connection
   */
  private ensureConnection(): Observable<INuxeoConnection> {
    const currentConnection = this.connectionSubject.value;
    
    if (currentConnection.connected && this.nuxeoClient) {
      return new BehaviorSubject(currentConnection).asObservable();
    }
    
    this.logger.warn('No active Nuxeo connection, attempting to reconnect');
    return this.connect();
  }

  /**
   * Create retry logic for failed operations
   */
  private createRetryLogic(errors: Observable<any>): Observable<any> {
    return errors.pipe(
      switchMap((error, index) => {
        if (index >= APP_CONSTANTS.HTTP.RETRY_ATTEMPTS) {
          return throwError(() => error);
        }
        
        const delay = APP_CONSTANTS.HTTP.RETRY_DELAY * Math.pow(2, index); // Exponential backoff
        this.logger.warn(`Retrying Nuxeo operation (attempt ${index + 1})`, { delay });
        
        return timer(delay);
      })
    );
  }

  /**
   * Create standardized API error
   */
  private createApiError(code: string, originalError: any): IApiResponse {
    return {
      success: false,
      error: {
        code,
        message: originalError?.message || 'Unknown error occurred',
        status: originalError?.response?.status,
        details: {
          originalError: originalError instanceof Error ? {
            name: originalError.name,
            message: originalError.message,
            stack: originalError.stack
          } : originalError
        }
      }
    };
  }
}