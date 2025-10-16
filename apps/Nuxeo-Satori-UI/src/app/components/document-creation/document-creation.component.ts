import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-document-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule
  ],
  template: `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px; color: #1976d2;">
        Document Creation
      </h1>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Document</mat-card-title>
          <mat-card-subtitle>Use Nuxeo automation to create documents</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content style="padding: 20px;">
          @if (loading()) {
            <mat-progress-bar mode="indeterminate" style="margin-bottom: 16px;"></mat-progress-bar>
          }
          <form [formGroup]="documentForm" (ngSubmit)="createDocument()" style="display: grid; gap: 16px;">
            <mat-form-field appearance="outline">
              <mat-label>Document Type</mat-label>
              <mat-select formControlName="type" required>
                <mat-option value="File">File</mat-option>
                <mat-option value="Folder">Folder</mat-option>
                <mat-option value="Note">Note</mat-option>
                <mat-option value="Picture">Picture</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Document Name</mat-label>
              <input matInput formControlName="name" required placeholder="Enter document name">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter document title">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Enter description"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Parent Path</mat-label>
              <input matInput formControlName="parentPath" placeholder="/default-domain/workspaces">
            </mat-form-field>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button mat-button type="button" (click)="resetForm()" [disabled]="loading()">Reset</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!documentForm.valid || loading()">
                <mat-icon>{{ loading() ? 'hourglass_empty' : 'add' }}</mat-icon>
                {{ loading() ? 'Creating...' : 'Create Document' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      @if (creationResult()) {
        <mat-card style="margin-top: 20px;">
          <mat-card-content style="padding: 20px;">
            <h3 style="color: #388e3c; margin: 0 0 12px 0;">✓ Document Created Successfully</h3>
            <pre style="background: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto;">{{ creationResult() | json }}</pre>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `
})
export class DocumentCreationComponent {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly creationResult = signal<{
    id: string;
    type: string;
    name: string;
    title: string;
    description?: string | undefined;
    parentPath: string;
    created: string;
    status: string;
    path?: string | undefined;
    state?: string | undefined;
  } | null>(null);
  readonly loading = signal<boolean>(false);

  readonly documentForm = this.fb.group({
    type: ['File', Validators.required],
    name: ['', Validators.required],
    title: [''],
    description: [''],
    parentPath: ['/default-domain/workspaces']
  });

  createDocument() {
    if (!this.documentForm.valid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000
      });
      return;
    }

    this.loading.set(true);
    this.creationResult.set(null);

    const formValue = this.documentForm.value;
    
    // Prepare the Nuxeo automation request payload (based on actual API spec)
    const automationPayload = {
      params: {
        type: formValue.type,
        name: formValue.name,
        properties: `dc:title=${formValue.title || formValue.name}\ndc:description=${formValue.description || ''}`
      },
      input: `doc:${formValue.parentPath || '/default-domain/workspaces'}`,
      context: {}
    };

    console.log('Creating document with payload:', automationPayload);

    // Get authentication header from UserService (same pattern as document.service.ts)
    const authHeader = this.userService.getBasicAuthHeader();
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log('Using authentication from UserService');
    } else {
      // Fallback to default credentials for development (same as document.service.ts)
      const credentials = btoa('Administrator:Administrator');
      headers['Authorization'] = `Basic ${credentials}`;
      console.log('No user authentication found, using fallback credentials');
    }
    
    // Make the actual API call to Nuxeo automation endpoint (using correct API path)
    this.http.post<{
      uid?: string;
      id?: string;
      type?: string;
      title?: string;
      'dc:description'?: string;
      parentRef?: string;
      created?: string;
      path?: string;
      state?: string;
    }>('http://localhost:8080/nuxeo/api/v1/automation/Document.Create', automationPayload, {
      headers
    }).pipe(
      catchError(error => {
        console.error('Document creation failed:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          errorBody: error.error,
          url: error.url
        });
        
        let errorMessage = 'Failed to create document: ';
        if (error.status === 500) {
          errorMessage += 'Server error - check Nuxeo server logs and payload format';
        } else if (error.status === 401) {
          errorMessage += 'Authentication failed';
        } else if (error.status === 403) {
          errorMessage += 'Permission denied';
        } else {
          errorMessage += error.error?.message || error.message || 'Network error';
        }
        
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000
        });
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe(response => {
      if (response) {
        console.log('Document created successfully:', response);
        
        const result = {
          id: response.uid || response.id || 'Unknown ID',
          type: response.type || formValue.type || 'File',
          name: response.title || formValue.name || 'Untitled',
          title: response.title || formValue.title || formValue.name || 'Untitled',
          description: response['dc:description'] || formValue.description || undefined,
          parentPath: response.parentRef || formValue.parentPath || '/default-domain/workspaces',
          created: response.created || new Date().toISOString(),
          status: 'created' as const,
          path: response.path,
          state: response.state
        };

        this.creationResult.set(result);
        this.snackBar.open('Document created successfully!', 'Close', {
          duration: 3000
        });
        
        // Reset form after successful creation
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.documentForm.reset({
      type: 'File',
      name: '',
      title: '',
      description: '',
      parentPath: '/default-domain/workspaces'
    });
    this.creationResult.set(null);
    this.loading.set(false);
  }
}