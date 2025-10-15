import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Authentication method types
 */
export type AuthMethod = 'basic' | 'oauth' | 'jwt' | 'mock';

/**
 * Authentication credentials interface
 */
export interface IAuthCredentials {
  username: string;
  password: string;
  method: AuthMethod;
}

/**
 * User information interface
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
  authMethod?: AuthMethod;
  lastLogin?: Date;
}

/**
 * User Service
 * Manages current logged-in user information and authentication state
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  
  /**
   * Current user signal - reactive state management
   */
  private readonly _currentUser = signal<IUser | null>(null);
  
  /**
   * Loading state signal
   */
  private readonly _isLoading = signal<boolean>(false);

  /**
   * Current authentication method
   */
  private readonly _authMethod = signal<AuthMethod>('mock');

  /**
   * Stored credentials for Basic Auth (in memory only)
   */
  private _basicAuthCredentials: string | null = null;

  /**
   * Public readonly access to current user
   */
  public readonly currentUser = this._currentUser.asReadonly();
  
  /**
   * Public readonly access to loading state
   */
  public readonly isLoading = this._isLoading.asReadonly();

  /**
   * Computed user display name
   */
  public readonly userDisplayName = computed(() => {
    const user = this._currentUser();
    return user ? user.name : 'Guest User';
  });

  /**
   * Computed user initials for avatar
   */
  public readonly userInitials = computed(() => {
    const user = this._currentUser();
    if (!user) return 'GU';
    
    const nameParts = user.name.split(' ').filter(part => part.length > 0);
    if (nameParts.length >= 2 && nameParts[0] && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  });

  /**
   * Check if user is authenticated
   */
  public readonly isAuthenticated = computed(() => {
    return this._currentUser() !== null;
  });

  constructor() {
    // Load user on service initialization
    this.loadCurrentUser();
  }

  /**
   * Load current user information
   * Checks for existing Basic Auth session first, then falls back to mock
   */
  private async loadCurrentUser(): Promise<void> {
    this._isLoading.set(true);
    
    try {
      // First, try to load from Basic Auth session
      await this.loadFromBasicAuthSession();
      
      // If no Basic Auth session, check if we have a user loaded
      if (!this._currentUser()) {
        // Fall back to mock user for development
        await this.loadMockUser();
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
      // Fall back to mock user
      await this.loadMockUser();
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Load mock user for development
   */
  private async loadMockUser(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: IUser = {
      id: 'user-001',
      name: 'Naveen Maddipati',
      email: 'naveen.maddipati@hyland.com',
      role: 'Senior Developer',
      department: 'Engineering',
      authMethod: 'mock',
      lastLogin: new Date()
    };

    this._currentUser.set(mockUser);
    this._authMethod.set('mock');
  }

  /**
   * Update current user information
   */
  public updateUser(user: Partial<IUser>): void {
    const currentUser = this._currentUser();
    if (currentUser) {
      this._currentUser.set({ ...currentUser, ...user });
    }
  }

  /**
   * Logout user
   */
  public logout(): void {
    this._currentUser.set(null);
    this._basicAuthCredentials = null;
    this._authMethod.set('mock');
    // Clear any stored tokens or session data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('basicAuth');
  }

  /**
   * Create Basic Auth header
   */
  private createBasicAuthHeader(username: string, password: string): string {
    const credentials = btoa(`${username}:${password}`);
    return `Basic ${credentials}`;
  }

  /**
   * Login with Basic Authentication
   */
  public async loginWithBasicAuth(username: string, password: string, authUrl?: string): Promise<boolean> {
    this._isLoading.set(true);
    
    try {
      const basicAuthHeader = this.createBasicAuthHeader(username, password);
      
      // Default to Nuxeo-style authentication endpoint
      const loginUrl = authUrl || 'http://localhost:8080/nuxeo/api/v1/me';
      
      const headers = new HttpHeaders({
        'Authorization': basicAuthHeader,
        'Content-Type': 'application/json'
      });

      // Attempt to authenticate and get user info
      const response = await firstValueFrom(
        this.http.get<any>(loginUrl, { headers })
      );

      // Store credentials and create user object
      this._basicAuthCredentials = basicAuthHeader;
      this._authMethod.set('basic');
      
      const user: IUser = {
        id: response.id || 'basic-user',
        name: response.properties?.firstName && response.properties?.lastName
          ? `${response.properties.firstName} ${response.properties.lastName}`
          : response.id || username,
        email: response.properties?.email || `${username}@company.com`,
        role: response.properties?.groups?.join(', ') || 'User',
        department: 'Engineering',
        authMethod: 'basic',
        lastLogin: new Date()
      };

      this._currentUser.set(user);
      
      // Optionally store in session for persistence
      sessionStorage.setItem('basicAuth', basicAuthHeader);
      
      return true;
    } catch (error) {
      console.error('Basic Auth login failed:', error);
      this._basicAuthCredentials = null;
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Get Basic Auth header for API calls
   */
  public getBasicAuthHeader(): string | null {
    return this._basicAuthCredentials || sessionStorage.getItem('basicAuth');
  }

  /**
   * Login with credentials (supports multiple auth methods)
   */
  public async login(credentials: IAuthCredentials): Promise<boolean>;
  public async login(email: string, password: string, method?: AuthMethod): Promise<boolean>;
  public async login(
    credentialsOrEmail: IAuthCredentials | string, 
    password?: string, 
    method: AuthMethod = 'mock'
  ): Promise<boolean> {
    let actualCredentials: IAuthCredentials;
    
    if (typeof credentialsOrEmail === 'string') {
      actualCredentials = {
        username: credentialsOrEmail,
        password: password || '',
        method: method
      };
    } else {
      actualCredentials = credentialsOrEmail;
    }

    switch (actualCredentials.method) {
      case 'basic':
        return this.loginWithBasicAuth(actualCredentials.username, actualCredentials.password);
      
      case 'mock':
      default:
        return this.loginMock(actualCredentials.username, actualCredentials.password);
    }
  }

  /**
   * Mock login implementation (existing functionality)
   */
  private async loginMock(email: string, _password: string): Promise<boolean> {
    this._isLoading.set(true);
    
    try {
      // Simulate authentication API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const user: IUser = {
        id: 'user-001',
        name: 'Naveen Maddipati',
        email: email,
        role: 'Senior Developer',
        department: 'Engineering',
        authMethod: 'mock',
        lastLogin: new Date()
      };
      
      this._currentUser.set(user);
      this._authMethod.set('mock');
      return true;
    } catch (error) {
      console.error('Mock login failed:', error);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Check if user is using Basic Auth
   */
  public isBasicAuth(): boolean {
    return this._authMethod() === 'basic';
  }

  /**
   * Load user from stored Basic Auth session
   */
  private async loadFromBasicAuthSession(): Promise<void> {
    const storedAuth = sessionStorage.getItem('basicAuth');
    if (storedAuth) {
      this._basicAuthCredentials = storedAuth;
      this._authMethod.set('basic');
      
      // Try to refresh user info
      try {
        const headers = new HttpHeaders({
          'Authorization': storedAuth,
          'Content-Type': 'application/json'
        });

        const response = await firstValueFrom(
          this.http.get<any>('http://localhost:8080/nuxeo/api/v1/me', { headers })
        );

        const user: IUser = {
          id: response.id || 'basic-user',
          name: response.properties?.firstName && response.properties?.lastName
            ? `${response.properties.firstName} ${response.properties.lastName}`
            : response.id || 'User',
          email: response.properties?.email || 'user@company.com',
          role: response.properties?.groups?.join(', ') || 'User',
          department: 'Engineering',
          authMethod: 'basic',
          lastLogin: new Date()
        };

        this._currentUser.set(user);
      } catch (error) {
        console.warn('Failed to load user from Basic Auth session:', error);
        // Clear invalid session
        sessionStorage.removeItem('basicAuth');
        this._basicAuthCredentials = null;
      }
    }
  }
}