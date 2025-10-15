/**
 * Core Interface Exports for Enterprise Nuxeo Integration
 * Centralized export for all type definitions
 */

export * from './api-response.interface';
export * from './document.interface';
export { 
  INuxeoConfig,
  INuxeoConnection,
  INuxeoAuth,
  INuxeoTokenObject,
  INuxeoUser,
  INuxeoGroup,
  INuxeoSchema,
  INuxeoBlob,
  INuxeoOperation,
  INuxeoOperationParam,
  INuxeoDirectoryEntry,
  INuxeoWorkflow,
  INuxeoTask,
  INuxeoTaskComment
} from './nuxeo-config.interface';