import { 
  Component, 
  OnInit, 
  OnDestroy, 
  inject, 
  signal,
  computed,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiDiscoveryService, IApiTestResult, IApiCategory } from '../../../../../../src/core/services/api-discovery.service';
import { LoggingService } from '../../../../../../src/core/services/logging.service';

@Component({
  selector: 'app-api-discovery',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
    MatBadgeModule,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="api-discovery-container">
      <div class="page-header">
        <h1>
          <mat-icon>explore</mat-icon>
          Nuxeo API Discovery
        </h1>
        <p>Discover and test available Nuxeo API endpoints</p>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="primary">api</mat-icon>
              <div class="stat-numbers">
                <span class="stat-value">{{ testSummary().total }}</span>
                <span class="stat-label">Total Endpoints</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="accent">check_circle</mat-icon>
              <div class="stat-numbers">
                <span class="stat-value">{{ testSummary().available }}</span>
                <span class="stat-label">Available</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="warn">error</mat-icon>
              <div class="stat-numbers">
                <span class="stat-value">{{ testSummary().unavailable }}</span>
                <span class="stat-label">Unavailable</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="primary">trending_up</mat-icon>
              <div class="stat-numbers">
                <span class="stat-value">{{ testSummary().successRate }}%</span>
                <span class="stat-label">Success Rate</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Action Buttons -->
      <div class="action-bar">
        <button mat-raised-button 
                color="primary" 
                [disabled]="isTestingInProgress()"
                (click)="testAllEndpoints()">
          @if (isTestingInProgress()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            <mat-icon>play_arrow</mat-icon>
          }
          Test All Endpoints
        </button>

        <button mat-raised-button 
                color="accent"
                [disabled]="testResults().length === 0"
                (click)="exportResults()">
          <mat-icon>download</mat-icon>
          Export Results
        </button>

        <button mat-button 
                [disabled]="testResults().length === 0"
                (click)="clearResults()">
          <mat-icon>clear</mat-icon>
          Clear Results
        </button>

        @if (testSummary().lastTestTime) {
          <div class="last-test-info">
            <mat-icon>schedule</mat-icon>
            Last tested: {{ formatTimestamp(testSummary().lastTestTime!) }}
          </div>
        }
      </div>

      <!-- Progress Bar -->
      @if (isTestingInProgress()) {
        <mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
      }

      <!-- API Categories Tabs -->
      <mat-tab-group class="api-tabs" [selectedIndex]="selectedTabIndex()" (selectedTabChange)="onTabChange($event)">
        
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <ng-template matTabContent>
            <div class="tab-content">
              <h3>API Categories Overview</h3>
              
              <div class="categories-grid">
                @for (category of apiCategories(); track category.name) {
                  <mat-card class="category-card" [class]="'category-' + category.color">
                    <mat-card-header>
                      <mat-icon mat-card-avatar [color]="category.color">{{ category.icon }}</mat-icon>
                      <mat-card-title>{{ category.name }}</mat-card-title>
                      <mat-card-subtitle>{{ category.description }}</mat-card-subtitle>
                    </mat-card-header>
                    
                    <mat-card-content>
                      <div class="category-stats">
                        <div class="endpoint-count">
                          {{ category.endpoints.length }} endpoints
                        </div>
                        @if (getCategoryResults(category.name).length > 0) {
                          <div class="category-status">
                            <span class="available">{{ getCategoryAvailable(category.name) }} available</span>
                            <span class="unavailable">{{ getCategoryUnavailable(category.name) }} unavailable</span>
                          </div>
                        }
                      </div>
                    </mat-card-content>
                    
                    <mat-card-actions>
                      <button mat-button 
                              [color]="category.color"
                              [disabled]="isTestingInProgress()"
                              (click)="testCategory(category.name)">
                        Test Category
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            </div>
          </ng-template>
        </mat-tab>

        <!-- Individual Category Tabs -->
        @for (category of apiCategories(); track category.name) {
          <mat-tab [label]="category.name">
            <ng-template matTabContent>
              <div class="tab-content">
                <div class="category-header">
                  <h3>
                    <mat-icon [color]="category.color">{{ category.icon }}</mat-icon>
                    {{ category.name }}
                  </h3>
                  <p>{{ category.description }}</p>
                  
                  <button mat-raised-button 
                          [color]="category.color"
                          [disabled]="isTestingInProgress()"
                          (click)="testCategory(category.name)">
                    @if (isTestingInProgress()) {
                      <mat-spinner diameter="16"></mat-spinner>
                    } @else {
                      <mat-icon>play_arrow</mat-icon>
                    }
                    Test {{ category.name }}
                  </button>
                </div>

                <!-- Endpoints Table -->
                <mat-table [dataSource]="getCategoryEndpoints(category.name)" class="endpoints-table">
                  
                  <!-- Status Column -->
                  <ng-container matColumnDef="status">
                    <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
                    <mat-cell *matCellDef="let endpoint">
                      @if (getEndpointResult(endpoint.url)) {
                        <mat-chip [color]="getEndpointResult(endpoint.url)!.available ? 'accent' : 'warn'">
                          <mat-icon>{{ getEndpointResult(endpoint.url)!.available ? 'check_circle' : 'error' }}</mat-icon>
                          {{ getEndpointResult(endpoint.url)!.status }}
                        </mat-chip>
                      } @else {
                        <mat-chip>
                          <mat-icon>help</mat-icon>
                          Not Tested
                        </mat-chip>
                      }
                    </mat-cell>
                  </ng-container>

                  <!-- Method Column -->
                  <ng-container matColumnDef="method">
                    <mat-header-cell *matHeaderCellDef>Method</mat-header-cell>
                    <mat-cell *matCellDef="let endpoint">
                      <mat-chip [color]="getMethodColor(endpoint.method)">
                        {{ endpoint.method }}
                      </mat-chip>
                    </mat-cell>
                  </ng-container>

                  <!-- Name Column -->
                  <ng-container matColumnDef="name">
                    <mat-header-cell *matHeaderCellDef>Endpoint</mat-header-cell>
                    <mat-cell *matCellDef="let endpoint">
                      <div class="endpoint-info">
                        <strong>{{ endpoint.name }}</strong>
                        <div class="endpoint-url">{{ endpoint.url }}</div>
                        <div class="endpoint-description">{{ endpoint.description }}</div>
                      </div>
                    </mat-cell>
                  </ng-container>

                  <!-- Auth Column -->
                  <ng-container matColumnDef="auth">
                    <mat-header-cell *matHeaderCellDef>Authentication</mat-header-cell>
                    <mat-cell *matCellDef="let endpoint">
                      <div class="auth-info">
                        <mat-icon [color]="endpoint.requiresAuth ? 'warn' : 'primary'">
                          {{ endpoint.requiresAuth ? 'lock' : 'lock_open' }}
                        </mat-icon>
                        @if (getEndpointResult(endpoint.url)?.authMethod) {
                          <mat-chip class="auth-chip" color="accent">
                            {{ getEndpointResult(endpoint.url)?.authMethod }}
                          </mat-chip>
                        } @else {
                          <span class="auth-label">
                            {{ endpoint.requiresAuth ? 'Required' : 'None' }}
                          </span>
                        }
                      </div>
                    </mat-cell>
                  </ng-container>

                  <!-- Response Time Column -->
                  <ng-container matColumnDef="responseTime">
                    <mat-header-cell *matHeaderCellDef>Response Time</mat-header-cell>
                    <mat-cell *matCellDef="let endpoint">
                      @if (getEndpointResult(endpoint.url)) {
                        <span class="response-time">
                          {{ getEndpointResult(endpoint.url)!.responseTime }}ms
                        </span>
                      } @else {
                        <span class="no-data">-</span>
                      }
                    </mat-cell>
                  </ng-container>

                  <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: displayedColumns;" 
                           [class]="getRowClass(row)"></mat-row>
                </mat-table>
              </div>
            </ng-template>
          </mat-tab>
        }

        <!-- Results Tab -->
        <mat-tab label="All Results" [disabled]="testResults().length === 0">
          <ng-template matTabContent>
            <div class="tab-content">
              <h3>Complete Test Results</h3>
              
              <mat-table [dataSource]="testResults()" class="results-table">
                
                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
                  <mat-cell *matCellDef="let result">
                    <mat-chip [color]="result.available ? 'accent' : 'warn'">
                      <mat-icon>{{ result.available ? 'check_circle' : 'error' }}</mat-icon>
                      {{ result.status }}
                    </mat-chip>
                  </mat-cell>
                </ng-container>

                <!-- Category Column -->
                <ng-container matColumnDef="category">
                  <mat-header-cell *matHeaderCellDef>Category</mat-header-cell>
                  <mat-cell *matCellDef="let result">
                    <mat-chip color="primary">{{ result.endpoint.category }}</mat-chip>
                  </mat-cell>
                </ng-container>

                <!-- Endpoint Column -->
                <ng-container matColumnDef="endpoint">
                  <mat-header-cell *matHeaderCellDef>Endpoint</mat-header-cell>
                  <mat-cell *matCellDef="let result">
                    <div class="endpoint-info">
                      <strong>{{ result.endpoint.name }}</strong>
                      <div class="endpoint-url">{{ result.endpoint.method }} {{ result.endpoint.url }}</div>
                    </div>
                  </mat-cell>
                </ng-container>

                <!-- Response Time Column -->
                <ng-container matColumnDef="responseTime">
                  <mat-header-cell *matHeaderCellDef>Response Time</mat-header-cell>
                  <mat-cell *matCellDef="let result">
                    <span [class]="getResponseTimeClass(result.responseTime)">
                      {{ result.responseTime }}ms
                    </span>
                  </mat-cell>
                </ng-container>

                <!-- Error Column -->
                <ng-container matColumnDef="error">
                  <mat-header-cell *matHeaderCellDef>Error</mat-header-cell>
                  <mat-cell *matCellDef="let result">
                    @if (result.error) {
                      <span class="error-message" [matTooltip]="result.error">
                        {{ truncateError(result.error) }}
                      </span>
                    } @else {
                      <span class="no-error">-</span>
                    }
                  </mat-cell>
                </ng-container>

                <!-- Tested At Column -->
                <ng-container matColumnDef="testedAt">
                  <mat-header-cell *matHeaderCellDef>Tested At</mat-header-cell>
                  <mat-cell *matCellDef="let result">
                    {{ formatTimestamp(result.testedAt) }}
                  </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="allResultsColumns"></mat-header-row>
                <mat-row *matRowDef="let row; columns: allResultsColumns;" 
                         [class]="getResultRowClass(row)"></mat-row>
              </mat-table>
            </div>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .api-discovery-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 2.5rem;
      font-weight: 300;
    }

    .page-header p {
      color: rgba(0, 0, 0, 0.6);
      font-size: 1.1rem;
      margin: 0;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      min-height: 100px;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-numbers {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      line-height: 1;
    }

    .stat-label {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9rem;
    }

    .action-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .last-test-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9rem;
      margin-left: auto;
    }

    .api-tabs {
      min-height: 600px;
    }

    .tab-content {
      padding: 24px 16px;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .category-card {
      min-height: 200px;
    }

    .category-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .endpoint-count {
      font-weight: 500;
    }

    .category-status {
      display: flex;
      gap: 16px;
      font-size: 0.9rem;
    }

    .available {
      color: #4caf50;
    }

    .unavailable {
      color: #f44336;
    }

    .category-header {
      margin-bottom: 24px;
    }

    .category-header h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
    }

    .category-header p {
      color: rgba(0, 0, 0, 0.6);
      margin: 0 0 16px 0;
    }

    .endpoints-table, .results-table {
      width: 100%;
      margin-top: 16px;
    }

    /* Column width definitions */
    .mat-column-status {
      width: 120px;
      max-width: 120px;
    }

    .mat-column-method {
      width: 100px;
      max-width: 100px;
    }

    .mat-column-name {
      width: 50%;
      min-width: 400px;
    }

    .mat-column-auth {
      width: 140px;
      max-width: 140px;
    }

    .mat-column-responseTime {
      width: 120px;
      max-width: 120px;
    }

    /* Results table specific column widths */
    .mat-column-category {
      width: 120px;
      max-width: 120px;
    }

    .mat-column-endpoint {
      width: 45%;
      min-width: 350px;
    }

    .mat-column-error {
      width: 200px;
      max-width: 200px;
    }

    .mat-column-testedAt {
      width: 140px;
      max-width: 140px;
    }

    .endpoint-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .endpoint-url {
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.6);
      word-break: break-all;
      line-height: 1.4;
    }

    .endpoint-description {
      font-size: 0.85rem;
      color: rgba(0, 0, 0, 0.5);
    }

    .response-time {
      font-family: 'Courier New', monospace;
    }

    .response-time.fast {
      color: #4caf50;
    }

    .response-time.medium {
      color: #ff9800;
    }

    .response-time.slow {
      color: #f44336;
    }

    .no-data, .no-error {
      color: rgba(0, 0, 0, 0.4);
    }

    .error-message {
      color: #f44336;
      font-size: 0.85rem;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .auth-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-direction: column;
    }

    .auth-chip {
      font-size: 0.7rem;
      min-height: 20px;
      line-height: 20px;
    }

    .auth-label {
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.6);
    }

    /* Method column chip styling */
    .mat-column-method mat-chip {
      font-size: 0.75rem;
      min-height: 24px;
      padding: 0 8px;
      font-weight: 600;
      white-space: nowrap;
    }

    .mat-mdc-row.available {
      background-color: rgba(76, 175, 80, 0.05);
    }

    .mat-mdc-row.unavailable {
      background-color: rgba(244, 67, 54, 0.05);
    }

    .mat-mdc-row.not-tested {
      background-color: rgba(158, 158, 158, 0.05);
    }

    mat-spinner {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .api-discovery-container {
        padding: 16px;
      }

      .summary-cards {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .action-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .last-test-info {
        margin-left: 0;
        margin-top: 8px;
      }
    }
  `]
})
export class ApiDiscoveryComponent implements OnInit, OnDestroy {
  private readonly apiDiscoveryService = inject(ApiDiscoveryService);
  private readonly logger = inject(LoggingService);


  // Component state
  public readonly selectedTabIndex = signal<number>(0);

  // Service state (reactive)
  public readonly testResults = this.apiDiscoveryService.testResults;
  public readonly isTestingInProgress = this.apiDiscoveryService.isTestingInProgress;
  public readonly apiCategories = signal<IApiCategory[]>([]);

  // Computed properties
  public readonly testSummary = computed(() => this.apiDiscoveryService.getTestSummary());

  // Table columns
  public readonly displayedColumns = ['status', 'method', 'name', 'auth', 'responseTime'];
  public readonly allResultsColumns = ['status', 'category', 'endpoint', 'responseTime', 'error', 'testedAt'];

  ngOnInit(): void {
    this.logger.info('ApiDiscoveryComponent initialized');
    this.loadApiCategories();
  }

  ngOnDestroy(): void {
    this.logger.info('ApiDiscoveryComponent destroyed');
  }

  private loadApiCategories(): void {
    const categories = this.apiDiscoveryService.getApiCategories();
    this.apiCategories.set(categories);
  }

  public async testAllEndpoints(): Promise<void> {
    try {
      await this.apiDiscoveryService.testAllEndpoints();
      this.showSuccess(`API discovery completed! ${this.testSummary().available}/${this.testSummary().total} endpoints available`);
    } catch (error) {
      this.logger.error('Failed to test all endpoints', error);
      this.showError('Failed to complete API discovery');
    }
  }

  public async testCategory(categoryName: string): Promise<void> {
    try {
      await this.apiDiscoveryService.testCategory(categoryName);
      const categoryResults = this.getCategoryResults(categoryName);
      const available = this.getCategoryAvailable(categoryName);
      this.showSuccess(`${categoryName} testing completed! ${available}/${categoryResults.length} endpoints available`);
    } catch (error) {
      this.logger.error(`Failed to test category ${categoryName}`, error);
      this.showError(`Failed to test ${categoryName} category`);
    }
  }

  public exportResults(): void {
    try {
      const exportData = this.apiDiscoveryService.exportResults();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nuxeo-api-discovery-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      this.showSuccess('Results exported successfully');
    } catch (error) {
      this.logger.error('Failed to export results', error);
      this.showError('Failed to export results');
    }
  }

  public clearResults(): void {
    this.apiDiscoveryService.clearResults();
    this.showInfo('Results cleared');
  }

  public onTabChange(event: any): void {
    this.selectedTabIndex.set(event.index);
  }

  // Helper methods for template
  public getCategoryEndpoints(categoryName: string) {
    const category = this.apiCategories().find(c => c.name === categoryName);
    return category?.endpoints || [];
  }

  public getCategoryResults(categoryName: string): IApiTestResult[] {
    return this.testResults().filter(r => r.endpoint.category === categoryName);
  }

  public getCategoryAvailable(categoryName: string): number {
    return this.getCategoryResults(categoryName).filter(r => r.available).length;
  }

  public getCategoryUnavailable(categoryName: string): number {
    const results = this.getCategoryResults(categoryName);
    return results.length - this.getCategoryAvailable(categoryName);
  }

  public getEndpointResult(url: string): IApiTestResult | undefined {
    return this.testResults().find(r => r.endpoint.url === url);
  }

  public getMethodColor(method: string): string {
    switch (method) {
      case 'GET': return 'primary';
      case 'POST': return 'accent';
      case 'PUT': return 'warn';
      case 'DELETE': return 'warn';
      default: return 'basic';
    }
  }

  public getRowClass(endpoint: any): string {
    const result = this.getEndpointResult(endpoint.url);
    if (!result) return 'not-tested';
    return result.available ? 'available' : 'unavailable';
  }

  public getResultRowClass(result: IApiTestResult): string {
    return result.available ? 'available' : 'unavailable';
  }

  public getResponseTimeClass(responseTime: number): string {
    if (responseTime < 500) return 'response-time fast';
    if (responseTime < 2000) return 'response-time medium';
    return 'response-time slow';
  }

  public truncateError(error: string): string {
    return error.length > 50 ? error.substring(0, 50) + '...' : error;
  }

  public formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  // Notification methods
  private showSuccess(message: string): void {
    console.log('✅ Success:', message);
    this.logger.info(message);
  }

  private showError(message: string): void {
    console.error('❌ Error:', message);
    this.logger.error(message);
  }

  private showInfo(message: string): void {
    console.info('ℹ️ Info:', message);
    this.logger.info(message);
  }
}