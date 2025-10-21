# Nuxeo Constants Generation & Integration Guide

## Overview

This document describes the comprehensive constants generation system that automatically creates type-safe TypeScript constants from a live Nuxeo server. The system now includes **all major Nuxeo configuration types**: operations, document types, schemas, and facets for complete development coverage.

## 🚀 Quick Start

### Generate Constants
```bash
# Development environment
NODE_ENV=development npm run constants:generate

# Production environment  
NODE_ENV=production npm run constants:generate

# Use specific Nuxeo server
NUXEO_URL=http://your-server:8080/nuxeo npm run constants:generate
```

### Use in Your Code
```typescript
import { 
  NUXEO_OPERATIONS, 
  NUXEO_DOCUMENT_TYPES, 
  NUXEO_SCHEMAS, 
  NUXEO_FACETS 
} from '../constants/nuxeo.constants';

// Type-safe operation calls
const result = await this.executeOperation(NUXEO_OPERATIONS.Document_Create, params);

// Type-safe document type checks
if (document.type === NUXEO_DOCUMENT_TYPES.File) {
  // Handle file-specific logic
}

// Type-safe schema and facet usage
const metadata = document[NUXEO_SCHEMAS.dublincore];
const hasVersioning = document.facets.includes(NUXEO_FACETS.Versionable);
```

## 📁 File Structure

```
src/core/constants/
├── nuxeo.constants.ts          # 🤖 Auto-generated (558+ constants)
│   ├── NUXEO_OPERATIONS        # 357 automation operations  
│   ├── NUXEO_DOCUMENT_TYPES    # 50 content types
│   ├── NUXEO_SCHEMAS           # 86 metadata schemas
│   ├── NUXEO_FACETS            # 64 document behaviors
│   ├── NUXEO_OPERATION_CATEGORIES # 17 operation categories
│   └── NUXEO_OPERATION_ALIASES # 84 operation aliases
├── document.constants.ts       # 📝 Manual configuration + integration
└── index.ts                    # 📦 Barrel exports (optional)

scripts/
├── generate-constants.js       # 🔧 Main generation script
├── lib/nuxeo-client.js         # 🌐 HTTP client for Nuxeo API
└── generation.config.js        # ⚙️ Configuration settings
```

### `nuxeo.constants.ts` (🤖 Auto-generated)
- **558+ total constants** from live Nuxeo server
- **357 automation operations** with developer-friendly property names
- **50 document types** (File, Folder, Note, Collection, etc.)
- **86 schemas** with metadata field definitions and prefixes
- **64 facets** defining document behaviors and capabilities  
- **17 operation categories** for better organization
- **84 operation aliases** for backward compatibility
- **Environment-aware generation** (development/staging/production)
- **Auto-updated** when you run `npm run constants:generate`
- **Type-safe** with comprehensive TypeScript definitions

**Example Content:**
```typescript
export const NUXEO_OPERATIONS = {
  Document_Create: 'Document.Create',
  Document_Update: 'Document.Update',
  BlobHolder_AttachOnCurrentDocument: 'BlobHolder.AttachOnCurrentDocument',
  PDF_ExtractText: 'PDF.ExtractText',
  Workflow_GetOpenTasks: 'Workflow.GetOpenTasks',
  // ... 352 more operations
} as const;

export const NUXEO_DOCUMENT_TYPES = {
  File: 'File',
  Folder: 'Folder', 
  Note: 'Note',
  Collection: 'Collection',
  Picture: 'Picture',
  Video: 'Video',
  // ... 44 more document types
} as const;

export const NUXEO_SCHEMAS = {
  dublincore: 'dublincore',
  file: 'file',
  common: 'common',
  picture: 'picture',
  video: 'video',
  // ... 81 more schemas
} as const;

export const NUXEO_FACETS = {
  Versionable: 'Versionable',
  Folderish: 'Folderish',
  Commentable: 'Commentable',
  Publishable: 'Publishable',
  Collection: 'Collection',
  // ... 59 more facets
} as const;
```

### `document.constants.ts` (📝 Manual configuration + Integration)
- **API configuration** (endpoints, headers, timeouts)
- **UI configuration** (table columns, icons, document types)
- **Business logic constants** (search parameters, retry settings)
- **Integration layer** that references nuxeo.constants.ts
- **Convenient aliases** for common operations

**Example Content:**
```typescript
import { NUXEO_OPERATIONS, NUXEO_DOCUMENT_TYPES, NUXEO_FACETS } from './nuxeo.constants';

export const DOCUMENT_CONSTANTS = {
  OPERATIONS: {
    // Convenient aliases for common operations
    CREATE: NUXEO_OPERATIONS.Document_Create,
    UPDATE: NUXEO_OPERATIONS.Document_Update,
    DELETE: NUXEO_OPERATIONS.Document_Delete,
    ATTACH_BLOB: NUXEO_OPERATIONS.BlobHolder_AttachOnCurrentDocument,
    // Access to all operations
    ALL: NUXEO_OPERATIONS
  },
  TYPES: {
    // Common document types
    FILE: NUXEO_DOCUMENT_TYPES.File,
    FOLDER: NUXEO_DOCUMENT_TYPES.Folder,
    NOTE: NUXEO_DOCUMENT_TYPES.Note,
    // Access to all types
    ALL: NUXEO_DOCUMENT_TYPES
  },
  FACETS: {
    // Common facets
    VERSIONABLE: NUXEO_FACETS.Versionable,
    FOLDERISH: NUXEO_FACETS.Folderish,
    COMMENTABLE: NUXEO_FACETS.Commentable,
    // Access to all facets
    ALL: NUXEO_FACETS
  },
  API: {
    ENDPOINTS: {
      AUTOMATION: '/nuxeo/site/automation',
      SEARCH: '/nuxeo/api/v1/search/pp/domain_documents/execute',
      CONFIG_TYPES: '/nuxeo/api/v1/config/types',
      CONFIG_SCHEMAS: '/nuxeo/api/v1/config/schemas',
      CONFIG_FACETS: '/nuxeo/api/v1/config/facets'
    },
    TIMEOUTS: {
      DEFAULT: 30000,
      UPLOAD: 120000,
      DOWNLOAD: 60000
    }
  }
} as const;
```

## 🔧 Generation System

### Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Nuxeo Server  │───▶│  Generation      │───▶│  TypeScript     │
│   (Live API)    │    │  Script          │    │  Constants      │
│                 │    │                  │    │                 │
│ 357 Operations  │    │ • HTTP Client    │    │ • Type Safety   │
│ 50 Doc Types    │    │ • Auth Handler   │    │ • IntelliSense  │
│ 86 Schemas      │    │ • Parsing Logic  │    │ • Auto-complete │
│ 64 Facets       │    │ • Error Handling │    │ • 558+ Constants│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Supported Endpoints
The system fetches data from multiple Nuxeo API endpoints:

| Endpoint | Purpose | Constants Generated |
|----------|---------|-------------------|
| `/site/automation` | Automation operations | `NUXEO_OPERATIONS` (357) |
| `/api/v1/config/types` | Document types | `NUXEO_DOCUMENT_TYPES` (50) |
| `/api/v1/config/schemas` | Metadata schemas | `NUXEO_SCHEMAS` (86) |
| `/api/v1/config/facets` | Document facets | `NUXEO_FACETS` (64) |

### Environment Configuration
```javascript
// scripts/generation.config.js
environments: {
  development: {
    server: { baseUrl: 'http://localhost:8080/nuxeo' }
  },
  staging: {
    server: { baseUrl: process.env.NUXEO_STAGING_URL }
  },
  production: {
    server: { baseUrl: process.env.NUXEO_PROD_URL }
  }
}
```

### Features
- **🔐 Authentication**: HTTP Basic Auth with retry logic
- **🔄 Error Handling**: Graceful fallback to existing constants
- **📊 Statistics**: Detailed generation reports
- **🏷️ Duplicate Resolution**: Smart handling of duplicate names
- **🔗 Alias Processing**: Support for operation aliases
- **🎯 Category Organization**: Operations grouped by functionality
- **📝 Documentation**: Auto-generated JSDoc comments

## 💡 Usage Examples

### Option 1: Direct Constants (Recommended)
```typescript
import { 
  NUXEO_OPERATIONS, 
  NUXEO_DOCUMENT_TYPES,
  NUXEO_FACETS 
} from '../constants/nuxeo.constants';

class DocumentService {
  // Document operations
  async createDocument(type: string, properties: any) {
    return this.executeOperation(NUXEO_OPERATIONS.Document_Create, {
      input: this.currentFolder,
      params: { type, properties }
    });
  }

  // Type checking
  isFolder(document: any): boolean {
    return document.type === NUXEO_DOCUMENT_TYPES.Folder ||
           document.facets.includes(NUXEO_FACETS.Folderish);
  }

  // File operations
  async attachFile(file: Blob, document: string) {
    return this.executeOperation(NUXEO_OPERATIONS.BlobHolder_AttachOnCurrentDocument, {
      input: file,
      context: { currentDocument: document }
    });
  }

  // Advanced operations
  async extractPdfText(pdfBlob: Blob) {
    return this.executeOperation(NUXEO_OPERATIONS.PDF_ExtractText, {
      input: pdfBlob,
      params: { xpath: 'file:content' }
    });
  }
}
```

### Option 2: Integrated Approach (Best of Both Worlds)
```typescript
import { DOCUMENT_CONSTANTS, NUXEO_OPERATIONS } from '../constants/document.constants';

class DocumentService {
  // Common operations via aliases
  async createDocument(params: DocumentCreateParams) {
    return this.executeOperation(DOCUMENT_CONSTANTS.OPERATIONS.CREATE, params);
  }

  // Specialized operations via auto-generated constants
  async extractPdfText(pdfBlob: Blob) {
    return this.executeOperation(NUXEO_OPERATIONS.PDF_ExtractText, {
      input: pdfBlob,
      params: { xpath: 'file:content' }
    });
  }

  // Document type validation
  validateDocumentType(type: string): boolean {
    return Object.values(DOCUMENT_CONSTANTS.TYPES.ALL).includes(type);
  }

  // Facet checking
  hasVersioning(document: any): boolean {
    return document.facets?.includes(DOCUMENT_CONSTANTS.FACETS.VERSIONABLE);
  }
}
```

### Option 3: Schema-Based Operations
```typescript
import { NUXEO_SCHEMAS, NUXEO_OPERATIONS } from '../constants/nuxeo.constants';

class MetadataService {
  // Schema-aware property updates
  async updateDublinCore(document: any, metadata: any) {
    const dcFields = this.validateSchemaFields(NUXEO_SCHEMAS.dublincore, metadata);
    
    return this.executeOperation(NUXEO_OPERATIONS.Document_Update, {
      input: document,
      params: { properties: dcFields }
    });
  }

  // File schema operations
  async updateFileMetadata(document: any, fileInfo: any) {
    return this.executeOperation(NUXEO_OPERATIONS.Document_Update, {
      input: document,
      params: {
        properties: {
          [`${NUXEO_SCHEMAS.file}:filename`]: fileInfo.name,
          [`${NUXEO_SCHEMAS.file}:content`]: fileInfo.blob
        }
      }
    });
  }
}
```

## ✨ Benefits

### 🎯 **Type Safety & Developer Experience**
- **558+ constants** all type-checked at compile time
- **IntelliSense support** for operations, types, schemas, and facets
- **Auto-completion** for all available Nuxeo configurations
- **Compile-time errors** for invalid IDs
- **JSDoc documentation** for each constant

### 🚀 **Performance & Reliability**
- **Zero runtime overhead** - constants are compile-time only
- **Server validation** - all constants verified against live server
- **Fallback mechanism** - graceful degradation when server unavailable
- **Caching support** - reduces server requests during development

### 🔄 **Automatic Synchronization**
- **Live server integration** - always up-to-date with your Nuxeo instance
- **Environment-aware** - different constants for dev/staging/prod
- **New types automatically available** - no manual updates needed
- **Breaking changes detected** - removed types cause compile errors

### 📦 **Complete Coverage**
- **All operation types** - document, blob, workflow, user management
- **All document types** - from File to custom content types
- **All schemas** - metadata structure definitions with prefixes
- **All facets** - document behaviors and capabilities

## 📊 Available Constants by Category

### **Operations (357 constants)**

| Category | Count | Examples |
|----------|--------|----------|
| **Document** | 82 | `Document_Create`, `Document_Update`, `Document_Delete` |
| **Services** | 68 | `Services_TagDocument`, `Services_CreateUser` |
| **Files** | 32 | `Blob_Convert`, `Blob_ToPDF`, `BlobHolder_AttachOnCurrentDocument` |
| **Chain** | 29 | Custom workflow chains and business operations |
| **Conversion** | 25 | `PDF_ExtractText`, `Picture_Resize`, `Video_Slice` |
| **Push & Pop** | 24 | Context stack operations for workflow management |
| **Fetch** | 17 | `Repository_Query`, `Document_PageProvider` |
| **Users & Groups** | 16 | `User_CreateOrUpdate`, `Auth_LoginAs` |
| **Workflow Context** | 17 | `Context_StartWorkflow`, `WorkflowTask_Complete` |
| **Execution Context** | 15 | `Context_SetVar`, `Context_RunScript` |
| **Execution Flow** | 13 | `RunOperation`, `RunDocumentOperation` |
| **Notification** | 6 | `Document_Mail`, `Event_Fire` |
| **Scripting** | 4 | `RunScript`, `RunInputScript` |
| **Business** | 3 | Business adapter operations |
| **Local Configuration** | 3 | Configuration management |
| **Routing** | 2 | Document routing operations |
| **User Interface** | 1 | UI-related operations |

### **Document Types (50 constants)**
```typescript
File, Folder, Note, Collection, Picture, Video, Audio, 
Workspace, Domain, Section, TemplateRoot, OrderedFolder,
HiddenFolder, DocumentRoute, RouteNode, ConditionalRouteNode,
ParallelRouteNode, SerialRouteNode, StepRouteNode, etc.
```

### **Schemas (86 constants)**
```typescript
dublincore, file, common, picture, video, audio, note,
collection, routing, workflow, task, comment, annotation,
publishing, versioning, security, audit, system, etc.
```

### **Facets (64 constants)**
```typescript
Versionable, Folderish, Commentable, Publishable, Collection,
SystemDocument, HiddenInNavigation, HiddenInCreation,
NXTag, Downloadable, Audio, Picture, Video, BigFolder, etc.
```

## 🛠️ Configuration & Setup

### Initial Setup
1. **Ensure Nuxeo server is running** at `http://localhost:8080/nuxeo`
2. **Configure authentication** in `scripts/generation.config.js`
3. **Run generation** with `npm run constants:generate`

### Environment Variables
```bash
# Override default server URL
export NUXEO_URL=http://your-server:8080/nuxeo

# Set environment (development/staging/production)
export NODE_ENV=production

# Custom authentication
export NUXEO_USERNAME=admin
export NUXEO_PASSWORD=admin
```

### Package Scripts Integration
```json
{
  "scripts": {
    "constants:generate": "node scripts/generate-constants.js",
    "build:fresh": "npm run constants:generate && npm run build",
    "start:fresh": "npm run constants:generate && npm start",
    "dev:fresh": "npm run constants:generate && npm run dev"
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Server Connection Failed
```
❌ Server connection failed: HTTP 404
```
**Solution**: Check if Nuxeo server is running and accessible:
```bash
curl -u Administrator:Administrator http://localhost:8080/nuxeo/site/automation
```

#### 2. Authentication Failed
```
❌ Request failed: HTTP 401: Unauthorized
```
**Solution**: Verify credentials in `generation.config.js` or environment variables.

#### 3. Missing Constants
```
⚠️ Retrieved 0 document types/schemas/facets
```
**Solution**: Check if the configuration endpoints are enabled in Nuxeo server.

#### 4. TypeScript Compilation Errors
```
Type 'string' is not assignable to type 'NuxeoOperation'
```
**Solution**: Use constants instead of string literals:
```typescript
// ❌ Wrong
const op = 'Document.Create';

// ✅ Correct  
const op = NUXEO_OPERATIONS.Document_Create;
```

### Regenerating Constants

Update constants from your Nuxeo server:

```bash
# Development environment (default)
npm run constants:generate

# Specific environment
NODE_ENV=development npm run constants:generate
NODE_ENV=staging npm run constants:generate  
NODE_ENV=production npm run constants:generate

# With custom server URL
NUXEO_URL=http://your-server:8080/nuxeo npm run constants:generate
```

### Generation Output
```
🚀 Starting Nuxeo constants generation...
✅ Server connection successful (redirected)
🔑 Using basic authentication...
📡 Fetching all data from Nuxeo server...
📦 Retrieved 273 operations
📄 Retrieved 50 document types
📋 Retrieved 86 schemas
🏷️ Retrieved 64 facets
🔧 Processing all data and handling duplicates...
✅ Processed 357 total constants
📝 Generating TypeScript constants file...
📁 Constants file generated: ./src/core/constants/nuxeo.constants.ts
📊 Generated 558+ constants
✅ Constants generation completed successfully!
```

## 📈 Best Practices

### 1. Use Type-Safe Constants
```typescript
// ✅ Good - Type-safe
async createDocument(params: DocumentCreateParams): Promise<NuxeoDocument> {
  return this.executeOperation(NUXEO_OPERATIONS.Document_Create, params);
}

// ❌ Avoid - Not type-safe  
async createDocument(params: any): Promise<any> {
  return this.executeOperation('Document.Create', params);
}
```

### 2. Leverage Document Type Checking
```typescript
// ✅ Type-safe document handling
processDocument(document: any) {
  switch (document.type) {
    case NUXEO_DOCUMENT_TYPES.File:
      return this.handleFile(document);
    case NUXEO_DOCUMENT_TYPES.Folder:
      return this.handleFolder(document);
    case NUXEO_DOCUMENT_TYPES.Picture:
      return this.handlePicture(document);
    default:
      return this.handleGenericDocument(document);
  }
}
```

### 3. Use Schema-Aware Operations
```typescript
// ✅ Schema-aware metadata handling
updateMetadata(document: any, metadata: any) {
  const properties = {
    [`${NUXEO_SCHEMAS.dublincore}:title`]: metadata.title,
    [`${NUXEO_SCHEMAS.dublincore}:description`]: metadata.description,
    [`${NUXEO_SCHEMAS.file}:filename`]: metadata.filename
  };
  
  return this.executeOperation(NUXEO_OPERATIONS.Document_Update, {
    input: document,
    params: { properties }
  });
}
```

### 4. Handle Facets Intelligently
```typescript
// ✅ Facet-based feature detection
getAvailableActions(document: any): string[] {
  const actions = ['view', 'edit'];
  
  if (document.facets?.includes(NUXEO_FACETS.Versionable)) {
    actions.push('version', 'restore');
  }
  
  if (document.facets?.includes(NUXEO_FACETS.Publishable)) {
    actions.push('publish', 'unpublish');
  }
  
  if (document.facets?.includes(NUXEO_FACETS.Commentable)) {
    actions.push('comment');
  }
  
  return actions;
}
```

## 🎯 Conclusion

This enhanced constants generation system provides:

- **558+ type-safe constants** from your live Nuxeo server
- **Complete coverage** of operations, document types, schemas, and facets
- **Zero maintenance overhead** - automatically stays in sync
- **Enhanced developer experience** - IntelliSense, auto-completion, type checking
- **Backward compatibility** - existing code continues to work
- **Environment awareness** - different configs for dev/staging/prod
- **Error resilience** - graceful fallback when server unavailable

The integration between auto-generated `nuxeo.constants.ts` and manual `document.constants.ts` provides the best of both worlds: comprehensive server-validated constants with convenient UI and business configuration.

---

*Generated constants are always up-to-date with your Nuxeo server. Run `npm run constants:generate` to refresh!* 🚀