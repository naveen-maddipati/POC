/**
 * Automation Operation Analyzer - Extracts type information from actual server response
 * Based on your automation API discovery response with 400+ operations
 */

export interface OperationSignature {
  operationId: string;
  inputType: string;
  outputType: string;
  parameters: ParameterSignature[];
  category: string;
  description?: string;
}

export interface ParameterSignature {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  widget?: string;
  values?: string[];
}

export class AutomationAnalyzer {
  private operations: Map<string, OperationSignature> = new Map();

  constructor(automationResponse: any) {
    this.parseAutomationResponse(automationResponse);
  }

  /**
   * Parse the complete automation response and extract operation signatures
   */
  private parseAutomationResponse(response: any): void {
    if (!response?.operations) {
      console.warn('No operations found in automation response');
      return;
    }

    response.operations.forEach((op: any) => {
      const signature = this.extractOperationSignature(op);
      this.operations.set(op.id, signature);
    });

    console.log(`Analyzed ${this.operations.size} automation operations`);
  }

  /**
   * Extract operation signature from individual operation data
   */
  private extractOperationSignature(operation: any): OperationSignature {
    return {
      operationId: operation.id,
      inputType: this.normalizeType(operation.signature?.[0] || 'void'),
      outputType: this.normalizeType(operation.signature?.[1] || 'void'),
      parameters: this.extractParameters(operation.params || []),
      category: operation.category || 'Uncategorized',
      description: operation.description
    };
  }

  /**
   * Extract and normalize parameter signatures
   */
  private extractParameters(params: any[]): ParameterSignature[] {
    return params.map(param => ({
      name: param.name,
      type: this.normalizeParameterType(param.type),
      required: param.required === true,
      description: param.description,
      widget: param.widget,
      values: param.values
    }));
  }

  /**
   * Normalize operation input/output types to TypeScript types
   */
  private normalizeType(type: string): string {
    const typeMap: Record<string, string> = {
      'document': 'NuxeoDocument',
      'documents': 'NuxeoDocument[]',
      'blob': 'Blob',
      'blobs': 'Blob[]',
      'string': 'string',
      'boolean': 'boolean',
      'integer': 'number',
      'long': 'number',
      'double': 'number',
      'date': 'string', // ISO date string
      'void': 'void',
      'object': 'Record<string, any>',
      'stringlist': 'string[]',
      'properties': 'Record<string, any>',
      'serializable': 'any'
    };

    return typeMap[type.toLowerCase()] || 'any';
  }

  /**
   * Normalize parameter types to TypeScript types
   */
  private normalizeParameterType(type: string): string {
    const paramTypeMap: Record<string, string> = {
      'string': 'string',
      'text': 'string',
      'boolean': 'boolean',
      'integer': 'number',
      'long': 'number',
      'double': 'number',
      'date': 'string',
      'datetime': 'string',
      'stringlist': 'string[]',
      'properties': 'Record<string, any>',
      'document': 'string', // Document reference/path
      'user': 'string',
      'group': 'string',
      'directory': 'string',
      'vocabulary': 'string',
      'resource': 'string',
      'template': 'string',
      'serializable': 'any'
    };

    return paramTypeMap[type.toLowerCase()] || 'string';
  }

  /**
   * Get operation signature by ID
   */
  getOperation(operationId: string): OperationSignature | undefined {
    return this.operations.get(operationId);
  }

  /**
   * Get all operations in a category
   */
  getOperationsByCategory(category: string): OperationSignature[] {
    return Array.from(this.operations.values())
      .filter(op => op.category === category);
  }

  /**
   * Get all available categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.operations.forEach(op => categories.add(op.category));
    return Array.from(categories).sort();
  }

  /**
   * Generate TypeScript interface for operation parameters
   */
  generateParameterInterface(operationId: string): string {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return `// Operation ${operationId} not found`;
    }

    const interfaceName = this.toInterfaceName(operationId);
    const params = operation.parameters;

    if (params.length === 0) {
      return `export interface ${interfaceName} {\n  // No parameters\n}`;
    }

    let interfaceCode = `export interface ${interfaceName} {\n`;
    
    params.forEach(param => {
      const optional = param.required ? '' : '?';
      const description = param.description ? `  /** ${param.description} */\n` : '';
      
      interfaceCode += description;
      interfaceCode += `  ${param.name}${optional}: ${param.type};\n`;
    });

    interfaceCode += '}';
    return interfaceCode;
  }

  /**
   * Convert operation ID to interface name
   */
  private toInterfaceName(operationId: string): string {
    return operationId
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Params';
  }

  /**
   * Get operation statistics
   */
  getStatistics(): {
    totalOperations: number;
    categoriesCount: number;
    categoriesBreakdown: Record<string, number>;
    commonParameters: Record<string, number>;
  } {
    const categoriesBreakdown: Record<string, number> = {};
    const commonParameters: Record<string, number> = {};

    this.operations.forEach(op => {
      // Count by category
      categoriesBreakdown[op.category] = (categoriesBreakdown[op.category] || 0) + 1;

      // Count parameter usage
      op.parameters.forEach(param => {
        commonParameters[param.name] = (commonParameters[param.name] || 0) + 1;
      });
    });

    return {
      totalOperations: this.operations.size,
      categoriesCount: Object.keys(categoriesBreakdown).length,
      categoriesBreakdown,
      commonParameters
    };
  }

  /**
   * Export all operations as TypeScript interfaces
   */
  exportAllInterfaces(): string {
    let output = '// Auto-generated TypeScript interfaces from automation operations\n\n';
    
    this.getCategories().forEach(category => {
      output += `// ==================== ${category.toUpperCase()} OPERATIONS ====================\n\n`;
      
      this.getOperationsByCategory(category).forEach(operation => {
        output += this.generateParameterInterface(operation.operationId) + '\n\n';
      });
    });

    return output;
  }

  /**
   * Get operations that work with documents
   */
  getDocumentOperations(): OperationSignature[] {
    return Array.from(this.operations.values())
      .filter(op => 
        op.inputType.includes('Document') || 
        op.outputType.includes('Document') ||
        op.category.includes('Document')
      );
  }

  /**
   * Get workflow-related operations
   */
  getWorkflowOperations(): OperationSignature[] {
    return Array.from(this.operations.values())
      .filter(op => 
        op.category.includes('Workflow') ||
        op.operationId.includes('Workflow') ||
        op.operationId.includes('Task')
      );
  }

  /**
   * Get search and query operations
   */
  getSearchOperations(): OperationSignature[] {
    return Array.from(this.operations.values())
      .filter(op => 
        op.category.includes('Search') ||
        op.operationId.includes('Query') ||
        op.operationId.includes('Search')
      );
  }
}