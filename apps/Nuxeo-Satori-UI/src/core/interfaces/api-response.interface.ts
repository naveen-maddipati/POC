/**
 * API Response Interfaces for Nuxeo Enterprise Integration
 * Comprehensive response types for all Nuxeo operations
 */

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: IApiError;
  metadata?: IApiMetadata;
}

export interface IApiError {
  code: string;
  message: string;
  status?: number;
  exception?: string;
  stacktrace?: string;
  details?: { [key: string]: any };
}

export interface IApiMetadata {
  totalSize?: number;
  pageSize?: number;
  currentPageIndex?: number;
  numberOfPages?: number;
  isPaginable?: boolean;
  resultsCount?: number;
  pageIndex?: number;
  pageCount?: number;
  hasError?: boolean;
  errorMessage?: string;
}

export interface INuxeoDocuments {
  'entity-type': string;
  isPaginable: boolean;
  resultsCount: number;
  pageSize: number;
  maxPageSize: number;
  resultsCountLimit: number;
  currentPageSize: number;
  currentPageIndex: number;
  numberOfPages: number;
  isPreviousPageAvailable: boolean;
  isNextPageAvailable: boolean;
  isLastPageAvailable: boolean;
  isSortable: boolean;
  hasError: boolean;
  errorMessage?: string;
  totalSize: number;
  pageIndex: number;
  pageCount: number;
  entries: import('./document.interface').INuxeoDocument[];
}

export interface INuxeoUsers {
  'entity-type': string;
  isPaginable: boolean;
  resultsCount: number;
  pageSize: number;
  maxPageSize: number;
  currentPageSize: number;
  currentPageIndex: number;
  numberOfPages: number;
  isPreviousPageAvailable: boolean;
  isNextPageAvailable: boolean;
  isLastPageAvailable: boolean;
  isSortable: boolean;
  hasError: boolean;
  errorMessage?: string;
  totalSize: number;
  pageIndex: number;
  pageCount: number;
  entries: import('./nuxeo-config.interface').INuxeoUser[];
}

export interface INuxeoGroups {
  'entity-type': string;
  isPaginable: boolean;
  resultsCount: number;
  pageSize: number;
  maxPageSize: number;
  currentPageSize: number;
  currentPageIndex: number;
  numberOfPages: number;
  isPreviousPageAvailable: boolean;
  isNextPageAvailable: boolean;
  isLastPageAvailable: boolean;
  isSortable: boolean;
  hasError: boolean;
  errorMessage?: string;
  totalSize: number;
  pageIndex: number;
  pageCount: number;
  entries: import('./nuxeo-config.interface').INuxeoGroup[];
}

export interface INuxeoDirectoryEntries {
  'entity-type': string;
  entries: import('./nuxeo-config.interface').INuxeoDirectoryEntry[];
}

export interface INuxeoOperations {
  'entity-type': string;
  operations: import('./nuxeo-config.interface').INuxeoOperation[];
}

export interface INuxeoWorkflows {
  'entity-type': string;
  entries: import('./nuxeo-config.interface').INuxeoWorkflow[];
}

export interface INuxeoTasks {
  'entity-type': string;
  entries: import('./nuxeo-config.interface').INuxeoTask[];
}

export interface INuxeoBatchUploadResponse {
  'entity-type': string;
  batchId: string;
  fileIdx?: number;
  uploadType?: string;
  uploadedSize?: number;
  fileEntries?: INuxeoBatchFileEntry[];
}

export interface INuxeoBatchFileEntry {
  name: string;
  size: number;
  uploadType: string;
  uploadedChunkIds?: string[];
  chunkCount?: number;
  uploadedChunkIdsSize?: number;
  uploadedSize?: number;
}

export interface INuxeoSearchResponse {
  'entity-type': string;
  isPaginable: boolean;
  resultsCount: number;
  pageSize: number;
  maxPageSize: number;
  resultsCountLimit: number;
  currentPageSize: number;
  currentPageIndex: number;
  numberOfPages: number;
  isPreviousPageAvailable: boolean;
  isNextPageAvailable: boolean;
  isLastPageAvailable: boolean;
  isSortable: boolean;
  hasError: boolean;
  errorMessage?: string;
  totalSize: number;
  pageIndex: number;
  pageCount: number;
  entries: import('./document.interface').INuxeoDocument[];
  aggregations?: { [key: string]: any };
}