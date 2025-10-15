import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface AutomationOperation {
  id: string;
  label: string;
  category: string;
  description: string;
  url: string;
  signature: string[];
  params: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    widget?: string;
    order?: number;
    values?: any[];
  }>;
  since: string;
  aliases: string[];
}

export interface AutomationOperationsResponse {
  operations: AutomationOperation[];
  categories: string[];
  totalCount: number;
  types: string[];
  paths: string[];
  endpoints: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AutomationOperationsService {
  private operationsSubject = new BehaviorSubject<AutomationOperationsResponse | null>(null);
  public operations$ = this.operationsSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  public loadAutomationOperations(): Observable<AutomationOperationsResponse | null> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    // Create basic auth headers for Nuxeo server
    const credentials = btoa('Administrator:Administrator');
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    console.log('🔄 Loading automation operations from Nuxeo server...');
    
    return this.http.get<any>('http://localhost:8080/nuxeo/site/automation', { headers }).pipe(
      tap(response => {
        console.log('✅ Successfully loaded automation operations:', response);
        console.log(`📊 Found ${Object.keys(response.operations || {}).length} operations`);
      }),
      map(response => this.parseAutomationResponse(response)),
      catchError(error => {
        console.error('❌ Failed to load automation operations:', error);
        this.errorSubject.next(`Failed to connect to Nuxeo server: ${error.message || 'Connection failed'}`);
        this.loadingSubject.next(false);
        return of(null); // Return null instead of fallback data
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  public fetchAutomationOperations(): Observable<AutomationOperationsResponse | null> {
    return this.loadAutomationOperations();
  }

  private parseAutomationResponse(response: any): AutomationOperationsResponse {
    console.log('🔍 Parsing automation response:', response);
    
    const operations: AutomationOperation[] = [];
    const categories = new Set<string>();
    const types = new Set<string>();
    const paths = new Set<string>();
    const endpoints = new Set<string>();

    if (response.operations) {
      console.log(`📋 Processing operations...`, response.operations);
      
      // Check if operations is an array or an object
      if (Array.isArray(response.operations)) {
        console.log(`📋 Processing ${response.operations.length} operations from array...`);
        
        response.operations.forEach((op: any, index: number) => {
          // Use the operation's own ID field if available, otherwise fall back to index
          const operationId = op.id || op.name || `operation_${index}`;
          const operation = this.parseOperation(operationId, op);
          operations.push(operation);
          categories.add(operation.category);
          operation.signature.forEach(sig => types.add(sig));
          endpoints.add(operation.url);
          
          if (operation.id.includes('.')) {
            const pathParts = operation.id.split('.');
            pathParts.forEach(part => paths.add(part));
          }
        });
      } else {
        console.log(`📋 Processing ${Object.keys(response.operations).length} operations from object...`);
        
        Object.keys(response.operations).forEach(operationId => {
          const op = response.operations[operationId];
          const operation = this.parseOperation(operationId, op);
          operations.push(operation);
          categories.add(operation.category);
          operation.signature.forEach(sig => types.add(sig));
          endpoints.add(operation.url);
          
          if (operation.id.includes('.')) {
            const pathParts = operation.id.split('.');
            pathParts.forEach(part => paths.add(part));
          }
        });
      }
    } else {
      console.warn('⚠️ No operations found in response');
    }

    // Note: Chains are already included in the operations array from the API response
    // No need to parse them separately as they come with category: "Chain"

    const result: AutomationOperationsResponse = {
      operations: operations.sort((a, b) => a.id.localeCompare(b.id)),
      categories: Array.from(categories).sort(),
      totalCount: operations.length,
      types: Array.from(types).sort(),
      paths: Array.from(paths).sort(),
      endpoints: Array.from(endpoints).sort()
    };

    console.log(`✅ Parsed automation data:`, {
      operations: result.totalCount,
      categories: result.categories.length,
      types: result.types.length,
      paths: result.paths.length,
      endpoints: result.endpoints.length
    });

    this.operationsSubject.next(result);
    return result;
  }

  private parseOperation(operationId: string, operationData: any): AutomationOperation {
    // TRULY DATA-DRIVEN: Use the exact API response structure without assumptions
    console.log(`🔍 Raw API data for operation:`, operationData);
    
    // Map API response fields directly - no interpretation, no fallbacks to made-up logic
    const result: AutomationOperation = {
      id: operationData.id || operationId,
      label: operationData.label || operationData.id || operationId,
      category: operationData.category || 'Uncategorized',
      description: operationData.description || '',
      url: operationData.url ? `/nuxeo/api/v1/automation/${operationData.url}` : `/nuxeo/api/v1/automation/${operationData.id || operationId}`,
      signature: Array.isArray(operationData.signature) ? operationData.signature : ['void', 'void'],
      since: operationData.since || 'Unknown',
      aliases: Array.isArray(operationData.aliases) ? operationData.aliases : [],
      params: Array.isArray(operationData.params) ? operationData.params.map((param: any) => ({
        name: param.name || '',
        type: param.type || 'string',
        required: Boolean(param.required),
        description: param.description || '',
        widget: param.widget,
        order: param.order,
        values: param.values || []
      })) : []
    };
    
    console.log(`✅ Mapped to our interface:`, result);
    return result;
  }

  getCurrentOperations(): AutomationOperationsResponse | null {
    return this.operationsSubject.value;
  }

  filterOperations(searchTerm = '', category = ''): AutomationOperation[] {
    const current = this.getCurrentOperations();
    if (!current) return [];
    
    let filtered = current.operations;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(op =>
        op.id.toLowerCase().includes(term) ||
        op.label.toLowerCase().includes(term) ||
        op.description.toLowerCase().includes(term) ||
        op.category.toLowerCase().includes(term)
      );
    }
    
    if (category) {
      filtered = filtered.filter(op => op.category === category);
    }
    
    return filtered;
  }

  getCategories(): string[] {
    const current = this.getCurrentOperations();
    if (!current) return [];
    return current.categories;
  }

  getCategoryCount(category: string): number {
    const current = this.getCurrentOperations();
    if (!current) return 0;
    return current.operations.filter(op => op.category === category).length;
  }
}
