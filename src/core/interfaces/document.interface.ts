/**
 * Document Management Interfaces
 * Enterprise-grade TypeScript interfaces for Nuxeo document operations
 */

export interface INuxeoDocument {
  readonly uid: string;
  readonly path: string;
  readonly type: string;
  readonly state: string;
  readonly title: string;
  readonly parentRef?: string;
  readonly isCheckedOut?: boolean;
  readonly isVersion?: boolean;
  readonly isProxy?: boolean;
  readonly isTrashed?: boolean;
  readonly versionLabel?: string;
  readonly changeToken?: string;
  readonly contextParameters?: Record<string, any>;
  readonly facets?: string[];
  readonly schemas?: IDocumentSchemas;
  readonly properties?: Record<string, any>;
  readonly lastModified?: string;
  readonly created?: string;
}

export interface IDocumentSchemas {
  readonly 'dublincore'?: IDublinCoreSchema;
  readonly 'common'?: ICommonSchema;
  readonly 'file'?: IFileSchema;
  readonly [key: string]: any;
}

export interface IDublinCoreSchema {
  readonly title?: string;
  readonly description?: string;
  readonly creator?: string;
  readonly created?: string;
  readonly modified?: string;
  readonly lastContributor?: string;
  readonly contributors?: string[];
  readonly subject?: string[];
  readonly rights?: string;
  readonly source?: string;
  readonly coverage?: string;
  readonly expired?: string;
  readonly issued?: string;
  readonly valid?: string;
}

export interface ICommonSchema {
  readonly icon?: string;
  readonly icon_expanded?: string;
  readonly size?: number;
}

export interface IFileSchema {
  readonly content?: IFileContent;
  readonly filename?: string;
}

export interface IFileContent {
  readonly name?: string;
  readonly 'mime-type'?: string;
  readonly encoding?: string;
  readonly digest?: string;
  readonly length?: number;
  readonly data?: string;
}

export interface IDocumentSearchResponse {
  readonly entity_type: string;
  readonly isPaginable: boolean;
  readonly resultsCount: number;
  readonly pageSize: number;
  readonly maxPageSize: number;
  readonly resultsCountLimit: number;
  readonly currentPageSize: number;
  readonly currentPageIndex: number;
  readonly numberOfPages: number;
  readonly isPreviousPageAvailable: boolean;
  readonly isNextPageAvailable: boolean;
  readonly isLastPageAvailable: boolean;
  readonly isSortable: boolean;
  readonly hasError: boolean;
  readonly errorMessage?: string;
  readonly totalSize: number;
  readonly pageIndex: number;
  readonly entries: INuxeoDocument[];
}

export interface IDocumentSearchParams {
  readonly currentPageIndex?: number;
  readonly pageSize?: number;
  readonly queryParams?: string;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

export interface IDocumentService {
  searchDocuments(params: IDocumentSearchParams): Promise<IDocumentSearchResponse>;
  getDocumentById(uid: string): Promise<INuxeoDocument>;
  getDocumentByPath(path: string): Promise<INuxeoDocument>;
  getRecentlyModified(pageSize?: number): Promise<IDocumentSearchResponse>;
}

export interface IDocumentTableColumn {
  readonly key: string;
  readonly label: string;
  readonly sortable?: boolean;
  readonly type?: 'text' | 'date' | 'user' | 'icon' | 'actions';
  readonly width?: string;
  readonly align?: 'left' | 'center' | 'right';
}

export interface IDocumentTableData {
  readonly uid: string;
  readonly title: string;
  readonly type: string;
  readonly icon: string;
  readonly modified: Date;
  readonly lastContributor: string;
  readonly path: string;
  readonly state: string;
}