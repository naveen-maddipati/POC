import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

import { AutomationOperationsService, AutomationOperationFull as AutomationOperation } from '../../../../../../src/core/services';
import { OperationDetailsDialogComponent } from '../operation-details-dialog/operation-details-dialog.component';

@Component({
  selector: 'app-enterprise-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="enterprise-demo-container">
      <!-- Professional Header -->
      <div class="header-section">
        <div class="title-area">
          <h1 class="page-title">
            <mat-icon class="title-icon">business</mat-icon>
            Enterprise Automation Operations
          </h1>
          <p class="page-subtitle">Comprehensive Nuxeo automation operations explorer</p>
        </div>
        
        <div class="header-actions">
          <button mat-raised-button 
                  color="primary" 
                  (click)="loadOperations()"
                  [disabled]="isLoading()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-section">
        @if (isLoading()) {
          <div class="loading-stats">
            <mat-spinner [diameter]="40"></mat-spinner>
            <span>Loading automation operations...</span>
          </div>
        } @else {
          <div class="stats-grid">
            <mat-card class="stat-card primary">
              <mat-card-content>
                <div class="stat-icon">
                  <mat-icon>functions</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ operationsData().totalCount || operationsData().operations.length }}</div>
                  <div class="stat-label">Total Operations</div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card secondary">
              <mat-card-content>
                <div class="stat-icon">
                  <mat-icon>category</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ operationsData().categories.length }}</div>
                  <div class="stat-label">Categories</div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card success">
              <mat-card-content>
                <div class="stat-icon">
                  <mat-icon>api</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ operationsData().endpoints.length }}</div>
                  <div class="stat-label">API Endpoints</div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card info">
              <mat-card-content>
                <div class="stat-icon">
                  <mat-icon>filter_list</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ filteredOperations().length }}</div>
                  <div class="stat-label">Filtered Results</div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        }
      </div>

      <!-- Search and Filter Controls -->
      <mat-card class="controls-section">
        <mat-card-content>
          <div class="filter-controls">
            <!-- Search Box -->
            <mat-form-field appearance="outline" class="search-input">
              <mat-label>Search operations...</mat-label>
              <input matInput 
                     [ngModel]="searchQuery()" 
                     (ngModelChange)="searchQuery.set($event)"
                     placeholder="Enter operation name, ID, category, or description">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <!-- Category Filter -->
            <mat-form-field appearance="outline" class="category-filter">
              <mat-label>Category</mat-label>
              <mat-select [ngModel]="selectedCategory()" (ngModelChange)="selectedCategory.set($event)">
                <mat-option value="">All Categories</mat-option>
                @for (categoryData of categoriesWithCounts(); track categoryData.name) {
                  <mat-option [value]="categoryData.name">{{ categoryData.name }} ({{ categoryData.count }})</mat-option>
                }
              </mat-select>
              <mat-icon matSuffix>category</mat-icon>
            </mat-form-field>

            <!-- View Style Selector -->
            <mat-form-field appearance="outline" class="view-selector">
              <mat-label>View Style</mat-label>
              <mat-select [(ngModel)]="viewStyle">
                <mat-option value="grid">Grid View</mat-option>
                <mat-option value="list">List View</mat-option>
                <mat-option value="details">Details View</mat-option>
              </mat-select>
              <mat-icon matSuffix>view_module</mat-icon>
            </mat-form-field>

            <!-- Clear Filters -->
            <button mat-button 
                    class="clear-btn"
                    (click)="clearAllFilters()"
                    [disabled]="!hasActiveFilters()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>

          <!-- Category Filters -->
          @if (operationsData().categories.length > 0) {
            <div class="active-filters">
              <span class="filters-label">Quick Category Filters:</span>
              <div class="category-chips">
                @for (categoryWithCount of categoriesWithCounts(); track categoryWithCount.name) {
                  <mat-chip 
                    [class]="selectedCategory() === categoryWithCount.name ? 'selected-category-chip' : 'available-category-chip'"
                    (click)="toggleCategory(categoryWithCount.name)"
                    [removable]="selectedCategory() === categoryWithCount.name"
                    (removed)="clearCategory()">
                    {{ categoryWithCount.name }} ({{ categoryWithCount.count }})
                    @if (selectedCategory() === categoryWithCount.name) {
                      <mat-icon matChipRemove>cancel</mat-icon>
                    }
                  </mat-chip>
                }
              </div>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <!-- Results Section -->
      <div class="results-section">
        @if (!isLoading() && filteredOperations().length > 0) {
          
          <!-- Grid View -->
          @if (viewStyle === 'grid') {
            <div class="grid-view">
              @for (operation of filteredOperations(); track operation.id) {
                <mat-card class="operation-grid-card">
                  <mat-card-header>
                    <mat-card-title>{{ operation.label }}</mat-card-title>
                    <mat-card-subtitle>{{ operation.category }}</mat-card-subtitle>
                  </mat-card-header>
                  
                  <mat-card-content>
                    <p class="operation-desc">{{ operation.description || 'No description available' }}</p>
                    <div class="operation-meta">
                      <mat-chip class="param-chip">{{ operation.params.length }} params</mat-chip>
                      @if (operation.since) {
                        <mat-chip class="since-chip">{{ operation.since }}</mat-chip>
                      }
                    </div>
                    <code class="operation-id">{{ operation.id }}</code>
                  </mat-card-content>

                  <mat-card-actions>
                    <button mat-button color="primary" (click)="viewDetails(operation)">
                      <mat-icon>info</mat-icon>
                      Details
                    </button>
                    <button mat-button (click)="copyOperationId(operation.id)">
                      <mat-icon>content_copy</mat-icon>
                      Copy
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          }

          <!-- List View -->
          @if (viewStyle === 'list') {
            <div class="list-view">
              @for (operation of filteredOperations(); track operation.id) {
                <mat-card class="operation-list-card">
                  <mat-card-content>
                    <div class="list-item-content">
                      <div class="list-item-main">
                        <h3 class="operation-title">{{ operation.label }}</h3>
                        <p class="operation-description">{{ operation.description || 'No description available' }}</p>
                        <div class="operation-metadata">
                          <span class="category-tag">{{ operation.category }}</span>
                          <span class="param-count">{{ operation.params.length }} parameters</span>
                          @if (operation.since) {
                            <span class="since-tag">Since {{ operation.since }}</span>
                          }
                        </div>
                        <code class="operation-code">{{ operation.id }}</code>
                      </div>
                      <div class="list-item-actions">
                        <button mat-raised-button color="primary" (click)="viewDetails(operation)">
                          <mat-icon>launch</mat-icon>
                          View Details
                        </button>
                        <button mat-button (click)="copyOperationId(operation.id)">
                          <mat-icon>content_copy</mat-icon>
                          Copy ID
                        </button>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          }

          <!-- Details View -->
          @if (viewStyle === 'details') {
            <div class="details-view">
              @for (operation of filteredOperations(); track operation.id) {
                <mat-card class="operation-details-card">
                  <mat-card-header>
                    <mat-card-title>{{ operation.label }}</mat-card-title>
                    <mat-card-subtitle>{{ operation.category }} • {{ operation.id }}</mat-card-subtitle>
                    <div class="header-actions">
                      <mat-chip class="param-badge">{{ operation.params.length }} parameters</mat-chip>
                    </div>
                  </mat-card-header>
                  
                  <mat-card-content>
                    <div class="details-content">
                      <div class="description-section">
                        <h4><mat-icon>description</mat-icon> Description</h4>
                        <p>{{ operation.description || 'No description available' }}</p>
                      </div>

                      @if (operation.params.length > 0) {
                        <div class="params-section">
                          <h4><mat-icon>settings</mat-icon> Parameters</h4>
                          <div class="params-list">
                            @for (param of operation.params.slice(0, 3); track param.name) {
                              <div class="param-item">
                                <span class="param-name">{{ param.name }}</span>
                                <span class="param-type">{{ param.type }}</span>
                                <mat-chip [class]="param.required ? 'required' : 'optional'">
                                  {{ param.required ? 'Required' : 'Optional' }}
                                </mat-chip>
                              </div>
                            }
                            @if (operation.params.length > 3) {
                              <div class="more-params">
                                <mat-icon>more_horiz</mat-icon>
                                {{ operation.params.length - 3 }} more parameters
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </mat-card-content>

                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="viewDetails(operation)">
                      <mat-icon>launch</mat-icon>
                      View Full Details
                    </button>
                    <button mat-button (click)="copyOperationId(operation.id)">
                      <mat-icon>content_copy</mat-icon>
                      Copy ID
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          }
          
        } @else if (hasError()) {
          <!-- Error State with Retry -->
          <mat-card class="error-state">
            <mat-card-content>
              <div class="error-content">
                <mat-icon class="error-icon">cloud_off</mat-icon>
                <h3>Failed to Load Operations</h3>
                <p class="error-message">{{ errorMessage() }}</p>
                <p class="error-description">
                  Unable to connect to Nuxeo server at <code>http://localhost:8080/nuxeo/site/automation</code>
                </p>
                <div class="error-actions">
                  <button mat-raised-button color="primary" (click)="loadOperations()" [disabled]="isLoading()">
                    <mat-icon>refresh</mat-icon>
                    Retry Connection
                  </button>
                  <button mat-button color="accent" (click)="openNuxeoServer()">
                    <mat-icon>launch</mat-icon>
                    Open Nuxeo Server
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          
        } @else if (!isLoading() && filteredOperations().length === 0) {
          <!-- No Results -->
          <mat-card class="no-results">
            <mat-card-content>
              <div class="no-results-content">
                <mat-icon class="no-results-icon">search_off</mat-icon>
                <h3>No operations found</h3>
                <p>No operations match your current filter criteria</p>
                <button mat-raised-button color="primary" (click)="clearAllFilters()">
                  <mat-icon>clear</mat-icon>
                  Clear All Filters
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .enterprise-demo-container {
      padding: 24px;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .title-area {
      flex: 1;
    }

    .page-title {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #3b82f6;
    }

    .page-subtitle {
      margin: 8px 0 0 0;
      color: #64748b;
      font-size: 16px;
      line-height: 1.5;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .stats-section {
      margin-bottom: 32px;
    }

    .loading-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 48px;
      color: #64748b;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .stat-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
      border-left: 4px solid;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .stat-card.primary { border-left-color: #3b82f6; }
    .stat-card.secondary { border-left-color: #6b7280; }
    .stat-card.success { border-left-color: #059669; }
    .stat-card.info { border-left-color: #0891b2; }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px !important;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-card.primary .stat-icon { background: rgba(59,130,246,0.1); color: #3b82f6; }
    .stat-card.secondary .stat-icon { background: rgba(107,114,128,0.1); color: #6b7280; }
    .stat-card.success .stat-icon { background: rgba(5,150,105,0.1); color: #059669; }
    .stat-card.info .stat-icon { background: rgba(8,145,178,0.1); color: #0891b2; }

    .stat-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }

    .stat-label {
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      margin-top: 4px;
    }

    .controls-section {
      margin-bottom: 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .filter-controls {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: center;
    }

    .search-input {
      min-width: 0;
    }

    .clear-btn {
      height: 56px;
      margin-top: 8px;
    }

    .active-filters {
      margin-top: 20px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .filters-label {
      color: #495057;
      font-weight: 500;
      font-size: 14px;
      margin-right: 8px;
    }

    .category-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .selected-category-chip {
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
      border: 1px solid #1976d2 !important;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .selected-category-chip:hover {
      background-color: #bbdefb !important;
      color: #1565c0 !important;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
    }

    .available-category-chip {
      background-color: #ffffff !important;
      color: #495057 !important;
      border: 1px solid #dee2e6 !important;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .available-category-chip:hover {
      background-color: #e9ecef !important;
      color: #1976d2 !important;
      border-color: #1976d2 !important;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .results-section {
      min-height: 400px;
    }

    .grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    .operation-grid-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
      border-left: 4px solid #3b82f6;
    }

    .operation-grid-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .operation-desc {
      color: #64748b;
      margin: 12px 0;
      line-height: 1.5;
      min-height: 40px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .operation-meta {
      display: flex;
      gap: 8px;
      margin: 12px 0;
      flex-wrap: wrap;
    }

    .param-chip {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .since-chip {
      background-color: #f3f4f6;
      color: #374151;
    }

    .operation-id {
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
      font-size: 12px;
      color: #475569;
      display: inline-block;
      margin-top: 8px;
    }

    .list-view {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .operation-list-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-left: 4px solid #3b82f6;
    }

    .list-item-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
    }

    .list-item-main {
      flex: 1;
    }

    .operation-title {
      margin: 0 0 8px 0;
      color: #1e293b;
      font-size: 18px;
      font-weight: 600;
    }

    .operation-description {
      margin: 0 0 12px 0;
      color: #64748b;
      line-height: 1.5;
    }

    .operation-metadata {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .category-tag {
      background: #e0f2fe;
      color: #01579b;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .param-count {
      background: #f3e5f5;
      color: #4a148c;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .since-tag {
      background: #f1f8e9;
      color: #33691e;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .operation-code {
      background: #f8fafc;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
      font-size: 12px;
      color: #475569;
    }

    .list-item-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 160px;
    }

    .details-view {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .operation-details-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-left: 4px solid #3b82f6;
    }

    .header-actions {
      margin-left: auto;
    }

    .param-badge {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .details-content {
      display: grid;
      gap: 24px;
    }

    .description-section h4,
    .params-section h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px 0;
      color: #374151;
      font-size: 16px;
    }

    .params-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .param-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .param-name {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
      font-weight: 600;
      color: #1e293b;
    }

    .param-type {
      color: #64748b;
      font-size: 14px;
    }

    .param-item .required {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .param-item .optional {
      background-color: #f0fdf4;
      color: #16a34a;
    }

    .more-params {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-style: italic;
      padding: 8px 12px;
    }

    .no-results {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .no-results-content {
      text-align: center;
      padding: 48px 24px;
    }

    .no-results-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .no-results h3 {
      margin: 0 0 8px 0;
      color: #374151;
    }

    .no-results p {
      margin: 0 0 24px 0;
      color: #64748b;
    }

    .error-state {
      margin: 40px auto;
      max-width: 600px;
      text-align: center;
      border: 2px solid #f44336;
      background-color: #ffebee;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);
    }

    .error-content {
      padding: 48px 24px;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .error-content h3 {
      color: #d32f2f;
      margin: 0 0 12px 0;
    }

    .error-message {
      color: #f44336;
      font-weight: 500;
      margin: 0 0 16px 0;
    }

    .error-description {
      color: #666;
      line-height: 1.5;
      margin: 0 0 24px 0;
    }

    .error-description code {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.9em;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .enterprise-demo-container {
        padding: 16px;
      }

      .header-section {
        flex-direction: column;
        gap: 16px;
      }

      .page-title {
        font-size: 24px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .filter-controls {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .grid-view {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .list-item-content {
        flex-direction: column;
        gap: 16px;
      }

      .list-item-actions {
        flex-direction: row;
        min-width: auto;
      }
    }
  `]
})
export class EnterpriseDemoComponent implements OnInit {
  private readonly operationsService = inject(AutomationOperationsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly operationsData = signal<{ operations: AutomationOperation[], categories: string[], totalCount: number, endpoints: string[] }>({
    operations: [],
    categories: [],
    totalCount: 0,
    endpoints: []
  });
  readonly isLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  
  readonly searchQuery = signal('');
  readonly selectedCategory = signal('');
  viewStyle = 'grid';

  readonly filteredOperations = computed(() => {
    const operations = this.operationsData().operations;
    let filtered = operations;

    if (this.searchQuery().trim()) {
      const query = this.searchQuery().toLowerCase().trim();
      filtered = filtered.filter((op: AutomationOperation) => 
        op.label.toLowerCase().includes(query) ||
        op.id.toLowerCase().includes(query) ||
        op.category.toLowerCase().includes(query) ||
        (op.description && op.description.toLowerCase().includes(query))
      );
    }

    if (this.selectedCategory()) {
      filtered = filtered.filter((op: AutomationOperation) => op.category === this.selectedCategory());
    }

    return filtered;
  });

  readonly categoriesWithCounts = computed(() => {
    const operations = this.operationsData().operations;
    const counts = new Map<string, number>();
    
    // Count operations per category
    operations.forEach(op => {
      counts.set(op.category, (counts.get(op.category) || 0) + 1);
    });
    
    // Return categories with their counts
    return this.operationsData().categories.map(category => ({
      name: category,
      count: counts.get(category) || 0
    }));
  });

  ngOnInit() {
    this.loadOperations();
    
    this.operationsService.loading$.subscribe(loading => {
      this.isLoading.set(loading);
    });
    
    this.operationsService.operations$.subscribe(data => {
      if (data) {
        this.operationsData.set(data);
        this.hasError.set(false);
        this.errorMessage.set('');
      }
    });

    this.operationsService.error$.subscribe(error => {
      if (error) {
        this.hasError.set(true);
        this.errorMessage.set(error);
      } else {
        this.hasError.set(false);
        this.errorMessage.set('');
      }
    });
  }

  loadOperations() {
    this.operationsService.loadAutomationOperations().subscribe();
  }

  openNuxeoServer() {
    window.open('http://localhost:8080/nuxeo', '_blank');
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery() || this.selectedCategory());
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  clearCategory() {
    this.selectedCategory.set('');
  }

  toggleCategory(category: string) {
    if (this.selectedCategory() === category) {
      // If clicking the already selected category, clear it
      this.selectedCategory.set('');
    } else {
      // Select the new category
      this.selectedCategory.set(category);
    }
  }

  clearAllFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('');
  }

  viewDetails(operation: AutomationOperation) {
    const dialogRef = this.dialog.open(OperationDetailsDialogComponent, {
      data: operation,
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'operation-details-dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after dialog closes if needed
    });
  }

  copyOperationId(operationId: string) {
    navigator.clipboard.writeText(operationId).then(() => {
      this.snackBar.open(`Operation ID copied: ${operationId}`, 'Close', {
        duration: 2000
      });
    });
  }
}
