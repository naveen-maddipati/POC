/**
 * Document Type Discovery Service
 * Dynamically discovers available document types from Nuxeo automation API
 * Making the application future-ready for new document types
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { UserService } from './user.service';
import { DOCUMENT_CONSTANTS } from '../constants/document.constants';

// Note: NUXEO_OPERATIONS and NuxeoOperation are available via:
// import { NUXEO_OPERATIONS, type NuxeoOperation } from '../constants/document.constants';

export interface DocumentTypeInfo {
  name: string;
  category: string;
  icon: string;
  description?: string;
  creatable: boolean;
}

export interface AutomationOperation {
  id: string;
  label: string;
  category: string;
  description: string;
  signature: string[];
  params: Array<{
    name: string;
    type: string;
    required: boolean;
    values?: string[];
  }>;
}

export interface AutomationResponse {
  operations: AutomationOperation[];
  chains: AutomationOperation[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeDiscoveryService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly automationEndpoint = `${this.baseUrl}${DOCUMENT_CONSTANTS.API.ENDPOINTS.AUTOMATION}`;
  
  // Reactive state
  private discoveredTypesSubject = new BehaviorSubject<DocumentTypeInfo[]>([]);
  private isDiscoveringSubject = new BehaviorSubject<boolean>(false);
  private lastDiscoverySubject = new BehaviorSubject<Date | null>(null);
  
  // Public observables
  public readonly discoveredTypes$ = this.discoveredTypesSubject.asObservable();
  public readonly isDiscovering$ = this.isDiscoveringSubject.asObservable();
  public readonly lastDiscovery$ = this.lastDiscoverySubject.asObservable();
  
  // Signals for reactive UI
  public readonly discoveredTypes = signal<DocumentTypeInfo[]>([]);
  public readonly isDiscovering = signal<boolean>(false);
  public readonly lastDiscovery = signal<Date | null>(null);
  
  // Computed properties
  public readonly availableTypes = computed(() => {
    const discovered = this.discoveredTypes();
    const fallback = this.getFallbackTypes();
    return discovered.length > 0 ? discovered : fallback;
  });
  
  public readonly creatableTypes = computed(() => 
    this.availableTypes().filter(type => type.creatable)
  );

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    // Initialize with fallback types
    this.discoveredTypes.set(this.getFallbackTypes());
    
    // Subscribe to observable updates to sync with signals
    this.discoveredTypes$.subscribe(types => this.discoveredTypes.set(types));
    this.isDiscovering$.subscribe(status => this.isDiscovering.set(status));
    this.lastDiscovery$.subscribe(date => this.lastDiscovery.set(date));
  }

  /**
   * Discover document types from Nuxeo automation API
   */
  public discoverDocumentTypes(): Observable<DocumentTypeInfo[]> {
    if (!this.userService.isAuthenticated()) {
      console.warn('Cannot discover document types: User not authenticated');
      return of(this.getFallbackTypes());
    }

    this.isDiscoveringSubject.next(true);

    const headers = this.createHeaders();
    if (!headers) {
      this.isDiscoveringSubject.next(false);
      return of(this.getFallbackTypes());
    }

    return this.http.get<AutomationResponse>(this.automationEndpoint, { headers }).pipe(
      map(response => this.extractDocumentTypes(response)),
      tap(types => {
        this.discoveredTypesSubject.next(types);
        this.lastDiscoverySubject.next(new Date());
        console.log('Document types discovered:', types);
      }),
      catchError(error => {
        console.error('Failed to discover document types:', error);
        const fallback = this.getFallbackTypes();
        this.discoveredTypesSubject.next(fallback);
        return of(fallback);
      }),
      tap(() => this.isDiscoveringSubject.next(false)),
      shareReplay(1)
    );
  }

  /**
   * Get document type info by name
   */
  public getDocumentTypeInfo(typeName: string): DocumentTypeInfo | null {
    return this.availableTypes().find(type => type.name === typeName) || null;
  }

  /**
   * Get icon for document type
   */
  public getIconForType(typeName: string): string {
    const typeInfo = this.getDocumentTypeInfo(typeName);
    return typeInfo?.icon || DOCUMENT_CONSTANTS.ICONS.DEFAULT;
  }

  /**
   * Check if a document type is creatable
   */
  public isTypeCreatable(typeName: string): boolean {
    const typeInfo = this.getDocumentTypeInfo(typeName);
    return typeInfo?.creatable || false;
  }

  /**
   * Force refresh of document types
   */
  public refreshDocumentTypes(): Observable<DocumentTypeInfo[]> {
    return this.discoverDocumentTypes();
  }

  private createHeaders(): HttpHeaders | null {
    const authHeader = this.userService.getBasicAuthHeader();
    if (!authHeader) {
      return null;
    }

    return new HttpHeaders({
      'Content-Type': DOCUMENT_CONSTANTS.API.HEADERS.CONTENT_TYPE,
      'Accept': DOCUMENT_CONSTANTS.API.HEADERS.ACCEPT,
      'Authorization': authHeader
    });
  }

  private extractDocumentTypes(response: AutomationResponse): DocumentTypeInfo[] {
    const types = new Set<string>();
    const typeInfoMap = new Map<string, DocumentTypeInfo>();

    // Extract from Document.Create operation
    const createOperation = response.operations.find(op => op.id === 'Document.Create');
    if (createOperation) {
      const typeParam = createOperation.params.find(p => p.name === 'type');
      if (typeParam?.values) {
        typeParam.values.forEach(type => types.add(type));
      }
    }

    // Extract from Document.Filter operation
    const filterOperation = response.operations.find(op => op.id === 'Document.Filter');
    if (filterOperation) {
      const typesParam = filterOperation.params.find(p => p.name === 'types');
      if (typesParam?.values) {
        typesParam.values.forEach(type => {
          type.split(',').forEach(t => types.add(t.trim()));
        });
      }
    }

    // Extract types mentioned in operation descriptions and categories
    response.operations.forEach(operation => {
      // Look for document types in operation descriptions
      const description = operation.description || '';
      const knownTypes = Object.values(DOCUMENT_CONSTANTS.DOCUMENT_TYPES);
      
      knownTypes.forEach(type => {
        if (description.includes(type) || operation.label.includes(type)) {
          types.add(type);
        }
      });

      // Special handling for media operations
      if (operation.category === 'Conversion' || operation.id.includes('Picture') || operation.id.includes('Video')) {
        if (operation.id.includes('Picture')) types.add('Picture');
        if (operation.id.includes('Video')) types.add('Video');
      }

      // Collection operations
      if (operation.category === 'Document' && operation.id.includes('Collection')) {
        types.add('Collection');
      }

      // Workflow operations
      if (operation.category === 'Workflow Context' || operation.id.includes('Task')) {
        types.add('Task');
      }

      // Business operations
      if (operation.category === 'Business') {
        types.add('BusinessAdapter');
      }
    });

    // Convert to DocumentTypeInfo objects
    Array.from(types).forEach(typeName => {
      if (typeName && typeName.trim()) {
        const info = this.createDocumentTypeInfo(typeName.trim());
        typeInfoMap.set(info.name, info);
      }
    });

    // Ensure we have core types
    const coreTypes = ['Domain', 'Workspace', 'Folder', 'File', 'Note', 'Document'];
    coreTypes.forEach(type => {
      if (!typeInfoMap.has(type)) {
        const info = this.createDocumentTypeInfo(type);
        typeInfoMap.set(info.name, info);
      }
    });

    return Array.from(typeInfoMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  private createDocumentTypeInfo(typeName: string): DocumentTypeInfo {
    const category = this.categorizeDocumentType(typeName);
    const icon = this.getIconForTypeName(typeName);
    const creatable = this.isCreatableType(typeName);

    return {
      name: typeName,
      category,
      icon,
      creatable,
      description: `${typeName} document type`
    };
  }

  private categorizeDocumentType(typeName: string): string {
    const containerTypes = ['Domain', 'Workspace', 'Folder'];
    const mediaTypes = ['Picture', 'Video', 'Audio'];
    const collectionTypes = ['Collection'];
    const workflowTypes = ['Task'];
    const businessTypes = ['BusinessAdapter'];

    if (containerTypes.includes(typeName)) return 'Container';
    if (mediaTypes.includes(typeName)) return 'Media';
    if (collectionTypes.includes(typeName)) return 'Collection';
    if (workflowTypes.includes(typeName)) return 'Workflow';
    if (businessTypes.includes(typeName)) return 'Business';
    
    return 'Content';
  }

  private getIconForTypeName(typeName: string): string {
    // Use constants if available, otherwise generate appropriate icon
    const iconKey = typeName.toUpperCase() as keyof typeof DOCUMENT_CONSTANTS.ICONS;
    if (DOCUMENT_CONSTANTS.ICONS[iconKey]) {
      return DOCUMENT_CONSTANTS.ICONS[iconKey];
    }

    // Generate appropriate icons for unknown types
    switch (this.categorizeDocumentType(typeName)) {
      case 'Container': return 'folder';
      case 'Media': return 'perm_media';
      case 'Collection': return 'collections';
      case 'Workflow': return 'assignment';
      case 'Business': return 'business';
      default: return 'insert_drive_file';
    }
  }

  private isCreatableType(typeName: string): boolean {
    // Core containers and content types are typically creatable
    const creatableTypes = [
      'Workspace', 'Folder', 'File', 'Note', 'Picture', 'Video', 'Collection', 'Document'
    ];
    
    // Domain and Task are usually not directly creatable by users
    const nonCreatableTypes = ['Domain', 'Task', 'BusinessAdapter'];
    
    if (nonCreatableTypes.includes(typeName)) return false;
    if (creatableTypes.includes(typeName)) return true;
    
    // Default to creatable for unknown types
    return true;
  }

  private getFallbackTypes(): DocumentTypeInfo[] {
    return Object.entries(DOCUMENT_CONSTANTS.DOCUMENT_TYPES).map(([, value]) => 
      this.createDocumentTypeInfo(value)
    );
  }
}