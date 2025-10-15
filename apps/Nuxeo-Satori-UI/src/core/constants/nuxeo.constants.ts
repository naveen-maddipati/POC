/**
 * Nuxeo Document Types and Schema Constants
 * Comprehensive mapping of standard Nuxeo document types and schemas
 */

export const NUXEO_DOCUMENT_TYPES = {
  // Core Document Types
  DOCUMENT: 'Document',
  FOLDER: 'Folder',
  ORDERED_FOLDER: 'OrderedFolder',
  FILE: 'File',
  NOTE: 'Note',
  WORKSPACE: 'Workspace',
  DOMAIN: 'Domain',
  ROOT: 'Root',

  // Advanced Document Types
  PICTURE: 'Picture',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  COLLECTION: 'Collection',
  FAVORITES: 'Favorites',

  // Workflow Related
  ROUTE_NODE: 'RouteNode',
  DOCUMENT_ROUTE: 'DocumentRoute',
  TASK: 'Task',

  // System Types
  USER: 'User',
  GROUP: 'Group',
  VOCABULARY_ENTRY: 'VocabularyEntry'
} as const;

export const NUXEO_SCHEMAS = {
  // Core Schemas
  DUBLIN_CORE: 'dublincore',
  COMMON: 'common',
  FILE: 'file',
  FILES: 'files',
  UID: 'uid',

  // Content Schemas
  PICTURE: 'picture',
  VIDEO: 'video', 
  AUDIO: 'audio',
  NOTE: 'note',

  // Workflow Schemas
  ROUTING: 'routing',
  TASK: 'task',

  // System Schemas
  SYSTEM: 'system',
  SECURITY: 'security',
  PUBLISH: 'publish',
  COLLECTION: 'collection',

  // Custom Schemas (examples)
  METADATA: 'metadata',
  BUSINESS: 'business',
  CUSTOM: 'custom'
} as const;

export const NUXEO_FACETS = {
  FOLDERISH: 'Folderish',
  VERSIONABLE: 'Versionable',
  DOWNLOADABLE: 'Downloadable',
  COMMENTABLE: 'Commentable',
  HAS_RELATED_TEXT: 'HasRelatedText',
  COLLECTION_MEMBER: 'CollectionMember',
  NOT_COLLECTIONISH: 'NotCollectionish',
  PICTURE: 'Picture',
  AUDIO: 'Audio',
  VIDEO: 'Video',
  PUBLISH_SPACE: 'PublishSpace',
  MASTER_PUBLISH_SPACE: 'MasterPublishSpace',
  HIDDEN_IN_NAVIGATION: 'HiddenInNavigation',
  SYSTEM_DOCUMENT: 'SystemDocument'
} as const;

export const NUXEO_STATES = {
  PROJECT: 'project',
  APPROVED: 'approved',
  OBSOLETE: 'obsolete',
  DELETED: 'deleted',
  UNDEFINED: 'undefined'
} as const;

export const NUXEO_PERMISSIONS = {
  // Core Permissions
  READ: 'Read',
  WRITE: 'Write',
  REMOVE: 'Remove',
  BROWSE: 'Browse',
  READ_WRITE: 'ReadWrite',
  EVERYTHING: 'Everything',

  // Extended Permissions
  READ_PROPERTIES: 'ReadProperties',
  WRITE_PROPERTIES: 'WriteProperties',
  READ_CHILDREN: 'ReadChildren',
  ADD_CHILDREN: 'AddChildren',
  REMOVE_CHILDREN: 'RemoveChildren',
  READ_SECURITY: 'ReadSecurity',
  WRITE_SECURITY: 'WriteSecurity',
  READ_VERSION: 'ReadVersion',
  WRITE_VERSION: 'WriteVersion',
  UNLOCK: 'Unlock',

  // Workflow Permissions
  REVIEW_PARTICIPATE: 'ReviewParticipant',
  MANAGE_WORKFLOWS: 'ManageWorkflows',

  // System Permissions
  WRITE_PERMISSION: 'WritePermission',
  READ_PERMISSION: 'ReadPermission'
} as const;

export const NUXEO_OPERATIONS = {
  // Document Operations
  DOCUMENT_CREATE: 'Document.Create',
  DOCUMENT_UPDATE: 'Document.Update',
  DOCUMENT_DELETE: 'Document.Delete',
  DOCUMENT_COPY: 'Document.Copy',
  DOCUMENT_MOVE: 'Document.Move',
  DOCUMENT_GET_CHILDREN: 'Document.GetChildren',
  DOCUMENT_QUERY: 'Document.Query',

  // Blob Operations
  BLOB_ATTACH: 'Blob.AttachOnDocument',
  BLOB_GET: 'Blob.Get',
  BLOB_REMOVE: 'Blob.Remove',

  // Conversion Operations
  BLOB_TO_PDF: 'Blob.ToPDF',
  CONVERT_TO_PDF: 'Convert.ToPDF',

  // User Operations
  USER_CREATE: 'User.Create',
  USER_UPDATE: 'User.Update',
  USER_DELETE: 'User.Delete',
  USER_GET: 'User.Get',

  // Group Operations
  GROUP_CREATE: 'Group.Create',
  GROUP_UPDATE: 'Group.Update', 
  GROUP_DELETE: 'Group.Delete',
  GROUP_GET: 'Group.Get',

  // Workflow Operations
  WORKFLOW_START: 'Workflow.Start',
  WORKFLOW_CANCEL: 'Workflow.Cancel',
  TASK_COMPLETE: 'Task.Complete',
  TASK_DELEGATE: 'Task.Delegate',

  // Directory Operations
  DIRECTORY_READ: 'Directory.Read',
  DIRECTORY_CREATE_ENTRY: 'Directory.CreateEntry',
  DIRECTORY_UPDATE_ENTRY: 'Directory.UpdateEntry',
  DIRECTORY_DELETE_ENTRY: 'Directory.DeleteEntry'
} as const;

export const NUXEO_EVENT_TYPES = {
  DOCUMENT_CREATED: 'documentCreated',
  DOCUMENT_UPDATED: 'documentModified',
  DOCUMENT_REMOVED: 'documentRemoved',
  DOCUMENT_MOVED: 'documentMoved',
  DOCUMENT_COPIED: 'documentDuplicated',
  DOCUMENT_LOCKED: 'documentLocked',
  DOCUMENT_UNLOCKED: 'documentUnlocked',
  DOCUMENT_CHECKEDIN: 'documentCheckedIn',
  DOCUMENT_CHECKEDOUT: 'documentCheckedOut',
  DOCUMENT_PUBLISHED: 'documentPublished',
  LIFECYCLE_TRANSITION_EVENT: 'lifecycle_transition_event',
  WORKFLOW_STARTED: 'workflowStarted',
  WORKFLOW_ENDED: 'workflowEnded',
  TASK_ASSIGNED: 'workflowTaskAssigned',
  TASK_COMPLETED: 'workflowTaskCompleted'
} as const;