import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserService, AuthMethod } from '../../../../../../src/core/services/user.service';

/**
 * Login Modal Component
 * Provides authentication interface for different auth methods
 */
@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-modal">
      <h2 mat-dialog-title>
        <mat-icon>login</mat-icon>
        Sign In to Nuxeo
      </h2>
      
      <mat-dialog-content>
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Authentication Method</mat-label>
            <mat-select [(ngModel)]="authMethod" name="authMethod">
              <mat-option value="basic">Basic Authentication</mat-option>
              <mat-option value="mock">Mock (Development)</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input 
              matInput 
              [(ngModel)]="username" 
              name="username"
              placeholder="Enter your username"
              required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input 
              matInput 
              [type]="hidePassword ? 'password' : 'text'"
              [(ngModel)]="password" 
              name="password"
              placeholder="Enter your password"
              required>
            <button 
              mat-icon-button 
              matSuffix 
              type="button"
              (click)="hidePassword = !hidePassword">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
          </mat-form-field>

          @if (authMethod === 'basic') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nuxeo Server URL</mat-label>
              <mat-icon matPrefix>cloud</mat-icon>
              <input 
                matInput 
                [(ngModel)]="serverUrl" 
                name="serverUrl"
                placeholder="http://localhost:8080/nuxeo">
            </mat-form-field>
          }

          @if (errorMessage()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              {{ errorMessage() }}
            </div>
          }
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="login()"
          [disabled]="isLoading() || !username || !password">
          @if (isLoading()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            <mat-icon>login</mat-icon>
          }
          Sign In
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .login-modal {
      width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      color: #1976d2;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      background-color: #ffebee;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      padding-top: 20px;
      gap: 12px;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class LoginModalComponent {
  private readonly userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<LoginModalComponent>);

  // Form data
  public username = 'Administrator';
  public password = 'Administrator';
  public authMethod: AuthMethod = 'basic';
  public serverUrl = 'http://localhost:8080/nuxeo/api/v1/me';
  public hidePassword = true;

  // State signals
  public readonly isLoading = this.userService.isLoading;
  public readonly errorMessage = signal<string>('');

  /**
   * Attempt to login with provided credentials
   */
  public async login(): Promise<void> {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter both username and password');
      return;
    }

    this.errorMessage.set('');

    try {
      let success = false;

      if (this.authMethod === 'basic') {
        success = await this.userService.loginWithBasicAuth(
          this.username, 
          this.password, 
          this.serverUrl
        );
      } else {
        success = await this.userService.login({
          username: this.username,
          password: this.password,
          method: this.authMethod
        });
      }

      if (success) {
        this.dialogRef.close(true);
      } else {
        this.errorMessage.set('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage.set('Login failed. Please check your credentials and server connection.');
    }
  }

  /**
   * Cancel login and close modal
   */
  public cancel(): void {
    this.dialogRef.close(false);
  }
}