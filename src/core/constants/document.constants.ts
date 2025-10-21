/**
 * Document Management Constants
 * Enterprise-grade constants for Nuxeo document operations
 * 
 * INTEGRATED APPROACH:
 * - Uses auto-generated NUXEO_OPERATIONS from nuxeo.constants.ts for API calls
 * - Document types are discovered dynamically from Nuxeo automation API
 * - Constants serve as fallback values when discovery fails
 * - DocumentTypeDiscoveryService provides runtime type detection
 * - Icons are mapped dynamically based on discovered types
 * - Application adapts to new document types without code changes
 * 
 * Updated to integrate with auto-generated nuxeo.constants.ts
 */

import { NUXEO_OPERATIONS } from './nuxeo.constants';

export const DOCUMENT_CONSTANTS = {
  // Integration with auto-generated Nuxeo operations
  OPERATIONS: {
    // Common document operations (references to auto-generated constants)
    CREATE: NUXEO_OPERATIONS.Document_Create,
    UPDATE: NUXEO_OPERATIONS.Document_Update,
    DELETE: NUXEO_OPERATIONS.Document_Delete,
    COPY: NUXEO_OPERATIONS.Document_Copy,
    MOVE: NUXEO_OPERATIONS.Document_Move,
    LOCK: NUXEO_OPERATIONS.Document_Lock,
    UNLOCK: NUXEO_OPERATIONS.Document_Unlock,
    GET_CHILDREN: NUXEO_OPERATIONS.Document_GetChildren,
    ADD_PERMISSION: NUXEO_OPERATIONS.Document_AddPermission,
    CREATE_VERSION: NUXEO_OPERATIONS.Document_CreateVersion,
    
    // Blob operations
    ATTACH_BLOB: NUXEO_OPERATIONS.BlobHolder_AttachOnCurrentDocument,
    GET_BLOB: NUXEO_OPERATIONS.Document_GetBlob,
    
    // Query operations
    QUERY: NUXEO_OPERATIONS.Document_Query,
    PAGE_PROVIDER: NUXEO_OPERATIONS.Document_PageProvider,
    
    // All operations available via NUXEO_OPERATIONS constant
    ALL: NUXEO_OPERATIONS
  } as const,
  
  API: {
    ENDPOINTS: {
      SEARCH: '/nuxeo/api/v1/search/pp/domain_documents/execute',
      DOCUMENT_BY_ID: '/nuxeo/api/v1/id',
      DOCUMENT_BY_PATH: '/nuxeo/api/v1/path',
      AUTOMATION: '/nuxeo/site/automation'  // Updated to match nuxeo.constants generation
    } as const,
    HEADERS: {
      CONTENT_TYPE: 'application/json',
      ACCEPT: 'application/json'
    } as const,
    TIMEOUT: 30000,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },
  SEARCH: {
    PARAMS: {
      CURRENT_PAGE_INDEX: 'currentPageIndex',
      PAGE_SIZE: 'pageSize',
      QUERY_PARAMS: 'queryParams'
    } as const,
    DEFAULTS: {
      PAGE_SIZE: 20,
      CURRENT_PAGE_INDEX: 0,
      QUERY_PARAMS: '/'
    }
  },
  DOCUMENT_TYPES: {
    // Core container types
    DOMAIN: 'Domain',
    WORKSPACE: 'Workspace',
    FOLDER: 'Folder',
    
    // Content types
    FILE: 'File',
    NOTE: 'Note',
    
    // Media types
    PICTURE: 'Picture',
    VIDEO: 'Video',
    
    // Collection types
    COLLECTION: 'Collection',
    
    // Workflow types
    TASK: 'Task',
    
    // Business types (discovered from automation API)
    BUSINESS_ADAPTER: 'BusinessAdapter',
    
    // Generic fallback for unknown types
    DOCUMENT: 'Document'
  } as const,
  DOCUMENT_STATES: {
    PROJECT: 'project',
    APPROVED: 'approved',
    OBSOLETE: 'obsolete',
    DELETED: 'deleted'
  } as const,
  ICONS: {
    // Core container icons
    DOMAIN: 'domain',
    WORKSPACE: 'work',
    FOLDER: 'folder',
    
    // Content icons
    FILE: 'description',
    NOTE: 'note',
    
    // Media icons
    PICTURE: 'image',
    VIDEO: 'movie',
    
    // Collection icons
    COLLECTION: 'collections',
    
    // Workflow icons
    TASK: 'assignment',
    
    // Business icons
    BUSINESS_ADAPTER: 'business',
    
    // Generic fallback
    DOCUMENT: 'insert_drive_file',
    DEFAULT: 'insert_drive_file'
  } as const,
  TABLE: {
    COLUMNS: [
      {
        key: 'icon',
        label: '',
        type: 'icon',
        width: '40px',
        sortable: false
      },
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        width: '40%',
        sortable: true
      },
      {
        key: 'modified',
        label: 'Modified',
        type: 'date',
        width: '20%',
        sortable: true
      },
      {
        key: 'lastContributor',
        label: 'Last Contributor',
        type: 'user',
        width: '20%',
        sortable: true
      },
      {
        key: 'actions',
        label: '',
        type: 'actions',
        width: '120px',
        sortable: false,
        align: 'right'
      }
    ] as const
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

export type DocumentEndpoints = typeof DOCUMENT_CONSTANTS.API.ENDPOINTS;
export type DocumentTypes = typeof DOCUMENT_CONSTANTS.DOCUMENT_TYPES;
export type DocumentStates = typeof DOCUMENT_CONSTANTS.DOCUMENT_STATES;
export type DocumentIcons = typeof DOCUMENT_CONSTANTS.ICONS;
export type DocumentOperations = typeof DOCUMENT_CONSTANTS.OPERATIONS;

// Re-export nuxeo constants for convenience
export { 
  NUXEO_OPERATIONS, 
  NUXEO_DOCUMENT_TYPES,
  NUXEO_SCHEMAS,
  NUXEO_FACETS,
  type NuxeoOperation,
  type NuxeoDocumentType,
  type NuxeoSchema,
  type NuxeoFacet
} from './nuxeo.constants';