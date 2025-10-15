/**
 * Enterprise-grade TypeScript types for Nuxeo Automation API
 * Based on actual server response from your automation/operations discovery
 * Generated from POC automation API analysis - Version 1.0
 */

// ==================== CORE API TYPES ====================

export interface AutomationOperation {
  id: string;
  label: string;
  category: string;
  requires?: string;
  description?: string;
  url: string;
  signature: string[];
  params: AutomationParameter[];
  since?: string;
}

export interface AutomationParameter {
  name: string;
  description?: string;
  type: string;
  required: boolean;
  widget?: string;
  order: number;
  values?: string[];
}

export interface AutomationResponse<T = any> {
  'entity-type': string;
  value?: T;
  entries?: T[];
  totalSize?: number;
  pageIndex?: number;
  pageSize?: number;
  maxPageSize?: number;
  resultsCount?: number;
  hasError?: boolean;
  errorMessage?: string;
}

// ==================== DOCUMENT TYPES ====================

export interface NuxeoDocument {
  'entity-type': 'document';
  repository: string;
  uid: string;
  path: string;
  type: DocumentType;
  state: DocumentState;
  parentRef?: string;
  isCheckedOut: boolean;
  isVersion: boolean;
  isProxy: boolean;
  isTrashed: boolean;
  versionLabel?: string;
  title: string;
  lastModified: string;
  properties: DocumentProperties;
  contextParameters?: Record<string, any>;
  facets: string[];
  schemas: DocumentSchema[];
}

export type DocumentType = 
  | 'Domain'
  | 'Workspace' 
  | 'Folder'
  | 'File'
  | 'Note'
  | 'Picture'
  | 'Video'
  | 'Audio'
  | 'Task'
  | 'TaskDoc'
  | 'RoutingTask'
  | 'HiddenFolder'
  | 'OrderedFolder'
  | 'Collection'
  | 'Favorites'
  | 'SectionRoot'
  | 'Section'
  | 'TemplateRoot'
  | 'TemplateSource'
  | 'WorkspaceRoot'
  | 'UserWorkspacesRoot';

export type DocumentState = 
  | 'project'
  | 'approved'
  | 'obsolete'
  | 'deleted'
  | 'running'
  | 'suspended'
  | 'canceled'
  | 'completed';

export interface DocumentProperties {
  'dc:title'?: string;
  'dc:description'?: string;
  'dc:creator'?: string;
  'dc:created'?: string;
  'dc:modified'?: string;
  'dc:lastContributor'?: string;
  'dc:contributors'?: string[];
  'dc:subjects'?: string[];
  'file:content'?: FileContent;
  'common:icon'?: string;
  'common:size'?: number;
  'picture:info'?: PictureInfo;
  'video:info'?: VideoInfo;
  'note:note'?: string;
  'note:mime_type'?: string;
  'task:name'?: string;
  'task:type'?: string;
  'task:status'?: string;
  'task:directive'?: string;
  'task:variables'?: Record<string, any>;
  [key: string]: any;
}

export interface FileContent {
  'mime-type': string;
  encoding?: string;
  digest?: string;
  length: number;
  name: string;
  data?: string;
  'upload-batch'?: string;
  'upload-fileId'?: string;
}

export interface PictureInfo {
  width?: number;
  height?: number;
  format?: string;
  colorSpace?: string;
  depth?: number;
}

export interface VideoInfo {
  duration?: number;
  width?: number;
  height?: number;
  format?: string;
  streams?: VideoStream[];
}

export interface VideoStream {
  codec?: string;
  type?: string;
  bitRate?: number;
  streamInfo?: string;
}

export type DocumentSchema = 
  | 'common'
  | 'dublincore' 
  | 'file'
  | 'note'
  | 'picture'
  | 'video'
  | 'task'
  | 'routing_task'
  | 'collection'
  | 'favorites'
  | 'hidden_folder'
  | 'ordered_folder';

// ==================== OPERATION-SPECIFIC TYPES ====================

// Document.Create operation
export interface DocumentCreateParams {
  type: DocumentType;
  name: string;
  properties?: Partial<DocumentProperties>;
}

// Document.Update operation  
export interface DocumentUpdateParams {
  properties: Partial<DocumentProperties>;
  save?: boolean;
}

// Document.Move operation
export interface DocumentMoveParams {
  target: string;
  name?: string;
}

// Document.Copy operation
export interface DocumentCopyParams {
  target: string;
  name?: string;
}

// Document.Delete operation (soft delete to trash)
export interface DocumentDeleteParams {
  permanently?: boolean;
}

// Document.SetProperty operation
export interface DocumentSetPropertyParams {
  xpath: string;
  value: any;
  save?: boolean;
}

// Document.AddPermission operation
export interface DocumentAddPermissionParams {
  permission: Permission;
  users?: string[];
  groups?: string[];
  begin?: string;
  end?: string;
  creator?: string;
  comment?: string;
}

export type Permission = 
  | 'Read'
  | 'ReadWrite' 
  | 'ReadRemove'
  | 'Version'
  | 'Browse'
  | 'WriteProperties'
  | 'AddChildren'
  | 'RemoveChildren'
  | 'Remove'
  | 'Everything';

// Document.Query operation (NXQL)
export interface DocumentQueryParams {
  query: string;
  language?: 'NXQL' | 'CMISQL';
  currentPageIndex?: number;
  pageSize?: number;
  maxResults?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  queryParams?: string[];
}

// Workflow operations
export interface WorkflowStartParams {
  id: string;
  variables?: Record<string, any>;
}

export interface WorkflowTaskCompleteParams {
  variables?: Record<string, any>;
  comment?: string;
}

export interface WorkflowModel {
  'entity-type': 'workflowModel';
  id: string;
  name: string;
  title: string;
  description?: string;
  graphResource?: string;
  variables?: WorkflowVariable[];
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'boolean' | 'date' | 'integer' | 'double' | 'directory';
  required?: boolean;
  defaultValue?: any;
}

export interface WorkflowInstance {
  'entity-type': 'workflow';
  id: string;
  title: string;
  name: string;
  state: 'running' | 'suspended' | 'canceled' | 'completed';
  workflowModelName: string;
  initiator: string;
  attachedDocumentIds: string[];
  variables: Record<string, any>;
  graphResource?: string;
}

export interface TaskInstance {
  'entity-type': 'task';
  id: string;
  name: string;
  type: string;
  state: 'opened' | 'ended' | 'cancelled';
  workflowInstanceId: string;
  workflowModelName: string;
  actors: string[];
  targetDocumentIds: string[];
  variables: Record<string, any>;
  taskInfo: TaskInfo;
  directive?: string;
  comments?: TaskComment[];
  created: string;
  dueDate?: string;
}

export interface TaskInfo {
  allowTaskReassignment?: boolean;
  taskAssignees?: string[];
  createOneTaskPerActor?: boolean;
  hasTask?: boolean;
}

export interface TaskComment {
  author: string;
  text: string;
  creationDate: string;
}

// ==================== SEARCH & QUERY TYPES ====================

export interface SearchParams {
  fullText?: string;
  title?: string;
  path?: string;
  type?: DocumentType | DocumentType[];
  tag?: string | string[];
  pageSize?: number;
  currentPageIndex?: number;
  maxResults?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  'entity-type': 'documents';
  isPaginable: boolean;
  resultsCount: number;
  pageSize: number;
  maxPageSize: number;
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
  entries: NuxeoDocument[];
}

// ==================== USER & DIRECTORY TYPES ====================

export interface NuxeoUser {
  'entity-type': 'user';
  id: string;
  isAdministrator: boolean;
  isAnonymous: boolean;
  properties: UserProperties;
  extendedGroups?: GroupExtended[];
  contextParameters?: Record<string, any>;
}

export interface UserProperties {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  password?: string;
  groups?: string[];
  tenantId?: string;
}

export interface GroupExtended {
  name: string;
  label: string;
  url: string;
}

export interface NuxeoGroup {
  'entity-type': 'group';
  groupname: string;
  grouplabel?: string;
  memberUsers?: string[];
  memberGroups?: string[];
  parentGroups?: string[];
}

// ==================== BATCH UPLOAD TYPES ====================

export interface BatchUpload {
  'entity-type': 'batchUpload';
  batchId: string;
  fileEntries: BatchFileEntry[];
}

export interface BatchFileEntry {
  name: string;
  size: number;
  uploadType: 'normal' | 'chunked';
  uploadedSize?: number;
  chunkCount?: number;
  uploadedChunkIds?: number[];
  batchId: string;
  fileIdx: number;
}

// ==================== AUDIT & LOGGING TYPES ====================

export interface AuditEntry {
  'entity-type': 'logEntry';
  id: number;
  category: string;
  principalName: string;
  comment?: string;
  docLifeCycle?: string;
  docPath: string;
  docType: string;
  docUUID: string;
  eventId: string;
  repositoryId: string;
  eventDate: string;
  logDate: string;
  extended?: Record<string, any>;
}

// ==================== ERROR HANDLING TYPES ====================

export interface NuxeoError {
  'entity-type': 'exception';
  status: number;
  type: string;
  message: string;
  stack?: string;
}

export interface ValidationError extends NuxeoError {
  type: 'validation';
  violations: ValidationViolation[];
}

export interface ValidationViolation {
  path: string;
  constraint: string;
  message: string;
  invalidValue?: any;
}

// ==================== UTILITY TYPES ====================

export type EntityType = 
  | 'document'
  | 'documents' 
  | 'user'
  | 'users'
  | 'group'
  | 'groups'
  | 'workflow'
  | 'workflows'
  | 'task'
  | 'tasks'
  | 'logEntry'
  | 'logEntries'
  | 'exception'
  | 'validation'
  | 'batchUpload'
  | 'workflowModel';

export interface PaginationInfo {
  isPaginable: boolean;
  totalSize: number;
  pageIndex: number;
  pageSize: number;
  maxPageSize: number;
  numberOfPages: number;
  isPreviousPageAvailable: boolean;
  isNextPageAvailable: boolean;
  isLastPageAvailable: boolean;
}

// ==================== API CLIENT CONFIGURATION ====================

export interface NuxeoClientConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  apiPath?: string;
  timeout?: number;
  schemas?: string[];
  enrichers?: Record<string, string[]>;
  fetchProperties?: Record<string, string[]>;
  headers?: Record<string, string>;
  transactionTimeout?: number;
  repository?: string;
}

export interface RequestOptions {
  schemas?: string[];
  enrichers?: Record<string, string[]>;
  fetchProperties?: Record<string, string[]>;
  headers?: Record<string, string>;
  timeout?: number;
  transactionTimeout?: number;
}