# TypeScript Configuration Guide

This document provides a comprehensive explanation of the TypeScript, ESLint, and development configuration setup for the POC-WS project. It serves as a reference for team members to understand the reasoning behind each setting and how to work effectively with the configured toolchain.

> **⚠️ IMPORTANT NOTE - Satori Design System Compatibility**
> 
> **Our TypeScript configuration enhances and strengthens the Satori design system usage rather than deviating from it.** 
> 
> This configuration:
> - ✅ **Maintains full compatibility** with all Satori packages (`@hylandsoftware/satori-devkit`, `satori-layout`, etc.)
> - ✅ **Enhances type safety** for Satori components and navigation items
> - ✅ **Improves developer experience** when working with Satori themes and layouts
> - ✅ **Adds no breaking changes** to the design system patterns
> - ✅ **Follows TypeScript best practices** that align with Satori's modern approach
> 
> The Satori packages are TypeScript-native and provide full `.d.ts` definitions. Our strict configuration catches Satori integration errors early and provides better IDE support, making the team more effective at using the design system correctly.

## Table of Contents

- [Overview](#overview)
- [TypeScript Configuration](#typescript-configuration)
- [ESLint Configuration](#eslint-configuration)
- [VS Code Settings](#vs-code-settings)
- [Package Scripts](#package-scripts)
- [Satori Type Safety](#satori-type-safety)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Overview

Our project uses a **strict TypeScript configuration** combined with **comprehensive linting rules** to ensure:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Code Quality**: Consistent coding standards across the team
- **Maintainability**: Self-documenting code with explicit types
- **Performance**: Optimized builds and IDE support
- **Satori Integration**: Type-safe usage of the Satori design system

## TypeScript Configuration

### Base Configuration (`tsconfig.base.json`)

This is the root TypeScript configuration that all other projects extend from.

#### Basic Configuration

```json
{
  "target": "es2022",           // Compile to ES2022 (supports modern JavaScript features)
  "module": "esnext",           // Use latest ES modules
  "lib": ["es2022", "dom"],     // Include ES2022 and DOM type definitions
  "moduleResolution": "bundler", // Use bundler-style module resolution
}
```

**Why these settings:**
- `es2022`: Provides modern JavaScript features while maintaining good browser support
- `esnext`: Allows us to use the latest ES module features
- `bundler`: Optimized for modern bundlers like Webpack/Vite

#### Module Resolution

```json
{
  "moduleResolution": "bundler"  // Use modern bundler-style module resolution
}
```

**What is Module Resolution?**

Module resolution is how TypeScript finds and loads modules when you write import statements. It determines the algorithm TypeScript uses to locate files.

**`"bundler"` vs `"node"` Resolution:**

| Feature | `"node"` (Legacy) | `"bundler"` (Modern) |
|---------|-------------------|---------------------|
| **File Extension Resolution** | Limited | Comprehensive |
| **Package.json "exports"** | Basic | Full support |
| **Conditional Exports** | No | Yes |
| **ESM/CommonJS Interop** | Basic | Advanced |
| **Bundler Features** | No | Yes |
| **Performance** | Good | Better |

**Examples:**

```typescript
// With "bundler" resolution (our choice):
import { config } from './config';              // ✅ Finds .ts, .js automatically
import { Button } from '@my-lib/button';        // ✅ Uses package.json "exports"
import { DevUtils } from '@satori/dev-tools';   // ✅ Conditional exports support

// With "node" resolution (legacy):
import { config } from './config.js';           // ❌ Needs explicit extension
import { Button } from '@my-lib/button/dist';   // ❌ Manual path to distribution
import { DevUtils } from '@satori/dev-tools';   // ❌ Limited package.json support
```

**Why We Use `"bundler"`:**

1. **Modern Angular Support**: Works optimally with Angular's build system
2. **Better Satori Integration**: Properly resolves Satori package exports
3. **Nx Workspace Optimization**: Handles complex path mappings efficiently
4. **Future-Proof**: Aligns with modern JavaScript ecosystem
5. **Build Performance**: Better tree-shaking and bundling support

**Satori Package Example:**
```typescript
// Bundler resolution automatically finds the best entry point
import { NavigationConverterPipe } from '@hylandsoftware/satori-layout';
// Uses package.json "exports" field for optimal imports

// Fixed path mapping (single * only):
import { SatoriTheme } from '@satori/satori-devkit';     // ✅ Works
import { LayoutUtils } from '@satori/satori-layout';     // ✅ Works
```

**⚠️ Important:** We fixed the path mapping to use single `*` wildcards only:
```json
{
  "paths": {
    "@satori/*": ["node_modules/@hylandsoftware/*"]  // ✅ Single * only
  }
}
```

#### Strict Type Checking

```json
{
  "strict": true,                          // Enable all strict type checking options
  "noImplicitAny": true,                  // Error on implicit 'any' types
  "strictNullChecks": true,               // Strict null and undefined checking
  "strictFunctionTypes": true,            // Strict checking of function types
  "strictBindCallApply": true,            // Strict checking of bind, call, apply
  "strictPropertyInitialization": true,   // Ensure class properties are initialized
  "noImplicitReturns": true,              // Error when not all code paths return a value
  "noFallthroughCasesInSwitch": true,     // Error on fallthrough switch cases
  "noUncheckedIndexedAccess": true,       // Include undefined in index signature results
  "noImplicitOverride": true,             // Require explicit 'override' keyword
}
```

**Benefits:**
- **Prevents common bugs**: Null pointer exceptions, undefined access
- **Explicit intentions**: Forces developers to handle edge cases
- **Better IDE support**: More accurate auto-completion and error detection
- **Runtime safety**: Reduces the likelihood of runtime errors

#### Additional Checks

```json
{
  "noUnusedLocals": true,                 // Error on unused local variables
  "noUnusedParameters": true,             // Error on unused function parameters
  "exactOptionalPropertyTypes": true,     // Exact optional property types
  "noPropertyAccessFromIndexSignature": true, // Require bracket notation for index access
}
```

**Team Benefits:**
- **Clean code**: Automatically removes unused code
- **Explicit access**: Forces intentional property access patterns
- **Type precision**: More accurate optional property handling

#### Path Mapping

```json
{
  "paths": {
    "@core/*": ["libs/core/src/lib/*"],
    "@shared/*": ["libs/shared/src/lib/*"],
    "@satori/*": ["node_modules/@hylandsoftware/*/src/*"]
  }
}
```

**Usage Examples:**
```typescript
// Instead of: import { UserService } from '../../../libs/core/src/lib/services/user.service'
import { UserService } from '@core/services/user.service';

// Instead of: import { SatoriTheme } from '../../node_modules/@hylandsoftware/satori-devkit/src/theme'
import { SatoriTheme } from '@satori/satori-devkit/theme';
```

### App Configuration (`apps/POC-WS/tsconfig.app.json`)

```json
{
  "types": ["node"],                      // Include Node.js type definitions
  "paths": {
    "@app/*": ["./src/app/*"],           // App-specific imports
    "@assets/*": ["./src/assets/*"],     // Asset imports
    "@types/*": ["./src/types/*"]        // Type definitions
  }
}
```

**Purpose:**
- **Scoped imports**: Clean imports within the application
- **Type definitions**: Access to Node.js types for build scripts
- **Asset management**: Type-safe asset imports

## ESLint Configuration

### TypeScript-Specific Rules

#### Strict Type Safety
```javascript
{
  "@typescript-eslint/no-explicit-any": "error",           // Forbid 'any' type
  "@typescript-eslint/no-unsafe-any": "error",            // Forbid unsafe 'any' usage
  "@typescript-eslint/no-unsafe-assignment": "error",     // Forbid unsafe assignments
  "@typescript-eslint/no-unsafe-call": "error",           // Forbid unsafe function calls
  "@typescript-eslint/no-unsafe-member-access": "error",  // Forbid unsafe property access
  "@typescript-eslint/no-unsafe-return": "error",         // Forbid unsafe returns
}
```

**Impact:**
- **Forces explicit typing**: Developers must define proper types
- **Prevents runtime errors**: Catches type mismatches at compile time
- **Improves code quality**: Self-documenting code with clear interfaces

#### Code Quality Rules
```javascript
{
  "@typescript-eslint/prefer-readonly": "error",              // Prefer readonly for immutable data
  "@typescript-eslint/prefer-nullish-coalescing": "error",    // Use ?? instead of ||
  "@typescript-eslint/prefer-optional-chain": "error",       // Use ?. for safe property access
  "@typescript-eslint/no-unnecessary-condition": "error",    // Remove redundant conditions
}
```

**Examples:**
```typescript
// ✅ Good
const user: Readonly<User> = { name: 'John', age: 30 };
const name = user?.profile?.name ?? 'Default';

// ❌ Bad
const user: User = { name: 'John', age: 30 };
const name = user && user.profile && user.profile.name || 'Default';
```

#### Naming Conventions
```javascript
{
  "@typescript-eslint/naming-convention": [
    "error",
    { "selector": "interface", "format": ["PascalCase"], "prefix": ["I"] },
    { "selector": "typeAlias", "format": ["PascalCase"] },
    { "selector": "enum", "format": ["PascalCase"] },
    { "selector": "enumMember", "format": ["UPPER_CASE"] }
  ]
}
```

**Team Standards:**
```typescript
// ✅ Correct naming
interface IUserProfile { }          // Interfaces prefixed with 'I'
type UserRole = 'admin' | 'user';   // Types in PascalCase
enum UserStatus { ACTIVE, INACTIVE } // Enums and members in UPPER_CASE

// ❌ Incorrect naming
interface userProfile { }           // Missing 'I' prefix, wrong case
type userRole = 'admin' | 'user';   // Wrong case
enum userStatus { active, inactive } // Wrong case
```

### Angular-Specific Rules

```javascript
{
  "@angular-eslint/directive-selector": ["error", { "type": "attribute", "prefix": "app", "style": "camelCase" }],
  "@angular-eslint/component-selector": ["error", { "type": "element", "prefix": "app", "style": "kebab-case" }],
  "@angular-eslint/use-lifecycle-interface": "error",
  "@angular-eslint/no-input-rename": "error"
}
```

**Angular Standards:**
```typescript
// ✅ Correct Angular patterns
@Component({
  selector: 'app-user-profile',  // kebab-case with 'app' prefix
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @Input() user: IUser;          // No input renaming
  
  ngOnInit(): void { }           // Proper lifecycle interface
}

@Directive({
  selector: '[appHighlight]'     // camelCase directive with 'app' prefix
})
export class HighlightDirective { }
```

## VS Code Settings

### TypeScript IDE Configuration

```json
{
  "typescript.preferences.strictNullChecks": "on",        // Enable strict null checks in IDE
  "typescript.suggest.autoImports": true,                 // Auto-import suggestions
  "typescript.inlayHints.parameterNames.enabled": "all",  // Show parameter names inline
  "typescript.inlayHints.variableTypes.enabled": true,    // Show variable types inline
}
```

**Developer Experience:**
- **Real-time feedback**: See type errors as you type
- **Auto-imports**: Automatically import used types and functions
- **Inline hints**: See parameter names and types without hovering

### Auto-formatting and Linting

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",      // Fix ESLint errors on save
    "source.organizeImports": "explicit",    // Organize imports on save
  },
  "editor.formatOnSave": true,               // Format code on save
}
```

**Benefits:**
- **Consistent formatting**: All team members use the same code style
- **Automatic cleanup**: Remove unused imports, fix lint errors
- **Productivity**: Less time spent on manual formatting

### Path Intellisense

```json
{
  "path-intellisense.mappings": {
    "@core": "${workspaceFolder}/libs/core/src/lib",
    "@satori": "${workspaceFolder}/node_modules/@hylandsoftware"
  }
}
```

**Usage:**
- **Auto-completion**: Get path suggestions when importing
- **Navigation**: Click to navigate to files using path mappings

## Package Scripts

### Linting and Type Checking

```json
{
  "lint": "nx run-many --target=lint --all",              // Lint all projects
  "lint:fix": "nx run-many --target=lint --all --fix",    // Fix auto-fixable lint errors
  "type-check": "nx run-many --target=type-check --all",  // Type check all projects
  "type-check:watch": "tsc --noEmit --watch"             // Watch mode type checking
}
```

**Daily Usage:**
```bash
# Check for lint errors
npm run lint

# Fix auto-fixable errors
npm run lint:fix

# Run type checking
npm run type-check

# Watch mode for type checking during development
npm run type-check:watch
```

### Code Quality Scripts

```json
{
  "format": "prettier --write .",                         // Format all files
  "format:check": "prettier --check .",                   // Check formatting
  "pre-commit": "npm run lint:check && npm run type-check && npm run test"
}
```

**CI/CD Integration:**
```bash
# Pre-commit hook (runs automatically)
npm run pre-commit

# Full validation (for CI pipeline)
npm run validate
```

## Satori Type Safety

### Custom Type Definitions (`src/types/satori.types.ts`)

Our project includes comprehensive type definitions for working with the Satori design system:

#### Theme Configuration
```typescript
interface ISatoriTheme {
  readonly name: string;
  readonly mode: 'light' | 'dark' | 'auto';
  readonly primary?: string;
  readonly secondary?: string;
}

// Usage
const theme: ISatoriTheme = {
  name: 'custom-theme',
  mode: 'dark'  // TypeScript ensures this is one of the allowed values
};
```

#### Type Guards for Runtime Safety
```typescript
function isSatoriNavigationItem(item: unknown): item is SatNavigationItem {
  return typeof item === 'object' && 
         item !== null && 
         'title' in item && 
         'path' in item;
}

// Usage
const navData = getNavigationFromAPI();
if (isSatoriNavigationItem(navData)) {
  // TypeScript now knows navData is SatNavigationItem
  console.log(navData.title); // ✅ Safe access
} else {
  // Handle invalid data
  console.error('Invalid navigation data');
}
```

#### Helper Functions
```typescript
// Type-safe theme creation
const theme = createSatoriTheme('my-theme', 'dark', {
  primary: '#007acc',
  secondary: '#f0f0f0'
});

// Validated navigation conversion
const convertedNav = convertNavigationItem(navigationItem);
```

### Integration with NavigationConverterPipe

```typescript
import { NavigationConverterPipe } from '@hylandsoftware/satori-layout';
import { isSatoriNavigationItem, convertNavigationItem } from '@types/satori.types';

// Type-safe navigation processing
if (isSatoriNavigationItem(rawNavItem)) {
  const converted = this.navigationConverter.transform(rawNavItem);
  // Type safety guaranteed
}
```

## Development Workflow

### Daily Development

1. **Start development server:**
   ```bash
   npm start
   ```

2. **Enable watch mode for type checking:**
   ```bash
   npm run type-check:watch
   ```

3. **Before committing:**
   ```bash
   npm run lint:fix          # Fix auto-fixable issues
   npm run type-check        # Ensure no type errors
   npm run test             # Run tests
   ```

### Working with Strict Types

#### Handling Unknown Data
```typescript
// ✅ Good - use type guards
function processUserData(data: unknown): IUser | null {
  if (isUser(data)) {
    return data;
  }
  return null;
}

// ❌ Bad - avoid 'any'
function processUserData(data: any): IUser {
  return data as IUser;
}
```

#### Optional Properties
```typescript
// ✅ Good - explicit handling
interface IConfig {
  readonly apiUrl: string;
  readonly timeout?: number;
}

function createConfig(config: IConfig): FullConfig {
  return {
    apiUrl: config.apiUrl,
    timeout: config.timeout ?? 5000  // Explicit default
  };
}
```

#### Array and Object Access
```typescript
// ✅ Good - safe access with strict settings
const users: IUser[] = getUsers();
const firstUser = users[0];  // Type is 'IUser | undefined'

if (firstUser) {
  console.log(firstUser.name);  // ✅ Safe after null check
}

// Alternative with optional chaining
console.log(users[0]?.name ?? 'No user');
```

### Working with Satori Components

```typescript
import { Component } from '@angular/core';
import type { ISatoriTheme, ISatoriConfig } from '@types/satori.types';
import { createSatoriTheme, isSatoriTheme } from '@types/satori.types';

@Component({
  selector: 'app-theme-switcher',
  template: `...`
})
export class ThemeSwitcherComponent {
  private currentTheme: ISatoriTheme = createSatoriTheme('default', 'light');
  
  switchTheme(newTheme: unknown): void {
    if (isSatoriTheme(newTheme)) {
      this.currentTheme = newTheme;
      this.applyTheme(newTheme);
    } else {
      console.error('Invalid theme provided');
    }
  }
  
  private applyTheme(theme: ISatoriTheme): void {
    // Theme application logic
    document.documentElement.setAttribute('data-theme', theme.mode);
  }
}
```

## Troubleshooting

### Common TypeScript Errors

#### Error: "Object is possibly 'null' or 'undefined'"
```typescript
// ❌ Causes error
const user = getUser();
console.log(user.name);

// ✅ Fix with null check
const user = getUser();
if (user) {
  console.log(user.name);
}

// ✅ Or use optional chaining
console.log(user?.name);
```

#### Error: "Element implicitly has an 'any' type"
```typescript
// ❌ Causes error
const data = { users: [] };
const firstUser = data['users'][0];

// ✅ Fix with proper typing
interface IData {
  users: IUser[];
}
const data: IData = { users: [] };
const firstUser = data.users[0]; // Type: IUser | undefined
```

#### Error: "Property does not exist on type"
```typescript
// ❌ Causes error
interface IUser {
  name: string;
}
const user: IUser = getUser();
console.log(user.email); // Property 'email' does not exist

// ✅ Fix by extending interface
interface IUserWithEmail extends IUser {
  email: string;
}
const user: IUserWithEmail = getUser();
console.log(user.email);
```

### ESLint Error Fixes

#### "@typescript-eslint/no-explicit-any"
```typescript
// ❌ Bad
function processData(data: any): void { }

// ✅ Good
function processData(data: unknown): void {
  // Use type guards to narrow the type
}

// ✅ Alternative
function processData<T>(data: T): void { }
```

#### "@typescript-eslint/prefer-nullish-coalescing"
```typescript
// ❌ Bad
const value = user.name || 'default';

// ✅ Good
const value = user.name ?? 'default';
```

### Build Errors

#### "Cannot find module" with path mapping
1. Check `tsconfig.base.json` paths are correct
2. Ensure the target file exists
3. Restart TypeScript service: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

#### Circular dependency errors
```typescript
// ❌ Avoid circular imports
// file1.ts exports something that imports file2.ts
// file2.ts exports something that imports file1.ts

// ✅ Fix with proper architecture
// Use index.ts files to control exports
// Move shared interfaces to separate files
```

## Performance Considerations

### TypeScript Compilation
- **Incremental compilation**: Enabled with `"incremental": true`
- **Project references**: Use for large monorepos
- **Skip lib check**: `"skipLibCheck": true` for faster builds

### ESLint Performance
- **Selective linting**: Use `.eslintignore` for build output
- **Cached results**: ESLint caches results between runs
- **Parallel execution**: Nx runs lint tasks in parallel

### VS Code Performance
- **Exclude large folders**: Configure `files.exclude` for node_modules
- **Limit IntelliSense**: Use `typescript.preferences.includePackageJsonAutoImports`

## Team Guidelines

### Code Review Checklist
- [ ] All TypeScript strict mode errors resolved
- [ ] No ESLint warnings or errors
- [ ] Proper type annotations for public APIs
- [ ] Type guards used for unknown data
- [ ] Consistent naming conventions followed
- [ ] Path mappings used instead of relative imports

### Best Practices
1. **Always define return types** for public methods
2. **Use readonly** for immutable data structures
3. **Prefer type unions** over enums for simple constants
4. **Document complex types** with JSDoc comments
5. **Use type guards** instead of type assertions
6. **Leverage utility types** (`Partial`, `Pick`, `Omit`, etc.)

This configuration ensures our codebase remains maintainable, scalable, and type-safe while providing an excellent developer experience for the entire team.