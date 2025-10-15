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
    MatFormFieldModule
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
              <button mat-button type="button" (click)="resetForm()">Reset</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!documentForm.valid">
                <mat-icon>add</mat-icon>
                Create Document
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
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly creationResult = signal<any>(null);

  readonly documentForm = this.fb.group({
    type: ['File', Validators.required],
    name: ['', Validators.required],
    title: [''],
    description: [''],
    parentPath: ['/default-domain/workspaces']
  });

  createDocument() {
    if (this.documentForm.valid) {
      const formValue = this.documentForm.value;
      
      const mockResult = {
        id: 'doc-' + Date.now(),
        type: formValue.type,
        name: formValue.name,
        title: formValue.title || formValue.name,
        description: formValue.description,
        parentPath: formValue.parentPath,
        created: new Date().toISOString(),
        status: 'created'
      };

      this.creationResult.set(mockResult);
      this.snackBar.open('Document created successfully!', 'Close', {
        duration: 3000
      });
    }
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
  }
}