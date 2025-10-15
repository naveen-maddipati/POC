/**
 * Enterprise-grade TypeScript types index
 * Centralized exports for all automation API types
 */

// Core automation API types
export * from './automation-api.types';

// Extended operation parameter types (avoiding duplicates)
export {
  // User operations
  UserCreateParams,
  UserUpdateParams,
  UserDeleteParams,
  UserAddToGroupParams,
  UserRemoveFromGroupParams,
  
  // Group operations
  GroupCreateParams,
  GroupUpdateParams,
  GroupDeleteParams,
  GroupAddUserParams,
  GroupRemoveUserParams,
  
  // Search operations
  PaginatedSearchParams,
  SortInfo,
  FullTextSearchParams,
  
  // Batch operations
  BatchInitParams,
  BatchUploadParams,
  BatchExecuteParams,
  
  // Directory operations
  DirectoryCreateEntryParams,
  DirectoryUpdateEntryParams,
  DirectoryDeleteEntryParams,
  DirectorySearchParams,
  
  // Audit operations
  AuditQueryParams,
  AuditPageProviderParams,
  
  // Conversion operations
  ConvertParams,
  BlobToPDFParams,
  BlobToImageParams,
  
  // Notification operations
  NotificationSendParams,
  
  // Versioning operations
  DocumentCreateVersionParams,
  DocumentRestoreVersionParams,
  DocumentGetVersionsParams,
  
  // Collection operations
  CollectionAddToCollectionParams,
  CollectionRemoveFromCollectionParams,
  CollectionCreateParams,
  
  // Trash operations
  TrashDocumentParams,
  UntrashDocumentParams,
  EmptyTrashParams,
  
  // Comment operations
  CommentCreateParams,
  CommentUpdateParams,
  CommentDeleteParams,
  
  // Tag operations
  TagDocumentParams,
  UntagDocumentParams,
  GetTaggedDocumentsParams,
  
  // Task operations (extended)
  TaskCompleteParams,
  TaskDelegateParams,
  TaskReassignParams,
  
  // Workflow operations (extended)
  WorkflowCancelParams,
  WorkflowSuspendParams,
  WorkflowResumeParams,
  
  // Document operations (extended)
  DocumentGetChildrenParams,
  DocumentRemovePermissionParams,
  DocumentSetLifeCycleParams
} from './operation-params.types';

// Automation analyzer utility
export * from './automation-analyzer';