/**
 * Enterprise Dashboard Component
 * Professional-grade document management dashboard with Material Design
 * Replicates Nuxeo Web UI "Recently Edited" interface
 */

import { 
  Component, 
  OnInit, 
  OnDestroy, 
  inject, 
  signal,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material Design imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

// Core services and interfaces
import { DocumentService } from '../../../../../../src/core/services/document.service';
import { DocumentTypeDiscoveryService } from '../../../../../../src/core/services/document-type-discovery.service';
import { LoggingService } from '../../../../../../src/core/services/logging.service';
import { IDocumentTableData } from '../../../../../../src/core/interfaces/document.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <mat-toolbar class="dashboard-header">
        <mat-icon class="header-icon">dashboard</mat-icon>
        <span class="header-title">Dashboard</span>
        <span class="spacer"></span>
        <button mat-icon-button 
                [disabled]="isLoading()"
                (click)="refreshDocuments()"
                matTooltip="Refresh">
          <mat-icon [class.spin]="isLoading()">refresh</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="dashboard-content">
        
        <!-- Recently Edited Section -->
        <mat-card class="documents-card">
          <mat-card-header class="section-header">
            <mat-icon mat-card-avatar class="section-icon">edit</mat-icon>
            <mat-card-title class="section-title">Recently Edited</mat-card-title>
            <mat-card-subtitle class="section-subtitle">
              {{ totalDocuments() }} documents found
            </mat-card-subtitle>
            <span class="header-spacer"></span>
            @if (lastUpdated()) {
              <span class="last-updated">
                Last updated: {{ formatLastUpdated(lastUpdated()!) }}
              </span>
            }
          </mat-card-header>

          <!-- Loading Progress -->
          @if (isLoading()) {
            <mat-progress-bar mode="indeterminate" class="loading-bar"></mat-progress-bar>
          }

          <!-- Error State -->
          @if (error()) {
            <mat-card-content class="error-state">
              <mat-icon class="error-icon">error</mat-icon>
              <div class="error-content">
                <h3>Unable to load documents</h3>
                <p>{{ error() }}</p>
                <button mat-raised-button color="primary" (click)="refreshDocuments()">
                  <mat-icon>refresh</mat-icon>
                  Try Again
                </button>
              </div>
            </mat-card-content>
          }

          <!-- Data Table -->
          @if (!isLoading() && !error() && tableData().length > 0) {
            <div class="table-container">
              <table mat-table 
                     [dataSource]="dataSource" 
                     matSort
                     class="documents-table">

                <!-- Icon Column -->
                <ng-container matColumnDef="icon">
                  <th mat-header-cell *matHeaderCellDef class="icon-column"></th>
                  <td mat-cell *matCellDef="let document" class="icon-column">
                    <mat-icon class="document-icon" [matTooltip]="document.type">
                      {{ document.icon }}
                    </mat-icon>
                  </td>
                </ng-container>

                <!-- Title Column -->
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header class="title-column">
                    Title
                  </th>
                  <td mat-cell *matCellDef="let document" class="title-column">
                    <div class="title-content">
                      <span class="document-title" [matTooltip]="document.path">
                        {{ document.title }}
                      </span>
                      <span class="document-path">{{ document.path }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Modified Column -->
                <ng-container matColumnDef="modified">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header class="modified-column">
                    Modified
                  </th>
                  <td mat-cell *matCellDef="let document" class="modified-column">
                    <span [matTooltip]="formatFullDate(document.modified)">
                      {{ formatRelativeTime(document.modified) }}
                    </span>
                  </td>
                </ng-container>

                <!-- Last Contributor Column -->
                <ng-container matColumnDef="lastContributor">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header class="contributor-column">
                    Last Contributor
                  </th>
                  <td mat-cell *matCellDef="let document" class="contributor-column">
                    <div class="contributor-info">
                      <mat-icon class="contributor-icon">person</mat-icon>
                      <span class="contributor-name">{{ document.lastContributor }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="actions-column"></th>
                  <td mat-cell *matCellDef="let document" class="actions-column">
                    <button mat-icon-button 
                            [matMenuTriggerFor]="actionMenu"
                            matTooltip="More actions">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDocument(document)">
                        <mat-icon>visibility</mat-icon>
                        <span>View</span>
                      </button>
                      <button mat-menu-item (click)="editDocument(document)">
                        <mat-icon>edit</mat-icon>
                        <span>Edit</span>
                      </button>
                      <button mat-menu-item (click)="downloadDocument(document)">
                        <mat-icon>download</mat-icon>
                        <span>Download</span>
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="shareDocument(document)">
                        <mat-icon>share</mat-icon>
                        <span>Share</span>
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <!-- Table Headers and Rows -->
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row 
                    *matRowDef="let row; columns: displayedColumns;"
                    class="document-row"
                    (click)="selectDocument(row)"
                    [class.selected]="selectedDocument()?.uid === row.uid"></tr>

              </table>

              <!-- Paginator -->
              <mat-paginator 
                [length]="totalDocuments()"
                [pageSize]="pageSize()"
                [pageSizeOptions]="pageSizeOptions"
                [showFirstLastButtons]="true"
                (page)="onPageChange($event)"
                class="table-paginator">
              </mat-paginator>
            </div>
          }

          <!-- Empty State -->
          @if (!isLoading() && !error() && tableData().length === 0) {
            <mat-card-content class="empty-state">
              <mat-icon class="empty-icon">folder_open</mat-icon>
              <h3>No documents found</h3>
              <p>There are no recently edited documents to display.</p>
              <button mat-raised-button color="primary" (click)="refreshDocuments()">
                <mat-icon>refresh</mat-icon>
                Refresh
              </button>
            </mat-card-content>
          }

        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #fafafa;
    }

    .dashboard-header {
      background-color: white;
      color: rgba(0, 0, 0, 0.87);
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-icon {
      margin-right: 12px;
    }

    .header-title {
      font-size: 20px;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .dashboard-content {
      flex: 1;
      padding: 24px;
      overflow: auto;
    }

    .documents-card {
      height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
    }

    .section-header {
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #fafafa;
    }

    .section-icon {
      background-color: #2196f3;
      color: white;
    }

    .section-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }

    .section-subtitle {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      margin: 4px 0 0 0;
    }

    .header-spacer {
      flex: 1;
    }

    .last-updated {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
      align-self: flex-end;
    }

    .loading-bar {
      margin: 0;
    }

    .error-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      flex: 1;
    }

    .error-icon, .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: rgba(0, 0, 0, 0.3);
      margin-bottom: 16px;
    }

    .error-content h3, .empty-state h3 {
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .error-content p, .empty-state p {
      margin: 0 0 24px 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .table-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .documents-table {
      flex: 1;
    }

    .icon-column {
      width: 48px;
      text-align: center;
    }

    .title-column {
      width: 40%;
    }

    .modified-column {
      width: 20%;
    }

    .contributor-column {
      width: 20%;
    }

    .actions-column {
      width: 80px;
      text-align: right;
    }

    .document-icon {
      color: rgba(0, 0, 0, 0.6);
    }

    .title-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .document-title {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }

    .document-path {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
      font-family: 'Roboto Mono', monospace;
    }

    .contributor-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .contributor-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: rgba(0, 0, 0, 0.5);
    }

    .contributor-name {
      font-size: 14px;
    }

    .document-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .document-row:hover {
      background-color: #f5f5f5;
    }

    .document-row.selected {
      background-color: #e3f2fd;
    }

    .table-paginator {
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 16px;
      }

      .documents-card {
        height: calc(100vh - 100px);
      }

      .section-header {
        padding: 12px 16px;
      }

      .title-column {
        width: 50%;
      }

      .modified-column,
      .contributor-column {
        width: 25%;
      }

      .document-path {
        display: none;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Service injection
  private readonly documentService = inject(DocumentService);
  private readonly documentTypeDiscovery = inject(DocumentTypeDiscoveryService);
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  // ViewChild references
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Component state with signals
  private readonly _tableData = signal<IDocumentTableData[]>([]);
  private readonly _selectedDocument = signal<IDocumentTableData | null>(null);
  private readonly _totalDocuments = signal<number>(0);
  private readonly _pageSize = signal<number>(20);
  private readonly _currentPage = signal<number>(0);
  private readonly _lastUpdated = signal<Date | null>(null);

  // Service state
  public readonly isLoading = this.documentService.isLoading;
  public readonly error = this.documentService.error;

  // Public computed signals
  public readonly tableData = this._tableData.asReadonly();
  public readonly selectedDocument = this._selectedDocument.asReadonly();
  public readonly totalDocuments = this._totalDocuments.asReadonly();
  public readonly pageSize = this._pageSize.asReadonly();
  public readonly lastUpdated = this._lastUpdated.asReadonly();

  // Document type discovery - making the dashboard future-ready
  public readonly availableDocumentTypes = this.documentTypeDiscovery.availableTypes;
  public readonly isDiscoveringTypes = this.documentTypeDiscovery.isDiscovering;

  // Table configuration
  public readonly displayedColumns: string[] = ['icon', 'title', 'modified', 'lastContributor', 'actions'];
  public readonly pageSizeOptions: number[] = [10, 20, 50, 100];
  public readonly dataSource = new MatTableDataSource<IDocumentTableData>();

  ngOnInit(): void {
    this.logger.info('Dashboard component initialized', undefined, 'DashboardComponent');
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this.logger.info('Dashboard component destroyed', undefined, 'DashboardComponent');
    this.documentService.clearState();
  }

  /**
   * Load documents from Nuxeo
   */
  public async loadDocuments(): Promise<void> {
    try {
      const response = await this.documentService.getRecentlyModified(this.pageSize());
      
      // Transform and set data
      const transformedData = this.documentService.transformToTableData(response.entries);
      this._tableData.set(transformedData);
      this._totalDocuments.set(response.totalSize);
      this._lastUpdated.set(new Date());
      
      // Update data source
      this.dataSource.data = transformedData;
      
      this.logger.info('Documents loaded successfully', {
        count: transformedData.length,
        totalSize: response.totalSize
      }, 'DashboardComponent');

    } catch (error) {
      this.logger.error('Failed to load documents', error, 'DashboardComponent');
      this.showErrorMessage('Failed to load documents. Please try again.');
    }
  }

  /**
   * Refresh documents
   */
  public async refreshDocuments(): Promise<void> {
    await this.loadDocuments();
    this.showSuccessMessage('Documents refreshed successfully');
  }

  /**
   * Handle page change
   */
  public async onPageChange(event: any): Promise<void> {
    this._currentPage.set(event.pageIndex);
    this._pageSize.set(event.pageSize);
    await this.loadDocuments();
  }

  /**
   * Select a document
   */
  public selectDocument(document: IDocumentTableData): void {
    this._selectedDocument.set(document);
    this.logger.info('Document selected', { uid: document.uid, title: document.title }, 'DashboardComponent');
  }

  /**
   * Document actions
   */
  public viewDocument(document: IDocumentTableData): void {
    this.logger.info('View document requested', { uid: document.uid }, 'DashboardComponent');
    this.showInfoMessage(`Viewing: ${document.title}`);
  }

  public editDocument(document: IDocumentTableData): void {
    this.logger.info('Edit document requested', { uid: document.uid }, 'DashboardComponent');
    this.showInfoMessage(`Editing: ${document.title}`);
  }

  public downloadDocument(document: IDocumentTableData): void {
    this.logger.info('Download document requested', { uid: document.uid }, 'DashboardComponent');
    this.showInfoMessage(`Downloading: ${document.title}`);
  }

  public shareDocument(document: IDocumentTableData): void {
    this.logger.info('Share document requested', { uid: document.uid }, 'DashboardComponent');
    this.showInfoMessage(`Sharing: ${document.title}`);
  }

  /**
   * Format relative time
   */
  public formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'a few seconds ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Format full date
   */
  public formatFullDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  /**
   * Format last updated time
   */
  public formatLastUpdated(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Notification methods
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfoMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }
}