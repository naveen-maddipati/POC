import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { AutomationOperation } from '../../core/services/automation-operations.service';

@Component({
  selector: 'app-operation-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatCardModule
  ],
  template: `
    <div class="dialog-header">
      <h1 mat-dialog-title>
        <mat-icon>business</mat-icon>
        {{ data.label }}
      </h1>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div mat-dialog-content class="dialog-content">
      <mat-tab-group>
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="tab-content">
            <mat-card class="info-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>info</mat-icon>
                  Basic Information
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Internal ID:</span>
                    <span class="value">{{ data.id }}</span>
                    <button mat-icon-button (click)="copyToClipboard(data.id)" title="Copy Internal ID">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="info-item">
                    <span class="label">Operation Name:</span>
                    <span class="value">{{ getOperationName() }}</span>
                    <button mat-icon-button (click)="copyToClipboard(getOperationName())" title="Copy Operation Name">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="info-item">
                    <span class="label">Category:</span>
                    <mat-chip class="category-chip">{{ data.category }}</mat-chip>
                  </div>
                  <div class="info-item">
                    <span class="label">Since Version:</span>
                    <span class="value">{{ data.since || 'Unknown' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">URL Endpoint:</span>
                    <span class="value url">{{ getCorrectEndpointUrl() }}</span>
                    <button mat-icon-button (click)="copyToClipboard(getCorrectEndpointUrl())" title="Copy URL">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                </div>
                
                @if (data.description) {
                  <mat-divider></mat-divider>
                  <div class="description-section">
                    <h4><mat-icon>description</mat-icon> Description</h4>
                    <p class="description">{{ data.description }}</p>
                  </div>
                }

                @if (data.aliases && data.aliases.length > 0) {
                  <mat-divider></mat-divider>
                  <div class="aliases-section">
                    <h4><mat-icon>alternate_email</mat-icon> Aliases</h4>
                    <div class="aliases-list">
                      @for (alias of data.aliases; track alias) {
                        <mat-chip class="alias-chip">{{ alias }}</mat-chip>
                      }
                    </div>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Signature Tab -->
        <mat-tab label="Signature">
          <div class="tab-content">
            <mat-card class="signature-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>code</mat-icon>
                  Operation Signature
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @if (data.signature && data.signature.length > 0) {
                  <div class="signature-section">
                    <h4>Input/Output Types</h4>
                    <div class="signature-list">
                      @for (sig of data.signature; track sig; let i = $index) {
                        <div class="signature-item">
                          <div class="signature-step">
                            <mat-icon>{{ i === 0 ? 'input' : 'output' }}</mat-icon>
                            <span class="step-label">{{ i === 0 ? 'Input' : 'Output' }}</span>
                          </div>
                          <div class="signature-type">
                            <code>{{ sig }}</code>
                          </div>
                        </div>
                        @if (i < data.signature.length - 1) {
                          <mat-icon class="arrow-icon">arrow_downward</mat-icon>
                        }
                      }
                    </div>
                  </div>
                } @else {
                  <div class="no-signature">
                    <mat-icon>code_off</mat-icon>
                    <p>No signature information available</p>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Parameters Tab -->
        <mat-tab [label]="'Parameters (' + data.params.length + ')'">
          <div class="tab-content">
            @if (data.params.length > 0) {
              <mat-accordion>
                @for (param of data.params; track param.name) {
                  <mat-expansion-panel>
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <div class="param-header">
                          <span class="param-name">{{ param.name }}</span>
                          <mat-chip [class]="param.required ? 'required-chip' : 'optional-chip'">
                            {{ param.required ? 'Required' : 'Optional' }}
                          </mat-chip>
                        </div>
                      </mat-panel-title>
                      <mat-panel-description>
                        <code class="param-type">{{ param.type }}</code>
                      </mat-panel-description>
                    </mat-expansion-panel-header>
                    
                    <div class="param-details">
                      <div class="param-info">
                        <div class="param-meta">
                          <div class="meta-item">
                            <span class="meta-label">Type:</span>
                            <code class="meta-value">{{ param.type }}</code>
                          </div>
                          <div class="meta-item">
                            <span class="meta-label">Required:</span>
                            <span class="meta-value">{{ param.required ? 'Yes' : 'No' }}</span>
                          </div>
                        </div>
                        
                        @if (param.description) {
                          <div class="param-description">
                            <h5>Description</h5>
                            <p>{{ param.description }}</p>
                          </div>
                        } @else {
                          <div class="no-description">
                            <em>No description available for this parameter</em>
                          </div>
                        }
                      </div>
                    </div>
                  </mat-expansion-panel>
                }
              </mat-accordion>
            } @else {
              <mat-card class="no-params-card">
                <mat-card-content>
                  <div class="no-params">
                    <mat-icon>settings_off</mat-icon>
                    <h3>No Parameters</h3>
                    <p>This operation does not require any parameters</p>
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </mat-tab>

        <!-- Usage Tab -->
        <mat-tab label="Usage">
          <div class="tab-content">
            <mat-card class="usage-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>integration_instructions</mat-icon>
                  How to Use This Operation
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="usage-section">
                  <h4>REST API Endpoint</h4>
                  <div class="code-block">
                    <code>POST {{ getCorrectEndpointUrl() }}</code>
                    <button mat-icon-button (click)="copyToClipboard('POST ' + getCorrectEndpointUrl())" title="Copy endpoint">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="usage-section">
                  <h4>Example Request Body</h4>
                  <div class="code-block">
                    <pre><code>{{getExampleRequestBody()}}</code></pre>
                    <button mat-icon-button (click)="copyToClipboard(getExampleRequestBody())" title="Copy example">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                </div>

                @if (data.params.length > 0) {
                  <mat-divider></mat-divider>
                  <div class="usage-section">
                    <h4>Required Parameters</h4>
                    <mat-list>
                      @for (param of getRequiredParams(); track param.name) {
                        <mat-list-item>
                          <mat-icon matListItemIcon>{{ param.required ? 'star' : 'star_border' }}</mat-icon>
                          <div matListItemTitle>{{ param.name }}</div>
                          <div matListItemLine>{{ param.type }} - {{ param.description || 'No description' }}</div>
                        </mat-list-item>
                      }
                    </mat-list>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Raw JSON Tab -->
        <mat-tab label="Raw JSON">
          <div class="tab-content">
            <mat-card class="json-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>code</mat-icon>
                  Complete Operation Data
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="json-section">
                  <div class="json-header">
                    <h4>Raw JSON Response</h4>
                    <button mat-icon-button (click)="copyToClipboard(getRawJsonString())" title="Copy JSON">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="json-container">
                    <pre class="json-display"><code>{{ getRawJsonString() }}</code></pre>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="copyToClipboard(getOperationName())">
        <mat-icon>content_copy</mat-icon>
        Copy Operation Name
      </button>
      <button mat-button (click)="copyToClipboard(getCorrectEndpointUrl())">
        <mat-icon>link</mat-icon>
        Copy Endpoint URL
      </button>
      <button mat-raised-button color="primary" mat-dialog-close>
        <mat-icon>close</mat-icon>
        Close
      </button>
    </div>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #1976d2;
    }

    .dialog-content {
      padding: 0;
      min-height: 400px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .tab-content {
      padding: 24px;
    }

    .info-card, .signature-card, .usage-card, .no-params-card, .json-card {
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .json-section {
      margin-bottom: 24px;
    }

    .json-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .json-header h4 {
      margin: 0;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .json-container {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #f8f9fa;
    }

    .json-display {
      margin: 0;
      padding: 16px;
      font-family: 'Roboto Mono', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      white-space: pre-wrap;
      word-break: break-word;
      background: transparent;
    }

    .info-grid {
      display: grid;
      gap: 16px;
      margin-bottom: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .label {
      font-weight: 500;
      color: #666;
      min-width: 120px;
    }

    .value {
      font-family: 'Roboto Mono', monospace;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
      flex: 1;
    }

    .value.url {
      word-break: break-all;
    }

    .category-chip {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .description-section, .aliases-section {
      margin-top: 16px;
    }

    .description-section h4, .aliases-section h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: #333;
    }

    .description {
      line-height: 1.6;
      color: #666;
      margin: 0;
    }

    .aliases-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .alias-chip {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .signature-section h4 {
      margin-bottom: 16px;
      color: #333;
    }

    .signature-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .signature-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #1976d2;
    }

    .signature-step {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 100px;
    }

    .step-label {
      font-weight: 500;
      color: #1976d2;
    }

    .signature-type code {
      background: #e8f5e8;
      color: #2e7d32;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .arrow-icon {
      color: #666;
      align-self: center;
      margin: 8px 0;
    }

    .no-signature, .no-params {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-signature mat-icon, .no-params mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .param-header {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .param-name {
      font-weight: 500;
      color: #333;
    }

    .required-chip {
      background-color: #ffebee;
      color: #c62828;
      font-size: 11px;
    }

    .optional-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
      font-size: 11px;
    }

    .param-type {
      background: #f5f5f5;
      color: #666;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
    }

    .param-details {
      padding: 16px 0;
    }

    .param-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .meta-label {
      font-weight: 500;
      color: #666;
    }

    .meta-value {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Roboto Mono', monospace;
      font-size: 12px;
    }

    .param-description h5 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .param-description p {
      margin: 0;
      line-height: 1.5;
      color: #666;
    }

    .no-description {
      color: #999;
      font-style: italic;
    }

    .usage-section {
      margin-bottom: 24px;
    }

    .usage-section h4 {
      margin-bottom: 12px;
      color: #333;
    }

    .code-block {
      position: relative;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 12px;
      font-family: 'Roboto Mono', monospace;
      font-size: 14px;
    }

    .code-block button {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .code-block pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    ::ng-deep .mat-mdc-tab-group {
      --mat-tab-header-active-label-text-color: #1976d2;
      --mat-tab-header-inactive-label-text-color: #666;
    }

    ::ng-deep .mat-mdc-dialog-container {
      --mdc-dialog-container-max-width: 800px;
      --mdc-dialog-container-min-width: 600px;
    }
  `]
})
export class OperationDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OperationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AutomationOperation
  ) {}

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast or other feedback here
    });
  }

  getRequiredParams() {
    return this.data.params.filter(param => param.required);
  }

  getOperationName(): string {
    // Use the user-friendly label instead of the technical ID
    return this.data.label || this.data.id || 'Unknown Operation';
  }

  getCorrectEndpointUrl(): string {
    // Use the actual operation ID directly from the API response
    // This is the real operation ID that comes from http://localhost:8080/nuxeo/site/automation
    const operationId = this.data.id || 'Unknown.Operation';
    return `/nuxeo/api/v1/automation/${operationId}`;
  }

  getExampleRequestBody(): string {
    const params: any = {};
    
    this.data.params.forEach(param => {
      if (param.required) {
        switch (param.type.toLowerCase()) {
          case 'string':
            params[param.name] = `"example_${param.name}"`;
            break;
          case 'boolean':
            params[param.name] = true;
            break;
          case 'integer':
          case 'long':
            params[param.name] = 0;
            break;
          case 'document':
            params[param.name] = `"doc:${param.name}"`;
            break;
          default:
            params[param.name] = `"${param.type.toLowerCase()}_value"`;
        }
      }
    });

    return JSON.stringify({
      "input": "doc:input",
      "params": params
    }, null, 2);
  }

  getRawJsonString(): string {
    return JSON.stringify(this.data, null, 2);
  }
}