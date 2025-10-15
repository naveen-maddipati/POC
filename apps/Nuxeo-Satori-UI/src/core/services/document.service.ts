/**
 * Enterprise Document Service
 * Comprehensive service for Nuxeo document operations with enterprise patterns
 */

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, tap, retry, timeout } from 'rxjs/operators';

import { LoggingService } from './logging.service';
import { UserService } from './user.service';
import { DocumentTypeDiscoveryService } from './document-type-discovery.service';
import { 
  IDocumentSearchResponse,
  IDocumentSearchParams,
  INuxeoDocument,
  IDocumentService,
  IDocumentTableData
} from '../interfaces/document.interface';
import { DOCUMENT_CONSTANTS } from '../constants/document.constants';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements IDocumentService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggingService);
  private readonly userService = inject(UserService);
  private readonly documentTypeDiscovery = inject(DocumentTypeDiscoveryService);

  // State management with signals
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _lastSearchResults = signal<IDocumentSearchResponse | null>(null);

  // Public readonly signals
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly lastSearchResults = this._lastSearchResults.asReadonly();

  // Base URL for direct API calls
  private readonly baseUrl = 'http://localhost:8080';

  constructor() {
    this.logger.info('Service instantiated', undefined, 'DocumentService');
    
    // Initialize document type discovery when user authenticates
    // Since UserService uses signals, we'll check authentication status when needed
    this.initializeDocumentTypesIfAuthenticated();
  }

  /**
   * Initialize document type discovery if user is authenticated
   */
  private initializeDocumentTypesIfAuthenticated(): void {
    if (this.userService.isAuthenticated()) {
      this.documentTypeDiscovery.discoverDocumentTypes().subscribe({
        next: (types) => {
          this.logger.info('Document types discovered', { count: types.length }, 'DocumentService');
        },
        error: (error) => {
          this.logger.warn('Failed to discover document types, using fallback', error, 'DocumentService');
        }
      });
    }
  }

  /**
   * Get available document types
   */
  public getAvailableDocumentTypes() {
    return this.documentTypeDiscovery.availableTypes();
  }

  /**
   * Get creatable document types
   */
  public getCreatableDocumentTypes() {
    return this.documentTypeDiscovery.creatableTypes();
  }

  /**
   * Refresh document types from server
   */
  public refreshDocumentTypes() {
    return this.documentTypeDiscovery.refreshDocumentTypes();
  }

  /**
   * Check if user is authenticated for Nuxeo operations
   */
  public isUserAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  /**
   * Get current user's authentication method
   */
  public getCurrentAuthMethod(): string {
    const user = this.userService.currentUser();
    return user?.authMethod || 'none';
  }

  /**
   * Ensure user is authenticated before making API calls
   */
  private ensureAuthenticated(): void {
    if (!this.isUserAuthenticated()) {
      const message = 'User must be authenticated to access Nuxeo documents';
      this.logger.warn(message, undefined, 'DocumentService');
      throw new Error(message);
    }
  }

  /**
   * Search documents using Nuxeo search API
   */
  public async searchDocuments(params: IDocumentSearchParams): Promise<IDocumentSearchResponse> {
    try {
      // Ensure user is authenticated
      this.ensureAuthenticated();
      
      this._isLoading.set(true);
      this._error.set(null);
      
      const searchParams = this.buildSearchParams(params);
      const headers = this.createHeaders();
      
      this.logger.info('Starting document search', { 
        params, 
        url: `${this.baseUrl}${DOCUMENT_CONSTANTS.API.ENDPOINTS.SEARCH}`,
        searchParams: searchParams.toString(),
        authMethod: this.getCurrentAuthMethod()
      }, 'DocumentService');

      const response = await this.http.get<IDocumentSearchResponse>(
        `${this.baseUrl}${DOCUMENT_CONSTANTS.API.ENDPOINTS.SEARCH}`,
        { 
          headers,
          params: searchParams,
          observe: 'body'
        }
      ).pipe(
        timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
        retry(DOCUMENT_CONSTANTS.RETRY.MAX_ATTEMPTS),
        tap(response => {
          this.logger.info('Document search completed', {
            resultsCount: response.resultsCount,
            currentPageIndex: response.currentPageIndex,
            totalSize: response.totalSize
          }, 'DocumentService');
        }),
        catchError(error => {
          this.logger.error('Document search failed', error, 'DocumentService');
          this._error.set(this.getErrorMessage(error));
          return throwError(() => error);
        })
      ).toPromise();

      if (!response) {
        throw new Error('No response received from search API');
      }

      this._lastSearchResults.set(response);
      this.logger.info('Document search successful', {
        resultsCount: response.resultsCount,
        currentPage: response.currentPageIndex
      }, 'DocumentService');

      return response;

    } catch (error) {
      this.logger.error('Failed to search documents', error, 'DocumentService');
      this._error.set(this.getErrorMessage(error));
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Get recently modified documents (convenience method)
   */
  public async getRecentlyModified(pageSize = 20): Promise<IDocumentSearchResponse> {
    return this.searchDocuments({
      currentPageIndex: 0,
      pageSize,
      queryParams: '/',
      sortBy: 'dc:modified',
      sortOrder: 'desc'
    });
  }

  /**
   * Get document by ID
   */
  public async getDocumentById(uid: string): Promise<INuxeoDocument> {
    try {
      // Ensure user is authenticated
      this.ensureAuthenticated();
      
      this._isLoading.set(true);
      this._error.set(null);
      
      const headers = this.createHeaders();
      
      this.logger.info('Fetching document by ID', { uid }, 'DocumentService');

      const response = await this.http.get<INuxeoDocument>(
        `${this.baseUrl}${DOCUMENT_CONSTANTS.API.ENDPOINTS.DOCUMENT_BY_ID}/${uid}`,
        { headers }
      ).pipe(
        timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
        retry(DOCUMENT_CONSTANTS.RETRY.MAX_ATTEMPTS),
        catchError(error => {
          this.logger.error('Failed to fetch document by ID', error, 'DocumentService');
          this._error.set(this.getErrorMessage(error));
          return throwError(() => error);
        })
      ).toPromise();

      if (!response) {
        throw new Error('No response received from document API');
      }

      this.logger.info('Document fetched successfully', { uid, title: response.title }, 'DocumentService');
      return response;

    } catch (error) {
      this.logger.error('Failed to get document by ID', error, 'DocumentService');
      this._error.set(this.getErrorMessage(error));
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Get document by path
   */
  public async getDocumentByPath(path: string): Promise<INuxeoDocument> {
    try {
      this._isLoading.set(true);
      this._error.set(null);
      
      const headers = this.createHeaders();
      
      this.logger.info('Fetching document by path', { path }, 'DocumentService');

      const response = await this.http.get<INuxeoDocument>(
        `${this.baseUrl}${DOCUMENT_CONSTANTS.API.ENDPOINTS.DOCUMENT_BY_PATH}${path}`,
        { headers }
      ).pipe(
        timeout(DOCUMENT_CONSTANTS.API.TIMEOUT),
        retry(DOCUMENT_CONSTANTS.RETRY.MAX_ATTEMPTS),
        catchError(error => {
          this.logger.error('Failed to fetch document by path', error, 'DocumentService');
          this._error.set(this.getErrorMessage(error));
          return throwError(() => error);
        })
      ).toPromise();

      if (!response) {
        throw new Error('No response received from document API');
      }

      this.logger.info('Document fetched successfully', { path, title: response.title }, 'DocumentService');
      return response;

    } catch (error) {
      this.logger.error('Failed to get document by path', error, 'DocumentService');
      this._error.set(this.getErrorMessage(error));
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Transform Nuxeo documents to table-friendly format
   */
  public transformToTableData(documents: INuxeoDocument[]): IDocumentTableData[] {
    return documents.map(doc => ({
      uid: doc.uid,
      title: this.getDocumentTitle(doc),
      type: doc.type,
      icon: this.getDocumentIcon(doc.type),
      modified: new Date(doc.lastModified || doc.properties?.['dc:modified'] || Date.now()),
      lastContributor: doc.properties?.['dc:lastContributor'] || 'Unknown',
      path: doc.path,
      state: doc.state
    }));
  }

  /**
   * Build HTTP search parameters
   */
  private buildSearchParams(params: IDocumentSearchParams): HttpParams {
    let httpParams = new HttpParams();
    
    httpParams = httpParams.set(
      DOCUMENT_CONSTANTS.SEARCH.PARAMS.CURRENT_PAGE_INDEX, 
      (params.currentPageIndex ?? DOCUMENT_CONSTANTS.SEARCH.DEFAULTS.CURRENT_PAGE_INDEX).toString()
    );
    
    httpParams = httpParams.set(
      DOCUMENT_CONSTANTS.SEARCH.PARAMS.PAGE_SIZE, 
      (params.pageSize ?? DOCUMENT_CONSTANTS.SEARCH.DEFAULTS.PAGE_SIZE).toString()
    );
    
    httpParams = httpParams.set(
      DOCUMENT_CONSTANTS.SEARCH.PARAMS.QUERY_PARAMS, 
      params.queryParams ?? DOCUMENT_CONSTANTS.SEARCH.DEFAULTS.QUERY_PARAMS
    );

    // Add sorting if specified
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) {
        httpParams = httpParams.set('sortOrder', params.sortOrder);
      }
    }

    return httpParams;
  }

  /**
   * Create HTTP headers with authentication
   */
  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders()
      .set('Content-Type', DOCUMENT_CONSTANTS.API.HEADERS.CONTENT_TYPE)
      .set('Accept', DOCUMENT_CONSTANTS.API.HEADERS.ACCEPT);

    // Get authentication header from UserService
    const authHeader = this.userService.getBasicAuthHeader();
    if (authHeader) {
      headers = headers.set('Authorization', authHeader);
      this.logger.debug('Using authentication from UserService', undefined, 'DocumentService');
    } else {
      // Fallback to default credentials for development
      const credentials = btoa('Administrator:Administrator');
      headers = headers.set('Authorization', `Basic ${credentials}`);
      this.logger.warn('No user authentication found, using fallback credentials', undefined, 'DocumentService');
    }

    return headers;
  }

  /**
   * Get document title with fallback
   */
  private getDocumentTitle(doc: INuxeoDocument): string {
    return doc.title || 
           doc.properties?.['dc:title'] || 
           doc.path?.split('/').pop() || 
           'Untitled Document';
  }

  /**
   * Get appropriate icon for document type using discovery service
   */
  private getDocumentIcon(type: string): string {
    // Use discovery service to get dynamic icon mapping
    const discoveredIcon = this.documentTypeDiscovery.getIconForType(type);
    return discoveredIcon || DOCUMENT_CONSTANTS.ICONS.DEFAULT;
  }

  /**
   * Get detailed error message for better troubleshooting
   */
  private getErrorMessage(error: any): string {
    if (!error) return 'Unknown error';

    // Handle HTTP errors
    switch (error.status) {
      case 0:
        return 'Network error: Unable to connect to Nuxeo server';
      case 401:
        return 'Authentication failed: Invalid credentials';
      case 403:
        return 'Access forbidden: Insufficient permissions';
      case 404:
        return 'Resource not found: Check the search endpoint configuration';
      case 500:
        return 'Internal server error: Check Nuxeo server logs';
      case 503:
        return 'Service unavailable: Nuxeo server may be starting up';
      default:
        return error.message || error.error || `HTTP ${error.status}`;
    }
  }

  /**
   * Clear service state
   */
  public clearState(): void {
    this._isLoading.set(false);
    this._error.set(null);
    this._lastSearchResults.set(null);
    this.logger.info('Service state cleared', undefined, 'DocumentService');
  }
}