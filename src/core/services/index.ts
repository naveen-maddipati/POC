/**
 * Core Services Exports
 * Centralized export for all core services
 */

export * from './logging.service';
export * from './nuxeo.service';
export * from './api-discovery.service';
export * from './document.service';
export * from './enterprise-document-api.service';
export * from './user.service';

// Automation Operations Service with explicit exports to avoid conflicts
export { 
  AutomationOperationsService,
  AutomationOperation as AutomationOperationFull,
  AutomationOperationsResponse 
} from './automation-operations.service';

// Document Type Discovery Service with explicit exports
export { 
  DocumentTypeDiscoveryService,
  AutomationOperation as AutomationOperationBasic
} from './document-type-discovery.service';