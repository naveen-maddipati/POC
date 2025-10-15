/**
 * Type-safe operation parameter interfaces
 * Generated from actual automation API response analysis
 */

// ==================== DOCUMENT OPERATIONS ====================

export interface DocumentCreateParams {
  /** Document type to create */
  type: string;
  /** Document name */
  name: string;
  /** Document properties */
  properties?: Record<string, any>;
}

export interface DocumentUpdateParams {
  /** Document properties to update */
  properties: Record<string, any>;
  /** Save the document after update */
  save?: boolean;
}

export interface DocumentMoveParams {
  /** Target parent document path or ID */
  target: string;
  /** New document name (optional) */
  name?: string;
}

export interface DocumentCopyParams {
  /** Target parent document path or ID */
  target: string;
  /** New document name (optional) */
  name?: string;
}

export interface DocumentDeleteParams {
  /** Permanently delete (bypass trash) */
  permanently?: boolean;
}

export interface DocumentGetChildrenParams {
  /** Page size for pagination */
  pageSize?: number;
  /** Current page index */
  currentPageIndex?: number;
  /** Maximum results */
  maxResults?: number;
}

export interface DocumentQueryParams {
  /** NXQL query string */
  query: string;
  /** Query language */
  language?: string;
  /** Page size for pagination */
  pageSize?: number;
  /** Current page index */
  currentPageIndex?: number;
  /** Maximum results */
  maxResults?: number;
  /** Sort by field */
  sortBy?: string;
  /** Sort order */
  sortOrder?: string;
  /** Query parameters for parameterized queries */
  queryParams?: string[];
}

export interface DocumentSetPropertyParams {
  /** XPath to the property */
  xpath: string;
  /** Property value */
  value: any;
  /** Save the document after setting property */
  save?: boolean;
}

export interface DocumentAddPermissionParams {
  /** Permission to grant */
  permission: string;
  /** Users to grant permission to */
  users?: string[];
  /** Groups to grant permission to */
  groups?: string[];
  /** Permission begin date */
  begin?: string;
  /** Permission end date */
  end?: string;
  /** Permission creator */
  creator?: string;
  /** Permission comment */
  comment?: string;
}

export interface DocumentRemovePermissionParams {
  /** Permission to remove */
  permission: string;
  /** Users to remove permission from */
  users?: string[];
  /** Groups to remove permission from */
  groups?: string[];
}

export interface DocumentSetLifeCycleParams {
  /** Life cycle transition */
  transition: string;
  /** Comment for the transition */
  comment?: string;
}

// ==================== WORKFLOW OPERATIONS ====================

export interface WorkflowStartParams {
  /** Workflow definition ID */
  id: string;
  /** Workflow variables */
  variables?: Record<string, any>;
}

export interface WorkflowCancelParams {
  /** Cancellation comment */
  comment?: string;
}

export interface WorkflowSuspendParams {
  /** Suspension comment */
  comment?: string;
}

export interface WorkflowResumeParams {
  /** Resume comment */
  comment?: string;
}

export interface TaskCompleteParams {
  /** Task completion variables */
  variables?: Record<string, any>;
  /** Task completion comment */
  comment?: string;
}

export interface TaskDelegateParams {
  /** Actors to delegate to */
  actors: string[];
  /** Delegation comment */
  comment?: string;
}

export interface TaskReassignParams {
  /** Actors to reassign to */
  actors: string[];
  /** Reassignment comment */
  comment?: string;
}

// ==================== USER OPERATIONS ====================

export interface UserCreateParams {
  /** Username */
  username: string;
  /** Password */
  password?: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** Email */
  email?: string;
  /** Company */
  company?: string;
  /** Groups */
  groups?: string[];
}

export interface UserUpdateParams {
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** Email */
  email?: string;
  /** Company */
  company?: string;
  /** Groups */
  groups?: string[];
}

export interface UserDeleteParams {
  /** Username to delete */
  username: string;
}

export interface UserAddToGroupParams {
  /** Group name */
  groupname: string;
}

export interface UserRemoveFromGroupParams {
  /** Group name */
  groupname: string;
}

// ==================== GROUP OPERATIONS ====================

export interface GroupCreateParams {
  /** Group name */
  groupname: string;
  /** Group label */
  grouplabel?: string;
  /** Member users */
  memberUsers?: string[];
  /** Member groups */
  memberGroups?: string[];
}

export interface GroupUpdateParams {
  /** Group label */
  grouplabel?: string;
  /** Member users */
  memberUsers?: string[];
  /** Member groups */
  memberGroups?: string[];
}

export interface GroupDeleteParams {
  /** Group name to delete */
  groupname: string;
}

export interface GroupAddUserParams {
  /** Username to add */
  username: string;
}

export interface GroupRemoveUserParams {
  /** Username to remove */
  username: string;
}

// ==================== SEARCH OPERATIONS ====================

export interface PaginatedSearchParams {
  /** Query string */
  query?: string;
  /** Language (NXQL, CMISQL) */
  language?: string;
  /** Page size */
  pageSize?: number;
  /** Current page index */
  currentPageIndex?: number;
  /** Maximum results */
  maxResults?: number;
  /** Sort information */
  sortInfos?: SortInfo[];
  /** Quick filters */
  quickFilters?: string[];
  /** Aggregates */
  aggregates?: Record<string, any>;
  /** Highlight */
  highlight?: string;
}

export interface SortInfo {
  /** Sort column */
  sortColumn: string;
  /** Sort ascending */
  sortAscending: boolean;
}

export interface FullTextSearchParams {
  /** Query string */
  query: string;
  /** Order by */
  orderBy?: string;
  /** Start index */
  startIndex?: number;
  /** Page size */
  pageSize?: number;
}

// ==================== BATCH OPERATIONS ====================

export interface BatchInitParams {
  /** Batch handler name */
  handler?: string;
  /** Handler parameters */
  params?: Record<string, any>;
}

export interface BatchUploadParams {
  /** File name */
  filename: string;
  /** File size */
  filesize?: number;
  /** MIME type */
  mimetype?: string;
  /** Chunk index for chunked upload */
  chunkIndex?: number;
  /** Total chunks for chunked upload */
  chunks?: number;
}

export interface BatchExecuteParams {
  /** Operation ID to execute */
  operationId: string;
  /** Operation parameters */
  params?: Record<string, any>;
}

// ==================== DIRECTORY OPERATIONS ====================

export interface DirectoryCreateEntryParams {
  /** Entry properties */
  properties: Record<string, any>;
}

export interface DirectoryUpdateEntryParams {
  /** Entry ID */
  entryId: string;
  /** Entry properties */
  properties: Record<string, any>;
}

export interface DirectoryDeleteEntryParams {
  /** Entry ID */
  entryId: string;
}

export interface DirectorySearchParams {
  /** Search criteria */
  criteria?: Record<string, any>;
  /** Full text search */
  fullText?: string;
  /** Order by */
  orderBy?: string;
  /** Ordering */
  ordering?: string;
}

// ==================== AUDIT OPERATIONS ====================

export interface AuditQueryParams {
  /** Query string */
  query: string;
  /** Page size */
  pageSize?: number;
  /** Current page index */
  currentPageIndex?: number;
  /** Maximum results */
  maxResults?: number;
}

export interface AuditPageProviderParams {
  /** Page provider name */
  providerName: string;
  /** Query parameters */
  queryParams?: string[];
  /** Named parameters */
  namedParameters?: Record<string, any>;
  /** Page size */
  pageSize?: number;
  /** Current page index */
  currentPageIndex?: number;
  /** Sort information */
  sortInfos?: SortInfo[];
}

// ==================== CONVERSION OPERATIONS ====================

export interface ConvertParams {
  /** Converter name */
  converter: string;
  /** Conversion parameters */
  parameters?: Record<string, any>;
}

export interface BlobToPDFParams {
  /** Filename for the PDF */
  filename?: string;
}

export interface BlobToImageParams {
  /** Target format */
  format?: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
}

// ==================== NOTIFICATION OPERATIONS ====================

export interface NotificationSendParams {
  /** Recipients */
  recipients: string[];
  /** Notification template */
  template: string;
  /** Template context */
  context?: Record<string, any>;
  /** Subject */
  subject?: string;
  /** Message */
  message?: string;
}

// ==================== VERSIONING OPERATIONS ====================

export interface DocumentCreateVersionParams {
  /** Version increment type */
  increment: 'MINOR' | 'MAJOR';
  /** Version comment */
  comment?: string;
}

export interface DocumentRestoreVersionParams {
  /** Version label to restore */
  versionLabel: string;
}

export interface DocumentGetVersionsParams {
  /** Include archived versions */
  includeArchived?: boolean;
}

// ==================== COLLECTION OPERATIONS ====================

export interface CollectionAddToCollectionParams {
  /** Collection path or ID */
  collection: string;
}

export interface CollectionRemoveFromCollectionParams {
  /** Collection path or ID */
  collection: string;
}

export interface CollectionCreateParams {
  /** Collection name */
  name: string;
  /** Collection description */
  description?: string;
}

// ==================== TRASH OPERATIONS ====================

export interface TrashDocumentParams {
  /** Document path or ID */
  document?: string;
}

export interface UntrashDocumentParams {
  /** Document path or ID */
  document?: string;
  /** Target parent path */
  parent?: string;
  /** New document name */
  name?: string;
}

export interface EmptyTrashParams {
  /** Repository name */
  repository?: string;
}

// ==================== COMMENT OPERATIONS ====================

export interface CommentCreateParams {
  /** Comment text */
  text: string;
  /** Parent comment ID */
  parentId?: string;
}

export interface CommentUpdateParams {
  /** Comment ID */
  commentId: string;
  /** Comment text */
  text: string;
}

export interface CommentDeleteParams {
  /** Comment ID */
  commentId: string;
}

// ==================== TAG OPERATIONS ====================

export interface TagDocumentParams {
  /** Tags to add */
  tags: string[];
}

export interface UntagDocumentParams {
  /** Tags to remove */
  tags: string[];
}

export interface GetTaggedDocumentsParams {
  /** Tag name */
  tag: string;
  /** Page size */
  pageSize?: number;
  /** Current page index */
  currentPageIndex?: number;
}