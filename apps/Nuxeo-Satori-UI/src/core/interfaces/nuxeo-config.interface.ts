/**
 * Enterprise Nuxeo Configuration Interface
 * Based on official Nuxeo JavaScript Client documentation
 * Supports all authentication methods and client configurations
 */

export interface INuxeoConfig {
  baseURL: string;
  auth: INuxeoAuth;
  timeout?: number;
  httpTimeout?: number;
  transactionTimeout?: number;
  schemas?: string[];
  headers?: { [key: string]: string };
  repositoryName?: string;
}

export interface INuxeoAuth {
  method: 'basic' | 'token' | 'bearerToken' | 'portal';
  username?: string;
  password?: string;
  token?: string | INuxeoTokenObject;
  clientId?: string;
  secret?: string;
}

export interface INuxeoTokenObject {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface INuxeoConnection {
  connected: boolean;
  user?: INuxeoUser;
  serverVersion?: string;
  client?: any; // Nuxeo client instance
}

export interface INuxeoUser {
  'entity-type': string;
  id: string;
  properties: {
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
    groups?: string[];
  };
  extendedGroups?: INuxeoGroup[];
  isAdministrator?: boolean;
  isAnonymous?: boolean;
}

export interface INuxeoGroup {
  'entity-type': string;
  groupname: string;
  grouplabel?: string;
  memberUsers?: string[];
  memberGroups?: string[];
  parentGroups?: string[];
}

// INuxeoDocument is now defined in document.interface.ts for better organization

export interface INuxeoSchema {
  name: string;
  prefix?: string;
}

export interface INuxeoBlob {
  'entity-type': string;
  name: string;
  'mime-type': string;
  encoding?: string;
  digestAlgorithm?: string;
  digest?: string;
  length?: number;
  data?: string;
}

export interface INuxeoOperation {
  id: string;
  label: string;
  category: string;
  requires?: string;
  description?: string;
  since?: string;
  params: INuxeoOperationParam[];
  signature: string[];
}

export interface INuxeoOperationParam {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  widget?: string;
  order?: number;
  values?: string[];
}

export interface INuxeoDirectoryEntry {
  'entity-type': string;
  directoryName: string;
  properties: { [key: string]: any };
}

export interface INuxeoWorkflow {
  'entity-type': string;
  id: string;
  name: string;
  title?: string;
  state: string;
  workflowModelName: string;
  initiator: string;
  attachedDocumentIds?: string[];
  variables?: { [key: string]: any };
}

export interface INuxeoTask {
  'entity-type': string;
  id: string;
  name: string;
  workflowInstanceId: string;
  workflowModelName: string;
  state: string;
  directive?: string;
  created?: string;
  dueDate?: string;
  nodeName?: string;
  targetDocumentIds?: string[];
  actors?: string[];
  delegatedActors?: string[];
  comments?: INuxeoTaskComment[];
  variables?: { [key: string]: any };
}

export interface INuxeoTaskComment {
  author: string;
  text: string;
  creationDate: string;
}