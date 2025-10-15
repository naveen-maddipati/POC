import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { SatPlatformNavModule } from '@hylandsoftware/satori-ui/platform-nav';
import { SatAppHeaderModule } from '@hylandsoftware/satori-ui/app-header';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SatNavigationItem } from '@hylandsoftware/satori-ui/platform-nav';
import { UserService } from '../../../../../../src/core/services/user.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

/**
 * Platform Layout Component using Satori UI Platform Navigation
 * Provides the main application layout with sidebar navigation
 */
@Component({
  selector: 'app-platform-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    SatPlatformNavModule,
    SatAppHeaderModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule
  ],
  template: `
    <!-- Satori App Header -->
    <sat-app-header>
      <h2 satAppHeaderTitle>POC Enterprise Workspace</h2>
      <div satAppHeaderLogo>
        <mat-icon>business</mat-icon>
      </div>
      <div satAppHeaderActions>
        @if (isAuthenticated()) {
          <button mat-icon-button [matMenuTriggerFor]="userMenu" matTooltip="User Menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Settings">
            <mat-icon>settings</mat-icon>
          </button>
        } @else {
          <button mat-raised-button color="primary" (click)="openLoginDialog()">
            <mat-icon>login</mat-icon>
            Sign In
          </button>
        }
      </div>
      <nav mat-tab-nav-bar satAppHeaderNavigation [tabPanel]="tabPanel" mat-stretch-tabs="false">
        @for (item of navigationItems; track item.path) {
          <a mat-tab-link 
             [routerLink]="item.path" 
             [active]="isActive(item.path)">
            {{ item.label }}
          </a>
        }
      </nav>
    </sat-app-header>

    <div #tabPanel></div>

    <sat-platform-nav-container>
      <sat-platform-nav>
        <!-- Navigation Items -->
        @for (item of navigationItems; track item.path) {
          <sat-platform-nav-list-item 
            [active]="isActive(item.path)"
            (click)="navigateTo(item.path)">
            <sat-platform-nav-avatar [item]="item"></sat-platform-nav-avatar>
            {{ item.label }}
          </sat-platform-nav-list-item>
        }
        
        <!-- User Section -->
        <sat-platform-nav-user>
          <sat-platform-nav-user-profile [matMenuTriggerFor]="userMenu">
            {{ userDisplayName() }}
          </sat-platform-nav-user-profile>
          <mat-menu #userMenu="matMenu" satPlatformNavUserMenu>
            @if (isAuthenticated()) {
              <button mat-menu-item (click)="viewProfile()">
                <mat-icon>account_circle</mat-icon>
                View Profile
              </button>
              <button mat-menu-item (click)="openSettings()">
                <mat-icon>settings</mat-icon>
                Settings
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                Sign Out
              </button>
            } @else {
              <button mat-menu-item (click)="openLoginDialog()">
                <mat-icon>login</mat-icon>
                Sign In
              </button>
            }
          </mat-menu>
        </sat-platform-nav-user>
      </sat-platform-nav>
      
      <!-- Main Content Area -->
      <sat-platform-nav-main-content>
        <router-outlet></router-outlet>
      </sat-platform-nav-main-content>
    </sat-platform-nav-container>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
    }

    sat-app-header {
      flex-shrink: 0;
      z-index: 1000;
    }

    sat-platform-nav-container {
      flex: 1;
      width: 100%;
      height: calc(100vh - 120px); /* Adjust based on header height */
    }

    sat-platform-nav-list-item {
      cursor: pointer;
    }

    sat-platform-nav-main-content {
      padding: 24px;
      overflow-y: auto;
    }

    /* Custom header styling */
    [satAppHeaderLogo] {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    [satAppHeaderActions] {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    [satAppHeaderNavigation] {
      background: transparent;
      
      .mat-mdc-tab-link {
        min-width: 120px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  `]
})
export class PlatformLayoutComponent {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  /**
   * Current user computed from UserService
   */
  public readonly currentUser = computed(() => {
    const user = this.userService.currentUser();
    if (!user) {
      return {
        label: 'Guest User',
        path: '/profile',
        icon: 'account_circle',
        active: false
      } as SatNavigationItem;
    }
    
    return {
      label: user.name,
      path: '/profile',
      icon: 'account_circle',
      active: false
    } as SatNavigationItem;
  });

  /**
   * User display name for the UI
   */
  public readonly userDisplayName = this.userService.userDisplayName;

  /**
   * Check if user is authenticated
   */
  public readonly isAuthenticated = this.userService.isAuthenticated;

  /**
   * Navigation items for the sidebar
   */
  public readonly navigationItems: SatNavigationItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      active: false
    },
    {
      label: 'Nuxeo Integration',
      path: '/welcome',
      icon: 'cloud',
      active: false
    },
    {
      label: 'API Discovery',
      path: '/api-discovery',
      icon: 'search',
      active: false
    },
    {
      label: 'Enterprise Demo',
      path: '/enterprise-demo',
      icon: 'business',
      active: false
    }
  ];

  /**
   * Navigate to the specified path
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  /**
   * Check if the current route is active
   */
  isActive(path: string): boolean {
    return this.router.url === path || (path === '/dashboard' && this.router.url === '/');
  }

  /**
   * Open login dialog
   */
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '450px',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        console.log('User logged in successfully');
        // Optionally refresh current page data
      }
    });
  }

  /**
   * View user profile
   */
  viewProfile(): void {
    console.log('Viewing user profile...');
    // TODO: Navigate to profile page or open profile modal
    this.router.navigate(['/profile']);
  }

  /**
   * Open settings
   */
  openSettings(): void {
    console.log('Opening settings...');
    // TODO: Navigate to settings page or open settings modal
    this.router.navigate(['/settings']);
  }

  /**
   * Logout user
   */
  logout(): void {
    if (confirm('Are you sure you want to sign out?')) {
      this.userService.logout();
      console.log('User logged out successfully');
      // TODO: Redirect to login page if needed
      // this.router.navigate(['/login']);
    }
  }
}