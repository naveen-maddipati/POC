/**
 * Enterprise Nuxeo Integration Welcome Component
 * Comprehensive demo of all Nuxeo capabilities with proper error handling
 */

import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { Subscription, interval, firstValueFrom } from 'rxjs';
import { takeWhile, startWith } from 'rxjs/operators';

import { 
  NuxeoService, 
  LoggingService, 
  INuxeoConnection,
  INuxeoDocument,
  NUXEO_DOCUMENT_TYPES,
  APP_CONSTANTS
} from '../../../../../../src/core';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  message?: string;
  data?: any;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  template: `
    <div class="welcome-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>integration_instructions</mat-icon>
            Enterprise Nuxeo Integration
          </mat-card-title>
          <mat-card-subtitle>
            Comprehensive testing and demonstration of Nuxeo Platform capabilities
          </mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <!-- Connection Status -->
      <mat-card class="status-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ connectionStatus().connected ? 'wifi' : 'wifi_off' }}</mat-icon>
            Connection Status
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="connection-status" [class.connected]="connectionStatus().connected">
            <mat-icon>{{ connectionStatus().connected ? 'check_circle' : 'error_outline' }}</mat-icon>
            <span>{{ connectionStatus().connected ? 'Connected to Nuxeo' : 'Not Connected' }}</span>
            @if (connectionStatus().serverVersion) {
              <mat-chip color="primary" selected>Server: {{ connectionStatus().serverVersion }}</mat-chip>
            }
            @if (connectionStatus().user?.properties?.username) {
              <mat-chip color="accent" selected>User: {{ connectionStatus().user?.properties?.username }}</mat-chip>
            }
          </div>
          <div class="connection-actions">
            <button mat-raised-button 
                    color="primary" 
                    [disabled]="isConnecting()"
                    (click)="connectToNuxeo()">
              @if (isConnecting()) {
                <mat-spinner diameter="18"></mat-spinner>
                Connecting...
              } @else {
                <mat-icon>power</mat-icon>
                Connect to Nuxeo
              }
            </button>
            <button mat-raised-button 
                    color="warn"
                    [disabled]="!connectionStatus().connected"
                    (click)="disconnectFromNuxeo()">
              <mat-icon>power_off</mat-icon>
              Disconnect
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Test Suite -->
      <mat-card class="tests-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>science</mat-icon>
            Integration Test Suite
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="test-controls">
            <button mat-raised-button 
                    color="primary"
                    [disabled]="!connectionStatus().connected || isRunningTests()"
                    (click)="runAllTests()">
              @if (isRunningTests()) {
                <mat-spinner diameter="18"></mat-spinner>
                Running Tests...
              } @else {
                <mat-icon>play_arrow</mat-icon>
                Run All Tests
              }
            </button>
            <button mat-raised-button 
                    color="accent"
                    [disabled]="testResults().length === 0"
                    (click)="clearTestResults()">
              <mat-icon>clear_all</mat-icon>
              Clear Results
            </button>
          </div>
          
          <div class="test-results">
            @for (test of testResults(); track test.name) {
              <mat-expansion-panel [expanded]="test.status === 'error'">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon [class]="'status-' + test.status">
                      {{ getStatusIcon(test.status) }}
                    </mat-icon>
                    {{ test.name }}
                    @if (test.duration) {
                      <span class="duration">({{ test.duration }}ms)</span>
                    }
                  </mat-panel-title>
                </mat-expansion-panel-header>
                
                @if (test.message) {
                  <p><strong>Message:</strong> {{ test.message }}</p>
                }
                
                @if (test.data) {
                  <div class="test-data">
                    <h4>Response Data:</h4>
                    <pre>{{ formatJson(test.data) }}</pre>
                  </div>
                }
              </mat-expansion-panel>
            }
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Interactive Operations -->
      <mat-tab-group class="operations-tabs">
        <!-- Document Operations -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>folder</mat-icon>
            Documents
          </ng-template>
          <div class="operation-section">
            <h3>
              <mat-icon>description</mat-icon>
              Document Operations
            </h3>
            
            <mat-form-field appearance="outline">
              <mat-label>Document Path</mat-label>
              <input matInput 
                     [(ngModel)]="documentPath" 
                     placeholder="/default-domain/workspaces"
                     [disabled]="!connectionStatus().connected">
              <mat-icon matSuffix>folder_open</mat-icon>
            </mat-form-field>
            
            <div class="operation-buttons">
              <button mat-raised-button 
                      color="primary"
                      [disabled]="!connectionStatus().connected"
                      (click)="fetchDocument()">
                <mat-icon>search</mat-icon>
                Fetch Document
              </button>
              <button mat-raised-button 
                      color="accent"
                      [disabled]="!connectionStatus().connected"
                      (click)="getChildren()">
                <mat-icon>list</mat-icon>
                Get Children
              </button>
              <button mat-raised-button 
                      color="warn"
                      [disabled]="!connectionStatus().connected"
                      (click)="createTestFolder()">
                <mat-icon>create_new_folder</mat-icon>
                Create Test Folder
              </button>
            </div>
                
                @if (selectedDocument()) {
                  <mat-expansion-panel>
                    <mat-expansion-panel-header>
                      <mat-panel-title>Selected Document</mat-panel-title>
                    </mat-expansion-panel-header>
                    <pre>{{ formatJson(selectedDocument()) }}</pre>
                  </mat-expansion-panel>
                }
              </div>
        </mat-tab>

        <!-- Search Operations -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>search</mat-icon>
            Search
          </ng-template>
          <div class="operation-section">
            <h3>
              <mat-icon>manage_search</mat-icon>
              NXQL Search Operations
            </h3>
            
            <mat-form-field appearance="outline">
              <mat-label>NXQL Query</mat-label>
              <textarea matInput 
                       [(ngModel)]="nxqlQuery" 
                       rows="4"
                       [disabled]="!connectionStatus().connected"
                       placeholder="SELECT * FROM Document WHERE ecm:primaryType = 'File' AND ecm:currentLifeCycleState != 'deleted'">
              </textarea>
              <mat-icon matSuffix>code</mat-icon>
              <mat-hint>Enter your NXQL query to search Nuxeo repository</mat-hint>
            </mat-form-field>
            
            <div class="operation-buttons">
              <button mat-raised-button 
                      color="primary"
                      [disabled]="!connectionStatus().connected || !nxqlQuery.trim()"
                      (click)="executeQuery()">
                <mat-icon>play_arrow</mat-icon>
                Execute Query
              </button>
            </div>
                
                @if (searchResults().length > 0) {
                  <div class="search-results">
                    <h4>
                      <mat-icon>table_view</mat-icon>
                      Search Results ({{ searchResults().length }} found)
                    </h4>
                    <mat-table [dataSource]="searchResults()" class="mat-elevation-2">
                      <ng-container matColumnDef="title">
                        <mat-header-cell *matHeaderCellDef>
                          <mat-icon>title</mat-icon>
                          Title
                        </mat-header-cell>
                        <mat-cell *matCellDef="let doc">
                          <strong>{{ doc.title || doc.name || 'Untitled' }}</strong>
                        </mat-cell>
                      </ng-container>
                      
                      <ng-container matColumnDef="type">
                        <mat-header-cell *matHeaderCellDef>
                          <mat-icon>category</mat-icon>
                          Type
                        </mat-header-cell>
                        <mat-cell *matCellDef="let doc">
                          <mat-chip color="primary" selected>{{ doc.type }}</mat-chip>
                        </mat-cell>
                      </ng-container>
                      
                      <ng-container matColumnDef="path">
                        <mat-header-cell *matHeaderCellDef>
                          <mat-icon>folder</mat-icon>
                          Path
                        </mat-header-cell>
                        <mat-cell *matCellDef="let doc">
                          <code>{{ doc.path }}</code>
                        </mat-cell>
                      </ng-container>
                      
                      <ng-container matColumnDef="actions">
                        <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
                        <mat-cell *matCellDef="let doc">
                          <button mat-icon-button 
                                  color="primary"
                                  matTooltip="Select Document"
                                  (click)="selectDocument(doc)">
                            <mat-icon>visibility</mat-icon>
                          </button>
                        </mat-cell>
                      </ng-container>
                      
                      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                      <mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></mat-row>
                    </mat-table>
                  </div>
                } @else if (connectionStatus().connected) {
                  <div class="no-results">
                    <mat-icon>search_off</mat-icon>
                    <p>Execute a query to see results here</p>
                  </div>
                }
              </div>
        </mat-tab>

        <!-- Logs -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>terminal</mat-icon>
            Logs
          </ng-template>
          <div class="operation-section">
            <div class="logs-section">
              <h3>
                <mat-icon>bug_report</mat-icon>
                System Logs & Debug Information
              </h3>
              
              <div class="logs-controls">
                <button mat-raised-button 
                        color="primary"
                        (click)="refreshLogs()">
                  <mat-icon>refresh</mat-icon>
                  Refresh
                </button>
                <button mat-raised-button 
                        color="accent"
                        [disabled]="recentLogs().length === 0"
                        (click)="clearLogs()">
                  <mat-icon>clear</mat-icon>
                  Clear
                </button>
                <button mat-raised-button 
                        color="warn"
                        [disabled]="recentLogs().length === 0"
                        (click)="exportLogs()">
                  <mat-icon>download</mat-icon>
                  Export
                </button>
              </div>
                
                <div class="logs-container">
                  @for (log of recentLogs(); track $index) {
                    <div class="log-entry" [class]="'log-' + log.level">
                      <span class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
                      <span class="level">{{ log.level.toUpperCase() }}</span>
                      <span class="source">{{ log.source }}</span>
                      <span class="message">{{ log.message }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .welcome-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      background: #f8f9fa;
      min-height: 100vh;
    }
    
    .header-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin-bottom: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      
      mat-card-header {
        padding: 24px;
        
        mat-card-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          
          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
        
        mat-card-subtitle {
          color: rgba(255,255,255,0.9);
          font-size: 16px;
          line-height: 1.5;
        }
      }
    }
    
    .status-card, .tests-card {
      margin-bottom: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      border: 1px solid #e9ecef;
      
      mat-card-header {
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        border-radius: 12px 12px 0 0;
        
        mat-card-title {
          font-size: 20px;
          font-weight: 600;
          color: #495057;
        }
      }
      
      mat-card-content {
        padding: 24px;
      }
    }
    
    .connection-status {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #dc3545;
      
      &.connected {
        background: #d4edda;
        border-left-color: #28a745;
        color: #155724;
      }
      
      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
      
      span {
        font-size: 18px;
        font-weight: 600;
      }
      
      mat-chip {
        margin-left: auto;
        background: rgba(0,0,0,0.1);
        color: inherit;
        font-weight: 500;
      }
    }
    
    .connection-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      
      button {
        min-width: 120px;
        height: 44px;
        border-radius: 8px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    
    .test-controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      
      button {
        min-width: 140px;
        height: 44px;
        border-radius: 8px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    
    .test-results {
      mat-expansion-panel {
        margin-bottom: 12px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        box-shadow: none;
        
        &::before {
          display: none;
        }
        
        mat-expansion-panel-header {
          padding: 16px 20px;
          
          mat-panel-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
          }
        }
      }
    }
    
    .status-pending { color: #6c757d; }
    .status-running { 
      color: #007bff; 
      animation: pulse 1.5s infinite;
    }
    .status-success { color: #28a745; }
    .status-error { color: #dc3545; }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .duration {
      font-size: 0.85em;
      color: #6c757d;
      margin-left: 12px;
      background: rgba(0,0,0,0.05);
      padding: 2px 8px;
      border-radius: 12px;
    }
    
    .test-data {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      border: 1px solid #e9ecef;
      
      h4 {
        margin: 0 0 12px 0;
        color: #495057;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      pre {
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 0.85em;
        margin: 0;
        color: #495057;
        background: white;
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #e9ecef;
      }
    }
    
    .operations-tabs {
      margin-top: 24px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      border: 1px solid #e9ecef;
      overflow: hidden;
      
      .mat-mdc-tab-group {
        .mat-mdc-tab-header {
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .mat-mdc-tab-body-wrapper {
          padding: 0;
        }
      }
    }
    
    .operation-section {
      padding: 24px;
      
      h3 {
        margin: 0 0 20px 0;
        color: #495057;
        font-size: 20px;
        font-weight: 600;
      }
    }
    
    .operation-buttons {
      display: flex;
      gap: 12px;
      margin: 20px 0;
      flex-wrap: wrap;
      
      button {
        min-width: 140px;
        height: 40px;
        border-radius: 8px;
        font-weight: 500;
      }
    }
    
    .search-results {
      margin-top: 24px;
      
      h4 {
        margin-bottom: 16px;
        color: #495057;
        font-size: 18px;
        font-weight: 600;
      }
      
      mat-table {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
    }
    
    .logs-section {
      .logs-controls {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        
        button {
          min-width: 100px;
          height: 40px;
          border-radius: 8px;
          font-weight: 500;
        }
      }
      
      .logs-container {
        height: 500px;
        overflow-y: auto;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        
        .log-entry {
          display: flex;
          gap: 12px;
          padding: 8px 16px;
          border-bottom: 1px solid #f1f3f4;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.85em;
          line-height: 1.5;
          
          &:hover {
            background: #f8f9fa;
          }
          
          .timestamp { 
            width: 120px; 
            color: #6c757d; 
            flex-shrink: 0;
          }
          .level { 
            width: 70px; 
            font-weight: 600; 
            flex-shrink: 0;
            text-transform: uppercase;
          }
          .source { 
            width: 140px; 
            color: #495057; 
            flex-shrink: 0;
            font-weight: 500;
          }
          .message { 
            flex: 1; 
            color: #212529;
          }
          
          &.log-debug { 
            opacity: 0.7;
            .level { color: #6c757d; }
          }
          &.log-info { 
            .level { color: #007bff; }
          }
          &.log-warn { 
            .level { color: #ffc107; }
            background: #fff3cd;
          }
          &.log-error { 
            .level { color: #dc3545; }
            background: #f8d7da;
            border-left: 3px solid #dc3545;
          }
        }
      }
    }
    
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
      
      .mat-mdc-form-field-wrapper {
        background: white;
        border-radius: 8px;
      }
    }
    
    mat-card {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      border: 1px solid #e9ecef;
    }
    
    mat-expansion-panel {
      border-radius: 8px !important;
    }
    
    button[mat-raised-button] {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    
    .mat-mdc-tab-body-content {
      padding: 0 !important;
    }
    
    .no-results {
      text-align: center;
      padding: 40px;
      color: #6c757d;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.6;
      }
      
      p {
        font-size: 16px;
        margin: 0;
      }
    }
    
    .table-row {
      &:hover {
        background: #f8f9fa;
      }
    }
    
    mat-header-cell {
      font-weight: 600;
      color: #495057;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 8px;
        vertical-align: middle;
      }
    }
    
    mat-cell {
      code {
        background: #f8f9fa;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.85em;
        color: #e83e8c;
        border: 1px solid #e9ecef;
      }
    }
    
    h3 mat-icon {
      margin-right: 12px;
      vertical-align: middle;
      color: #495057;
    }
    
    mat-card-title mat-icon {
      margin-right: 12px;
      vertical-align: middle;
    }
    
    button mat-icon {
      margin-right: 8px;
    }
    
    mat-spinner {
      margin-right: 12px;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .welcome-container {
        padding: 16px;
      }
      
      .header-card mat-card-title {
        font-size: 24px;
        
        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }
      
      .connection-actions,
      .test-controls,
      .operation-buttons {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
      
      .logs-container {
        height: 300px;
        
        .log-entry {
          flex-direction: column;
          gap: 4px;
          
          .timestamp,
          .level,
          .source {
            width: auto;
          }
        }
      }
      
      mat-table {
        font-size: 0.85em;
      }
      
      mat-cell code {
        font-size: 0.75em;
      }
    }
  `]
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private readonly nuxeoService = inject(NuxeoService);
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);
  
  private subscriptions = new Subscription();

  // Reactive signals
  connectionStatus = signal<INuxeoConnection>({ connected: false });
  isConnecting = signal(false);
  isRunningTests = signal(false);
  testResults = signal<TestResult[]>([]);
  selectedDocument = signal<INuxeoDocument | null>(null);
  searchResults = signal<INuxeoDocument[]>([]);
  recentLogs = signal<any[]>([]);

  // Form data
  documentPath = '/';
  nxqlQuery = "SELECT * FROM Document WHERE ecm:primaryType = 'File' AND ecm:currentLifeCycleState != 'deleted'";
  displayedColumns = ['title', 'type', 'path', 'actions'];

  ngOnInit(): void {
    this.logger.info('WelcomeComponent initialized');
    
    // Subscribe to connection status
    this.subscriptions.add(
      this.nuxeoService.connection$.subscribe(connection => {
        this.connectionStatus.set(connection);
        this.logger.info('Connection status updated', { connected: connection.connected });
      })
    );

    // Auto-refresh logs every 5 seconds
    this.subscriptions.add(
      interval(5000).pipe(
        startWith(0),
        takeWhile(() => true)
      ).subscribe(() => this.refreshLogs())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async connectToNuxeo(): Promise<void> {
    this.isConnecting.set(true);
    
    try {
      const connection = await this.nuxeoService.connect().toPromise();
      this.showSuccess('Connected to Nuxeo successfully!');
      this.logger.info('Manual connection successful', connection);
    } catch (error) {
      this.showError('Failed to connect to Nuxeo: ' + (error as any)?.message);
      this.logger.error('Manual connection failed', error);
    } finally {
      this.isConnecting.set(false);
    }
  }

  disconnectFromNuxeo(): void {
    this.nuxeoService.disconnect();
    this.showInfo('Disconnected from Nuxeo');
  }

  async runAllTests(): Promise<void> {
    this.isRunningTests.set(true);
    this.testResults.set([]);

    const tests: Array<() => Promise<void>> = [
      () => this.testConnection(),
      () => this.testGetCurrentUser(),
      () => this.testFetchRootDocument(),
      () => this.testGetChildren(),
      () => this.testCreateDocument(),
      () => this.testQuery(),
      () => this.testGetServerInfo()
    ];

    for (const test of tests) {
      try {
        await test();
        await this.sleep(500); // Brief pause between tests
      } catch (error) {
        this.logger.error('Test execution failed', error);
      }
    }

    this.isRunningTests.set(false);
    this.showSuccess('Test suite completed!');
  }

  private async testConnection(): Promise<void> {
    return this.runTest('Connection Test', async () => {
      if (!this.connectionStatus().connected) {
        throw new Error('Not connected to Nuxeo server');
      }
      return { status: 'Connected', user: this.connectionStatus().user?.properties?.username };
    });
  }

  private async testGetCurrentUser(): Promise<void> {
    return this.runTest('Get Current User', async () => {
      const response = await this.nuxeoService.getCurrentUser().toPromise();
      return response?.data;
    });
  }

  private async testFetchRootDocument(): Promise<void> {
    return this.runTest('Fetch Root Document', async () => {
      const response = await this.nuxeoService.fetchDocument('/').toPromise();
      return response?.data;
    });
  }

  private async testGetChildren(): Promise<void> {
    return this.runTest('Get Children', async () => {
      const response = await this.nuxeoService.getChildren('/', 5).toPromise();
      return {
        totalSize: response?.data?.totalSize,
        entriesCount: response?.data?.entries?.length
      };
    });
  }

  private async testCreateDocument(): Promise<void> {
    return this.runTest('Create Test Document', async () => {
      const testDoc = {
        'entity-type': 'document',
        type: NUXEO_DOCUMENT_TYPES.FOLDER,
        name: `test-folder-${Date.now()}`,
        properties: {
          'dc:title': 'Test Folder from Angular Integration'
        }
      };
      
      const response = await this.nuxeoService.createDocument('/', testDoc).toPromise();
      return response?.data;
    });
  }

  private async testQuery(): Promise<void> {
    return this.runTest('NXQL Query', async () => {
      const query = "SELECT * FROM Document WHERE ecm:primaryType = 'Domain'";
      const response = await this.nuxeoService.query(query, 5).toPromise();
      return {
        totalSize: response?.data?.totalSize,
        entriesCount: response?.data?.entries?.length
      };
    });
  }

  private async testGetServerInfo(): Promise<void> {
    return this.runTest('Get Server Info', async () => {
      const response = await this.nuxeoService.getServerInfo().toPromise();
      return {
        applicationName: response?.data?.applicationName,
        applicationVersion: response?.data?.applicationVersion
      };
    });
  }

  private async runTest(name: string, testFunction: () => Promise<any>): Promise<void> {
    const startTime = performance.now();
    
    // Add pending test
    const currentTests = this.testResults();
    const newTest: TestResult = { name, status: 'pending' };
    this.testResults.set([...currentTests, newTest]);
    
    // Update to running
    this.updateTestStatus(name, 'running');
    
    try {
      const data = await testFunction();
      const duration = Math.round(performance.now() - startTime);
      
      this.updateTestStatus(name, 'success', { 
        duration, 
        message: 'Test completed successfully',
        data 
      });
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      
      this.updateTestStatus(name, 'error', {
        duration,
        message: (error as any)?.message || 'Test failed',
        data: error
      });
    }
  }

  private updateTestStatus(name: string, status: TestResult['status'], extra?: Partial<TestResult>): void {
    const currentTests = this.testResults();
    const updatedTests = currentTests.map(test => 
      test.name === name ? { ...test, status, ...extra } : test
    );
    this.testResults.set(updatedTests);
  }

  clearTestResults(): void {
    this.testResults.set([]);
  }

  async fetchDocument(): Promise<void> {
    if (!this.documentPath) {
      this.showError('Please enter a document path');
      return;
    }

    try {
      const response = await this.nuxeoService.fetchDocument(this.documentPath).toPromise();
      this.selectedDocument.set(response?.data || null);
      this.showSuccess('Document fetched successfully');
    } catch (error) {
      this.showError('Failed to fetch document: ' + (error as any)?.message);
    }
  }

  async getChildren(): Promise<void> {
    if (!this.documentPath) {
      this.showError('Please enter a document path');
      return;
    }

    try {
      const response = await this.nuxeoService.getChildren(this.documentPath).toPromise();
      this.searchResults.set(response?.data?.entries || []);
      this.showSuccess(`Found ${response?.data?.entries?.length || 0} children`);
    } catch (error) {
      this.showError('Failed to get children: ' + (error as any)?.message);
    }
  }

  async createTestFolder(): Promise<void> {
    const testDoc = {
      'entity-type': 'document',
      type: NUXEO_DOCUMENT_TYPES.FOLDER,
      name: `test-folder-${Date.now()}`,
      properties: {
        'dc:title': 'Test Folder from Angular Integration',
        'dc:description': 'Created by the enterprise Angular Nuxeo integration'
      }
    };

    try {
      const response = await this.nuxeoService.createDocument(this.documentPath, testDoc).toPromise();
      this.selectedDocument.set(response?.data || null);
      this.showSuccess('Test folder created successfully');
    } catch (error) {
      this.showError('Failed to create folder: ' + (error as any)?.message);
    }
  }

  async executeQuery(): Promise<void> {
    if (!this.nxqlQuery?.trim()) {
      this.showError('Please enter an NXQL query');
      return;
    }

    try {
      this.logger.info('Executing NXQL query', { query: this.nxqlQuery }, 'WelcomeComponent');
      
      // Use firstValueFrom instead of deprecated toPromise()
      const response = await firstValueFrom(this.nuxeoService.query(this.nxqlQuery));
      
      this.logger.info('Query response received', { 
        success: response?.success,
        dataType: typeof response?.data,
        entriesLength: response?.data?.entries?.length 
      }, 'WelcomeComponent');

      if (response?.success && response?.data) {
        const entries = response.data.entries || [];
        this.searchResults.set(entries);
        this.showSuccess(`Query executed successfully. Found ${entries.length} results`);
        
        if (entries.length === 0) {
          this.showInfo('No documents found matching the query criteria');
        }
      } else {
        this.showError('Query executed but no data received');
      }
    } catch (error) {
      this.logger.error('Query execution failed', error, 'WelcomeComponent');
      this.showError('Query failed: ' + ((error as any)?.message || 'Unknown error'));
      this.searchResults.set([]);
    }
  }

  selectDocument(doc: INuxeoDocument): void {
    this.selectedDocument.set(doc);
    this.documentPath = doc.path;
  }

  refreshLogs(): void {
    const logs = this.logger.getRecentLogs(100);
    this.recentLogs.set(logs);
  }

  clearLogs(): void {
    this.logger.clearLogs();
    this.recentLogs.set([]);
    this.showInfo('Logs cleared');
  }

  exportLogs(): void {
    const logsData = this.logger.exportLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nuxeo-logs-${new Date().toISOString()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.showSuccess('Logs exported successfully');
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'running': return 'sync';
      case 'success': return 'check_circle';
      case 'error': return 'error';
      default: return 'help';
    }
  }

  formatJson(data: any): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: APP_CONSTANTS.UI.TOAST_DURATION,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: APP_CONSTANTS.UI.TOAST_DURATION,
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: APP_CONSTANTS.UI.TOAST_DURATION,
      panelClass: ['info-snackbar']
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}