/**
 * Demonstration of Constants Integration in Document Service
 * 
 * This file showcases how the new auto-generated constants are integrated
 * into the DocumentService to provide type-safe, maintainable operations.
 */

import { DocumentService } from '../src/core/services/document.service';
import { 
  NUXEO_OPERATIONS,
  NUXEO_DOCUMENT_TYPES,
  NUXEO_SCHEMAS,
  NUXEO_FACETS
} from '../src/core/constants/nuxeo.constants';
import { INuxeoDocument } from '../src/core/interfaces/document.interface';

// Example usage of the enhanced DocumentService with new constants
export class ConstantsIntegrationDemo {

  constructor(private documentService: DocumentService) {}

  /**
   * Demo 1: Type-safe document creation using constants
   */
  async createTypedDocuments() {
    console.log('=== Demo 1: Type-safe Document Creation ===');

    try {
      // Create a File document
      const fileDocument = await this.documentService.createDocumentWithType(
        '/default-domain/workspaces/demo',
        NUXEO_DOCUMENT_TYPES.File, // Type-safe constant
        {
          title: 'Demo File Document',
          description: 'Created using type-safe constants',
          filename: 'demo-file.txt'
        }
      );

      console.log('Created File document:', {
        uid: fileDocument.uid,
        type: fileDocument.type,
        title: fileDocument.title
      });

      // Create a Folder document
      const folderDocument = await this.documentService.createDocumentWithType(
        '/default-domain/workspaces/demo',
        NUXEO_DOCUMENT_TYPES.Folder, // Type-safe constant
        {
          title: 'Demo Folder',
          description: 'A folder created with constants'
        }
      );

      console.log('Created Folder document:', {
        uid: folderDocument.uid,
        type: folderDocument.type,
        title: folderDocument.title
      });

    } catch (error) {
      console.error('Document creation failed:', error);
    }
  }

  /**
   * Demo 2: Document capability detection using facets
   */
  async demonstrateCapabilityDetection() {
    console.log('\n=== Demo 2: Document Capability Detection ===');

    // Mock documents for demonstration
    const mockDocuments: INuxeoDocument[] = [
      {
        uid: 'mock-1',
        type: NUXEO_DOCUMENT_TYPES.File,
        title: 'Sample File',
        path: '/default-domain/workspaces/demo/sample-file',
        state: 'project',
        facets: [NUXEO_FACETS.Versionable, NUXEO_FACETS.Downloadable],
        properties: {}
      },
      {
        uid: 'mock-2',
        type: NUXEO_DOCUMENT_TYPES.Folder,
        title: 'Sample Folder',
        path: '/default-domain/workspaces/demo/sample-folder',
        state: 'project',
        facets: [NUXEO_FACETS.Folderish, NUXEO_FACETS.Commentable],
        properties: {}
      },
      {
        uid: 'mock-3',
        type: NUXEO_DOCUMENT_TYPES.Picture,
        title: 'Sample Image',
        path: '/default-domain/workspaces/demo/sample-image',
        state: 'project',
        facets: [NUXEO_FACETS.Publishable, NUXEO_FACETS.Downloadable],
        properties: {}
      }
    ];

    mockDocuments.forEach(doc => {
      const typeInfo = this.documentService.getDocumentTypeInfo(doc);
      
      console.log(`\nDocument: ${doc.title} (${doc.type})`);
      console.log('  Capabilities:', typeInfo.capabilities);
      console.log('  Available Actions:', typeInfo.availableActions);
      console.log('  Applicable Schemas:', typeInfo.schemas);
      console.log('  Is Known Type:', typeInfo.isKnownType);
    });
  }

  /**
   * Demo 3: Advanced search with type and facet filtering
   */
  async demonstrateAdvancedSearch() {
    console.log('\n=== Demo 3: Advanced Search with Type/Facet Filtering ===');

    try {
      // Search for documents of specific types
      console.log('Searching for File and Picture documents...');
      const fileResults = await this.documentService.searchDocumentsByTypeAndFacets(
        'demo',
        [NUXEO_DOCUMENT_TYPES.File, NUXEO_DOCUMENT_TYPES.Picture],
        [NUXEO_FACETS.Downloadable], // Must be downloadable
        [NUXEO_FACETS.HiddenInNavigation] // Must not be hidden
      );

      console.log(`Found ${fileResults.resultsCount} downloadable file/picture documents`);

      // Search for folderish documents
      console.log('\nSearching for folderish documents...');
      const folderResults = await this.documentService.searchDocumentsByTypeAndFacets(
        'workspace',
        [NUXEO_DOCUMENT_TYPES.Folder, NUXEO_DOCUMENT_TYPES.Workspace],
        [NUXEO_FACETS.Folderish]
      );

      console.log(`Found ${folderResults.resultsCount} folderish documents`);

    } catch (error) {
      console.error('Advanced search failed:', error);
    }
  }

  /**
   * Demo 4: Schema-aware metadata operations
   */
  async demonstrateSchemaOperations() {
    console.log('\n=== Demo 4: Schema-aware Metadata Operations ===');

    // Mock document with Dublin Core metadata
    const mockDocument: INuxeoDocument = {
      uid: 'mock-dc',
      type: NUXEO_DOCUMENT_TYPES.File,
      title: 'Document with Metadata',
      path: '/default-domain/workspaces/demo/rich-document',
      state: 'project',
      facets: [NUXEO_FACETS.Versionable],
      properties: {
        [`${NUXEO_SCHEMAS.dublincore}:title`]: 'Rich Document Title',
        [`${NUXEO_SCHEMAS.dublincore}:description`]: 'A comprehensive document description',
        [`${NUXEO_SCHEMAS.dublincore}:creator`]: 'admin',
        [`${NUXEO_SCHEMAS.dublincore}:subjects`]: ['demo', 'constants', 'integration'],
        [`${NUXEO_SCHEMAS.file}:filename`]: 'rich-document.pdf',
        [`${NUXEO_SCHEMAS.file}:content`]: { 
          'mime-type': 'application/pdf',
          'name': 'rich-document.pdf'
        }
      }
    };

    // Extract Dublin Core metadata
    const dublinCore = this.documentService.getDublinCoreMetadata(mockDocument);
    console.log('Dublin Core Metadata:', dublinCore);

    // Extract specific metadata using schema constants
    const filename = this.documentService.getDocumentMetadata(
      mockDocument, 
      NUXEO_SCHEMAS.file, 
      'filename'
    );
    console.log('File name from file schema:', filename);
  }

  /**
   * Demo 5: Constants validation and type safety
   */
  demonstrateTypeSafety() {
    console.log('\n=== Demo 5: Constants Validation and Type Safety ===');

    // Show available constants
    console.log('Available Operations:', Object.keys(NUXEO_OPERATIONS).length);
    console.log('Available Document Types:', Object.keys(NUXEO_DOCUMENT_TYPES).length);
    console.log('Available Schemas:', Object.keys(NUXEO_SCHEMAS).length);
    console.log('Available Facets:', Object.keys(NUXEO_FACETS).length);

    // Example of type-safe constant usage
    console.log('\nExample operations:');
    console.log('  Document Query:', NUXEO_OPERATIONS.Document_Query);
    console.log('  Document Create:', NUXEO_OPERATIONS.Document_Create);
    console.log('  Document Update:', NUXEO_OPERATIONS.Document_Update);

    console.log('\nExample document types:');
    console.log('  File:', NUXEO_DOCUMENT_TYPES.File);
    console.log('  Folder:', NUXEO_DOCUMENT_TYPES.Folder);
    console.log('  Picture:', NUXEO_DOCUMENT_TYPES.Picture);

    console.log('\nExample schemas:');
    console.log('  Dublin Core:', NUXEO_SCHEMAS.dublincore);
    console.log('  File:', NUXEO_SCHEMAS.file);
    console.log('  Common:', NUXEO_SCHEMAS.common);

    console.log('\nExample facets:');
    console.log('  Versionable:', NUXEO_FACETS.Versionable);
    console.log('  Publishable:', NUXEO_FACETS.Publishable);
    console.log('  Folderish:', NUXEO_FACETS.Folderish);
  }

  /**
   * Run all demonstrations
   */
  async runAll() {
    console.log('🚀 Starting Constants Integration Demonstration\n');

    try {
      await this.createTypedDocuments();
      await this.demonstrateCapabilityDetection();
      await this.demonstrateAdvancedSearch();
      await this.demonstrateSchemaOperations();
      this.demonstrateTypeSafety();

      console.log('\n✅ All demonstrations completed successfully!');
      console.log('\nKey Benefits Demonstrated:');
      console.log('  ✓ Type-safe document operations');
      console.log('  ✓ Automated capability detection');
      console.log('  ✓ Schema-aware metadata handling');
      console.log('  ✓ Advanced filtering with constants');
      console.log('  ✓ Comprehensive validation');

    } catch (error) {
      console.error('❌ Demonstration failed:', error);
    }
  }
}

// Usage example:
// const demo = new ConstantsIntegrationDemo(documentService);
// await demo.runAll();