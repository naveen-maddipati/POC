/**
 * Enterprise Document API Service
 * Type-safe automation operations based on actual server response
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry, timeout } from 'rxjs/operators';

import { LoggingService } from './logging.service';
import { UserService } from './user.service';
import { DOCUMENT_CONSTANTS } from '../constants/document.constants';

import { 
  NuxeoDocument, 
  DocumentCreateParams, 
  DocumentUpdateParams,
  DocumentQueryParams,
  DocumentMoveParams,
  DocumentCopyParams,
  DocumentDeleteParams,
  DocumentSetPropertyParams,
  DocumentAddPermissionParams,
  SearchResponse,
  AutomationResponse,
  WorkflowStartParams,
  TaskCompleteParams,
  DocumentCreateVersionParams,
  BatchUpload,
  BatchInitParams
} from '../../types';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseDocumentApiService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggingService);
  private readonly userService = inject(UserService);

  private get baseUrl(): string {
    // For now, use environment-based URL
    return 'http://localhost:8080/nuxeo';
  }

  /**
   * Create HTTP headers with authentication
   * Uses the same authentication pattern as DocumentService
   */
  private createHeaders() {
    const user = this.userService.currentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Use UserService authentication header (same as DocumentService)
    const authHeader = this.userService.getBasicAuthHeader();
    
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
      this.logger.info('Using authentication from UserService', { 
        userEmail: user.email,
        hasAuth: true
      }, 'EnterpriseDocumentApi');
    } else {
      // Fallback to default Nuxeo credentials for development
      const credentials = btoa('Administrator:Administrator');
      headers['Authorization'] = `Basic ${credentials}`;
      this.logger.warn('No user authentication found, using fallback credentials', {
        userEmail: user.email,
        hasAuth: false
      }, 'EnterpriseDocumentApi');
    }

    return headers;
  }

  // ==================== DOCUMENT OPERATIONS ====================

  /**
   * Create document with full type safety
   */
  createDocument(parentPath: string, params: DocumentCreateParams): Observable<NuxeoDocument> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'document',
      type: params.type,
      name: params.name,
      properties: params.properties || {}
    };

    this.logger.info('Creating document', { type: params.type, name: params.name, parent: parentPath }, 'EnterpriseDocumentApi');

    return this.http.post<NuxeoDocument>(`${this.baseUrl}/api/v1/automation/Document.Create`, body, { 
      headers,
      params: new HttpParams().set('input', `doc:${parentPath}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((doc) => {
        this.logger.info('Document created successfully', { uid: doc.uid, path: doc.path }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Document creation failed', { 
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          headers: error.headers?.get('WWW-Authenticate'),
          message: error.message
        }, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update document properties
   */
  updateDocument(documentPath: string, params: DocumentUpdateParams): Observable<NuxeoDocument> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'document',
      properties: params.properties
    };

    this.logger.info('Updating document', { path: documentPath, properties: Object.keys(params.properties) }, 'EnterpriseDocumentApi');

    return this.http.post<NuxeoDocument>(`${this.baseUrl}/api/v1/automation/Document.Update`, body, { 
      headers,
      params: new HttpParams()
        .set('input', `doc:${documentPath}`)
        .set('save', params.save?.toString() || 'true')
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((doc) => {
        this.logger.info('Document updated successfully', { uid: doc.uid, path: doc.path }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Document update failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Move document to new location
   */
  moveDocument(documentPath: string, params: DocumentMoveParams): Observable<NuxeoDocument> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'document',
      target: params.target,
      name: params.name
    };

    this.logger.info('Moving document', { from: documentPath, to: params.target }, 'EnterpriseDocumentApi');

    return this.http.post<NuxeoDocument>(`${this.baseUrl}/api/v1/automation/Document.Move`, body, { 
      headers,
      params: new HttpParams().set('input', `doc:${documentPath}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((doc) => {
        this.logger.info('Document moved successfully', { uid: doc.uid, newPath: doc.path }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Document move failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Copy document to new location
   */
  copyDocument(documentPath: string, params: DocumentCopyParams): Observable<NuxeoDocument> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'document',
      target: params.target,
      name: params.name
    };

    this.logger.info('Copying document', { from: documentPath, to: params.target }, 'EnterpriseDocumentApi');

    return this.http.post<NuxeoDocument>(`${this.baseUrl}/api/v1/automation/Document.Copy`, body, { 
      headers,
      params: new HttpParams().set('input', `doc:${documentPath}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((doc) => {
        this.logger.info('Document copied successfully', { uid: doc.uid, newPath: doc.path }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Document copy failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete document (move to trash or permanent)
   */
  deleteDocument(documentPath: string, params?: DocumentDeleteParams): Observable<void> {
    const headers = this.createHeaders();
    const operationId = params?.permanently ? 'Document.Delete' : 'Document.Trash';

    this.logger.info('Deleting document', { path: documentPath, permanent: params?.permanently }, 'EnterpriseDocumentApi');

    return this.http.post<void>(`${this.baseUrl}/api/v1/automation/${operationId}`, {}, { 
      headers,
      params: new HttpParams().set('input', `doc:${documentPath}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap(() => {
        this.logger.info('Document deleted successfully', { path: documentPath }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Document deletion failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Set document property
   */
  setDocumentProperty(documentPath: string, params: DocumentSetPropertyParams): Observable<NuxeoDocument> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'document',
      xpath: params.xpath,
      value: params.value
    };

    this.logger.info('Setting document property', { path: documentPath, xpath: params.xpath }, 'EnterpriseDocumentApi');

    return this.http.post<NuxeoDocument>(`${this.baseUrl}/api/v1/automation/Document.SetProperty`, body, { 
      headers,
      params: new HttpParams()
        .set('input', `doc:${documentPath}`)
        .set('save', params.save?.toString() || 'true')
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((doc) => {
        this.logger.info('Document property set successfully', { uid: doc.uid, xpath: params.xpath }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Setting document property failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Add permission to document
   */
  addDocumentPermission(documentPath: string, params: DocumentAddPermissionParams): Observable<void> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'document',
      permission: params.permission,
      users: params.users,
      groups: params.groups,
      begin: params.begin,
      end: params.end,
      creator: params.creator,
      comment: params.comment
    };

    this.logger.info('Adding document permission', { 
      path: documentPath, 
      permission: params.permission, 
      users: params.users, 
      groups: params.groups 
    }, 'EnterpriseDocumentApi');

    return this.http.post<void>(`${this.baseUrl}/api/v1/automation/Document.AddPermission`, body, { 
      headers,
      params: new HttpParams().set('input', `doc:${documentPath}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap(() => {
        this.logger.info('Document permission added successfully', { path: documentPath }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Adding document permission failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  // ==================== QUERY OPERATIONS ====================

  /**
   * Execute NXQL query with full type safety
   */
  queryDocuments(params: DocumentQueryParams): Observable<SearchResponse> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'documents',
      query: params.query,
      language: params.language || 'NXQL',
      pageSize: params.pageSize || 20,
      currentPageIndex: params.currentPageIndex || 0,
      maxResults: params.maxResults,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      queryParams: params.queryParams
    };

    this.logger.info('Executing NXQL query', { 
      query: params.query, 
      pageSize: params.pageSize, 
      currentPage: params.currentPageIndex 
    }, 'EnterpriseDocumentApi');

    return this.http.post<SearchResponse>(`${this.baseUrl}/api/v1/automation/Repository.Query`, body, { headers }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((response) => {
        this.logger.info('NXQL query executed successfully', { 
          resultsCount: response.resultsCount,
          totalSize: response.totalSize
        }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('NXQL query failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get document by path
   */
  getDocumentByPath(path: string): Observable<NuxeoDocument> {
    const headers = this.createHeaders();
    
    this.logger.info('Getting document by path', { path }, 'EnterpriseDocumentApi');

    return this.http.get<NuxeoDocument>(`${this.baseUrl}/api/v1/automation/Repository.GetDocument`, { 
      headers,
      params: new HttpParams().set('input', `doc:${path}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((doc) => {
        this.logger.info('Document retrieved successfully', { uid: doc.uid, title: doc.title }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Document retrieval failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  // ==================== WORKFLOW OPERATIONS ====================

  /**
   * Start workflow on document
   */
  startWorkflow(documentPath: string, params: WorkflowStartParams): Observable<any> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'workflow',
      workflowModelName: params.id,
      variables: params.variables || {}
    };

    this.logger.info('Starting workflow', { path: documentPath, workflow: params.id }, 'EnterpriseDocumentApi');

    return this.http.post(`${this.baseUrl}/api/v1/automation/Context.StartWorkflow`, body, { 
      headers,
      params: new HttpParams().set('input', `doc:${documentPath}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap(() => {
        this.logger.info('Workflow started successfully', { path: documentPath, workflow: params.id }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Starting workflow failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  /**
   * Complete task
   */
  completeTask(taskId: string, params?: TaskCompleteParams): Observable<any> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'task',
      variables: params?.variables || {},
      comment: params?.comment
    };

    this.logger.info('Completing task', { taskId, comment: params?.comment }, 'EnterpriseDocumentApi');

    return this.http.post(`${this.baseUrl}/api/v1/automation/Task.Complete`, body, { 
      headers,
      params: new HttpParams().set('input', taskId)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap(() => {
        this.logger.info('Task completed successfully', { taskId }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Task completion failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  // ==================== VERSIONING OPERATIONS ====================

  /**
   * Create document version
   */
  createVersion(documentPath: string, params: DocumentCreateVersionParams): Observable<NuxeoDocument> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'document',
      increment: params.increment,
      comment: params.comment
    };

    this.logger.info('Creating document version', { path: documentPath, increment: params.increment }, 'EnterpriseDocumentApi');

    return this.http.post<NuxeoDocument>(`${this.baseUrl}/api/v1/automation/Document.CreateVersion`, body, { 
      headers,
      params: new HttpParams().set('input', `doc:${documentPath}`)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((doc) => {
        this.logger.info('Document version created successfully', { 
          uid: doc.uid, 
          versionLabel: doc.versionLabel 
        }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Document version creation failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Initialize batch upload
   */
  initializeBatch(params?: BatchInitParams): Observable<BatchUpload> {
    const headers = this.createHeaders();
    const body = {
      'entity-type': 'batchUpload',
      handler: params?.handler || 'defaultHandler',
      params: params?.params || {}
    };

    this.logger.info('Initializing batch upload', { handler: params?.handler }, 'EnterpriseDocumentApi');

    return this.http.post<BatchUpload>(`${this.baseUrl}/api/v1/upload`, body, { headers }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap((batch) => {
        this.logger.info('Batch upload initialized successfully', { batchId: batch.batchId }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Batch upload initialization failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }

  // ==================== AUTOMATION OPERATIONS ====================

  /**
   * Execute any automation operation with type safety
   */
  executeOperation<T = any>(
    operationId: string, 
    input: string, 
    params: Record<string, any> = {}
  ): Observable<AutomationResponse<T>> {
    const headers = this.createHeaders();
    const body = {
      params
    };

    this.logger.info('Executing automation operation', { operationId, input }, 'EnterpriseDocumentApi');

    return this.http.post<AutomationResponse<T>>(`${this.baseUrl}/api/v1/automation/${operationId}`, body, { 
      headers,
      params: new HttpParams().set('input', input)
    }).pipe(
      timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
      retry(2),
      tap(() => {
        this.logger.info('Automation operation executed successfully', { operationId }, 'EnterpriseDocumentApi');
      }),
      catchError((error) => {
        this.logger.error('Automation operation failed', error, 'EnterpriseDocumentApi');
        return throwError(() => error);
      })
    );
  }
}