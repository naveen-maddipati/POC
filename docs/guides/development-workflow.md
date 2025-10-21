# Daily Development Workflow Guide

This guide provides clear instructions for daily development workflows, commands, and best practices for the POC-WS project.

## 🚀 Quick Start

```bash
# Clone and setup (one-time)
git clone https://github.com/naveen-maddipati/POC.git
cd POC/POC-WS
npm install

# Start development
npm start
```

## 📋 Daily Commands Reference

### **Essential Commands (Use These Daily)**

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm start` | Start development server | **Every time you start coding** |
| `npm run dev:validate` | Quick lint fix + type check | **During development (fast check)** |
| `npm run pre-commit` | Validate before committing | **Before every git commit** |
| `npm run validate` | Full validation pipeline | **Before PR/push to main** |

### **Utility Commands (Use as Needed)**

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run lint:fix` | Auto-fix lint issues | When you have lint errors |
| `npm run type-check` | Check TypeScript errors | When debugging type issues |
| `npm run build` | Build for production | Testing deployment |
| `npm run clean` | Clean cache and dist | When build acts weird |

### **Constants Generation Commands (Critical for Team)**

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run constants:generate` | Generate all constants from live server | **Daily before starting development** |
| `npm run start:fresh` | Generate constants + start dev server | **Most common - daily development** |
| `npm run build:fresh` | Generate constants + build for production | **Before production releases** |
| `npm run pack:fresh` | Generate constants + package application | **Before deployment packages** |

> **⚠️ CRITICAL**: Always run `npm run constants:generate` or `npm run start:fresh` before starting work to ensure you have the latest server constants!

## 🔄 Recommended Daily Workflow

### **1. Starting Your Day**

```bash
# Navigate to project
cd POC-WS

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# 🚨 CRITICAL: Generate latest constants from dev server
npm run constants:generate

# Start development server
npm start
```

### **2. During Development**

```bash
# ✅ Your IDE handles this automatically:
# - Real-time type checking with Nuxeo constants
# - Auto-lint on save
# - Import organization
# - Format on save
# - IntelliSense for NUXEO_OPERATIONS, NUXEO_DOCUMENT_TYPES, etc.

# 🔍 Quick validation (run occasionally)
npm run dev:validate

# 🔄 If server capabilities change during development
npm run constants:generate
```

### **3. Before Committing Code**

```bash
# 1. Quick validation
npm run pre-commit

# 2. If no errors, commit
git add .
git commit -m "feat: your meaningful commit message"

# 3. Push to your branch
git push origin your-branch-name
```

### **4. Before Creating Pull Request**

```bash
# Full validation (includes tests and build)
npm run validate

# If everything passes, create PR
```

## 🎯 Workflow Scenarios

### **Scenario 1: Starting New Feature**

```bash
# 1. Create feature branch
git checkout -b feature/new-awesome-feature

# 2. Generate latest constants for development
npm run constants:generate

# 3. Start development
npm start

# 4. Code with real-time feedback and Nuxeo constants IntelliSense

# 5. Quick check during development
npm run dev:validate

# 6. Before committing
npm run pre-commit
git add .
git commit -m "feat: add new awesome feature"

# 7. Before pushing
npm run validate
git push origin feature/new-awesome-feature
```

### **Scenario 2: Working with Different Environments**

```bash
# Development work (most common) - fresh start with constants
npm run start:fresh

# Production build with fresh constants
npm run build:fresh

# Package with fresh constants
npm run pack:fresh
```

### **Scenario 3: Server Configuration Changes**

```bash
# When Nuxeo server capabilities change
npm run constants:generate

# Check what changed (review generated files)
git diff src/core/constants/nuxeo.constants.ts

# Update your code to use new constants
# Test with updated constants
npm run dev:validate

# Commit constants update
git add src/core/constants/nuxeo.constants.ts
git commit -m "feat: update Nuxeo constants from server"
```

### **Scenario 2: Fixing Bugs**

```bash
# 1. Start development server
npm start

# 2. Reproduce and fix the bug

# 3. Quick validation
npm run dev:validate

# 4. Run tests (if applicable)
npm run test

# 5. Commit fix
npm run pre-commit
git add .
git commit -m "fix: resolve issue with user authentication"
```

### **Scenario 3: Code Review/Cleanup**

```bash
# 1. Auto-fix all lint issues
npm run lint:fix

# 2. Check for type errors
npm run type-check

# 3. Format all code
npm run format

# 4. Full validation
npm run validate

# 5. Commit improvements
git add .
git commit -m "refactor: improve code quality and formatting"
```

## 🚨 Troubleshooting Common Issues

### **Build Errors**

```bash
# Problem: Build fails
# Solution:
npm run clean        # Clear cache
npm install          # Reinstall dependencies
npm run type-check   # Check for type errors first
npm run build        # Try build again
```

### **Lint Errors**

```bash
# Problem: Many lint errors
# Solution:
npm run lint:fix     # Auto-fix what can be fixed
npm run lint         # See remaining issues
# Fix remaining issues manually
```

### **Type Errors**

```bash
# Problem: TypeScript compilation errors
# Solution:
npm run type-check   # See all type errors
# Fix type issues in VS Code (shows inline errors)
# Or check TYPESCRIPT_CONFIG.md for troubleshooting
```

### **Performance Issues**

```bash
# Problem: Slow builds or linting
# Solution:
npm run clean        # Clear Nx cache
# Restart VS Code
# Check VS Code extensions for conflicts
```

## ⚙️ VS Code Integration

### **Automatic Features (No Commands Needed)**

Your VS Code is configured to automatically:

- ✅ **Fix lint errors on save**
- ✅ **Organize imports on save**
- ✅ **Format code on save**
- ✅ **Show type errors inline**
- ✅ **Auto-complete with Satori components**
- ✅ **Path intellisense for imports**

### **Manual VS Code Actions**

```bash
# Command Palette (Cmd+Shift+P):
> TypeScript: Restart TS Server    # Fix IntelliSense issues
> ESLint: Fix all auto-fixable problems
> Format Document                   # Manual formatting
> Organize Imports                  # Clean up imports
```

## 🤖 Constants Generation Workflow (Team Guidelines)

### **🚨 CRITICAL: Daily Constants Routine**

**Every team member MUST run this before starting development:**

```bash
npm run constants:generate
```

**OR use the convenience script that generates constants AND starts development:**

```bash
npm run start:fresh
```

This ensures you have the latest:
- **357 Nuxeo Operations** (Document_Create, Document_Query, etc.)
- **50+ Document Types** (File, Folder, Picture, etc.)
- **86+ Schemas** (dublincore, file, picture, etc.)
- **64+ Facets** (Versionable, Publishable, Folderish, etc.)

### **📋 Constants Generation Use Cases**

#### **Daily Development (Most Common)**
```bash
# Option 1: Generate constants then start manually
npm run constants:generate
npm start

# Option 2: One command to generate + start (RECOMMENDED)
npm run start:fresh

# Why: Ensures latest development server capabilities
# When: Every morning, after server updates
# Result: Updated constants in src/core/constants/nuxeo.constants.ts
```

#### **Feature Branch Preparation**
```bash
# When starting new feature
git checkout -b feature/document-management
npm run start:fresh  # Generate constants + start development

# Alternative: Generate constants separately
npm run constants:generate
npm start
```

#### **Production Deployments**
```bash
# Production build with fresh constants
npm run build:fresh

# Package application with fresh constants  
npm run pack:fresh

# Why: Ensures production build has latest server capabilities
# When: Before production releases
```

#### **Server Configuration Updates**
```bash
# When Nuxeo admin adds new document types or operations
npm run constants:generate

# Check what changed
git diff src/core/constants/nuxeo.constants.ts

# Commit the updates
git add src/core/constants/nuxeo.constants.ts
git commit -m "feat: update constants - new document types added"
```

#### **Quick Development Start**
```bash
# Fastest way to start development with fresh constants
npm run start:fresh

# This combines: constants generation + dev server start
# Equivalent to: npm run constants:generate && npm start
```

### **🎯 Team Best Practices**

#### **DO's ✅**
- **Always run `npm run constants:generate` or `npm run start:fresh` before starting work**
- **Use constants instead of string literals**: `NUXEO_DOCUMENT_TYPES.File` ❌ `'File'`
- **Check IntelliSense for available constants**
- **Commit constants updates when server changes**
- **Use `:fresh` commands for important builds**: `npm run build:fresh`

#### **DON'Ts ❌**
- **Never hardcode operation names**: ❌ `'Document.Create'` ✅ `NUXEO_OPERATIONS.Document_Create`
- **Don't skip constants generation when starting work**
- **Don't use outdated constants files**
- **Don't forget to use `:fresh` commands for production builds**

### **🔍 Constants in Your Code**

#### **Type-Safe Document Operations**
```typescript
// ❌ Before (error-prone)
const doc = await createDocument('/path', 'File', properties);
if (document.facets?.includes('Versionable')) { ... }

// ✅ After (type-safe with constants)
const doc = await createDocumentWithType(
  '/path', 
  NUXEO_DOCUMENT_TYPES.File,  // IntelliSense + validation
  properties
);
if (this.documentService.isVersionable(document)) { ... }
```

#### **Schema-Aware Metadata**
```typescript
// ❌ Before (magic strings)
const title = doc.properties['dc:title'];
const filename = doc.properties['file:filename'];

// ✅ After (schema constants)
const title = this.documentService.getDocumentMetadata(
  doc, 
  NUXEO_SCHEMAS.dublincore, 
  'title'
);
const filename = this.documentService.getDocumentMetadata(
  doc, 
  NUXEO_SCHEMAS.file, 
  'filename'
);
```

#### **Advanced Search with Type Safety**
```typescript
// ✅ Type-safe search with constants
const results = await this.documentService.searchDocumentsByTypeAndFacets(
  'search term',
  [NUXEO_DOCUMENT_TYPES.File, NUXEO_DOCUMENT_TYPES.Picture], // Only these types
  [NUXEO_FACETS.Downloadable], // Must be downloadable
  [NUXEO_FACETS.HiddenInNavigation] // Must not be hidden
);
```

### **🚀 Performance Benefits**

#### **Development Speed**
- **IntelliSense**: All 558+ constants available with autocomplete
- **Type Safety**: Catch errors at compile time, not runtime
- **Refactoring**: Rename constants across entire codebase safely

#### **Maintenance**
- **Server Sync**: Constants automatically match server capabilities
- **Documentation**: Self-documenting code with meaningful constant names
- **Consistency**: Same constants used across all team members

### **🔄 Constants Update Workflow**

#### **When Server Administrator Updates Nuxeo**
```bash
# 1. Server admin notifies team of changes
# 2. Each developer updates their constants
npm run constants:generate

# 3. Review changes
git diff src/core/constants/nuxeo.constants.ts

# 4. Update code to use new constants if needed
# 5. Test with updated constants
npm run dev:validate

# 6. Commit changes
git add src/core/constants/nuxeo.constants.ts
git commit -m "feat: update constants - new schema added"
```

#### **Before Major Releases**
```bash
# 1. Generate fresh constants and build
npm run build:fresh

# 2. Review any changes in constants
git diff src/core/constants/nuxeo.constants.ts

# 3. Full validation
npm run validate

# 4. Deploy with confidence
```

### **⚠️ Common Pitfalls & Solutions**

#### **Problem: Constants Out of Sync**
```bash
# Symptom: Operations fail with "Unknown operation" errors
# Solution:
npm run constants:generate
npm run dev:validate
```

#### **Problem: New Document Type Not Available**
```bash
# Symptom: TypeScript error "Property does not exist"
# Solution:
npm run constants:generate
# Check if new type appears in NUXEO_DOCUMENT_TYPES
```

#### **Problem: Forgetting to Update Constants**
```bash
# Symptom: Using outdated server capabilities
# Solution: Use :fresh commands that automatically generate constants
npm run start:fresh     # For development
npm run build:fresh     # For production builds
npm run pack:fresh      # For deployment packages
```

### **📊 Constants Statistics (Current)**
- **Total Constants**: 558+
- **Operations**: 357 (automation endpoints)
- **Document Types**: 50 (File, Folder, Picture, etc.)
- **Schemas**: 86 (dublincore, file, picture, etc.)
- **Facets**: 64 (Versionable, Publishable, etc.)
- **Update Frequency**: As needed when server changes
- **Team Sync**: Daily before development starts

## 🔧 Advanced Commands (Occasional Use)

### **Development Tools**

```bash
# Watch mode for type checking
npm run type-check:watch

# Watch mode for tests
npm run test:watch

# Test coverage report
npm run test:coverage

# Check formatting without fixing
npm run format:check
```

### **Project Maintenance**

```bash
# Clean everything and reinstall
npm run reinstall

# Reset Nx cache
npm run clean

# Build production bundle
npm run build

# Package application
npm run pack
```

### **Satori Design System**

```bash
# Use Satori CLI
npm run satori

# Add Satori plugin
npm run satori add @some/plugin-name --project=POC-WS
```

## 📊 Performance Tips

### **Fast Development**

1. **Use `npm run dev:validate`** instead of full validation during development
2. **Let VS Code handle formatting** automatically
3. **Use Nx cache** - second runs are much faster
4. **Run `npm run clean`** if builds become slow

### **Efficient Workflows**

```bash
# ✅ Efficient: Run validation in order of speed
npm run dev:validate  # Fast: lint + type-check only

# ⚠️ When needed: Full validation
npm run validate      # Slower: lint + type + test + build

# ❌ Avoid: Running individually unless debugging
npm run lint && npm run type-check && npm run test && npm run build
```

## 🎨 Code Quality Standards

### **Before Committing (Required)**

- [ ] `npm run pre-commit` passes
- [ ] **Constants are up-to-date**: `npm run generate:constants:dev` run today
- [ ] **No magic strings**: All Nuxeo operations use constants (NUXEO_OPERATIONS.*)
- [ ] **Type-safe document types**: Use NUXEO_DOCUMENT_TYPES instead of strings
- [ ] No VS Code error indicators
- [ ] Code follows naming conventions
- [ ] Proper TypeScript types used
- [ ] Meaningful commit message

### **Before Pull Request (Required)**

- [ ] `npm run validate` passes completely
- [ ] **Constants validation**: `npm run validate:constants` passes
- [ ] **Environment-specific constants generated** (if deploying)
- [ ] All new features have proper types
- [ ] **Nuxeo constants used throughout**: No hardcoded operation/type names
- [ ] Satori components used correctly
- [ ] No console.log statements in production code
- [ ] Documentation updated if needed

## 🚀 Git Workflow Integration

### **Recommended Git Commands**

```bash
# Daily sync
git pull origin main

# Feature development
git checkout -b feature/your-feature-name
# ... make changes ...
npm run pre-commit
git add .
git commit -m "feat: descriptive message"

# Before merging
npm run validate
git push origin feature/your-feature-name
# Create Pull Request

# After PR approval
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

### **Commit Message Format**

```bash
# Format: type: description
git commit -m "feat: add user authentication with Satori components"
git commit -m "fix: resolve navigation type errors"
git commit -m "refactor: improve TypeScript strict mode compliance"
git commit -m "docs: update README with new workflow"
```

## 📚 Additional Resources

- **TypeScript Configuration**: See `TYPESCRIPT_CONFIG.md` for detailed explanations
- **Satori Documentation**: Check Satori packages in `node_modules/@hylandsoftware/`
- **Nx Documentation**: [https://nx.dev](https://nx.dev)
- **Angular Documentation**: [https://angular.io](https://angular.io)

## 🆘 Getting Help

### **Common Questions**

**Q: The build is failing, what should I do?**
```bash
A: npm run type-check  # See specific TypeScript errors
   # Fix errors shown, then run npm run build again
```

**Q: VS Code is not showing proper autocompletion**
```bash
A: Cmd+Shift+P → "TypeScript: Restart TS Server"
   # Also check that you're in the POC-WS directory
```

**Q: Lint errors are overwhelming**
```bash
A: npm run lint:fix  # Auto-fix what can be fixed
   # Then fix remaining issues one by one
```

**Q: How do I add new Satori components?**
```bash
A: npm run satori add @hylandsoftware/component-name --project=POC-WS
   # Or import existing ones with proper types
```

### **Team Support**

- Check `TYPESCRIPT_CONFIG.md` for detailed configuration explanations
- Ask team members for TypeScript/Satori specific questions
- Create issues in the repository for bugs or feature requests

---

## ⭐ Key Takeaways

1. **🚨 CRITICAL: Use `npm run start:fresh` for daily development (generates constants + starts server)**
2. **Alternative: Run `npm run constants:generate` before starting work manually**
3. **Use `npm run dev:validate` for quick checks**
4. **Use `npm run pre-commit` before every commit**
5. **Use `npm run validate` before PRs**
6. **Always use Nuxeo constants instead of magic strings**:
   - ✅ `NUXEO_OPERATIONS.Document_Create` 
   - ❌ `'Document.Create'`
7. **Use `:fresh` commands for important builds**:
   - Development: `npm run start:fresh`
   - Production: `npm run build:fresh`
   - Packaging: `npm run pack:fresh`
8. **Let VS Code handle formatting automatically**
9. **Check `TYPESCRIPT_CONFIG.md` for detailed explanations**
10. **See [Service Integration Summary](../features/service-integration-summary.md) for constants usage examples**

### **📚 Essential Constants References**
- **Operations**: `NUXEO_OPERATIONS.*` (357 available)
- **Document Types**: `NUXEO_DOCUMENT_TYPES.*` (50+ available)
- **Schemas**: `NUXEO_SCHEMAS.*` (86+ available)  
- **Facets**: `NUXEO_FACETS.*` (64+ available)

### **🎯 Quick Command Reference**
- **Daily Start**: `npm run start:fresh`
- **Manual Constants**: `npm run constants:generate`
- **Production Build**: `npm run build:fresh`
- **Quick Validation**: `npm run dev:validate`

Happy coding with type-safe Nuxeo constants! 🚀