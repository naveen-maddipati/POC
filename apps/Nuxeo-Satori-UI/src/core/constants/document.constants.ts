/**
 * Document Management Constants
 * Enterprise-grade constants for Nuxeo document operations
 * 
 * FUTURE READY APPROACH:
 * - Document types are discovered dynamically from Nuxeo automation API
 * - Constants serve as fallback values when discovery fails
 * - DocumentTypeDiscoveryService provides runtime type detection
 * - Icons are mapped dynamically based on discovered types
 * - Application adapts to new document types without code changes
 * 
 * Updated based on actual Nuxeo server automation response for production readiness
 */

export const DOCUMENT_CONSTANTS = {
  API: {
    ENDPOINTS: {
      SEARCH: '/nuxeo/api/v1/search/pp/domain_documents/execute',
      DOCUMENT_BY_ID: '/nuxeo/api/v1/id',
      DOCUMENT_BY_PATH: '/nuxeo/api/v1/path',
      AUTOMATION: '/nuxeo/api/v1/automation'
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