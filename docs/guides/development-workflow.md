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

## 🔄 Recommended Daily Workflow

### **1. Starting Your Day**

```bash
# Navigate to project
cd POC-WS

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Start development server
npm start
```

### **2. During Development**

```bash
# ✅ Your IDE handles this automatically:
# - Real-time type checking
# - Auto-lint on save
# - Import organization
# - Format on save

# 🔍 Quick validation (run occasionally)
npm run dev:validate
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

# 2. Start development
npm start

# 3. Code with real-time feedback (VS Code automatic)

# 4. Quick check during development
npm run dev:validate

# 5. Before committing
npm run pre-commit
git add .
git commit -m "feat: add new awesome feature"

# 6. Before pushing
npm run validate
git push origin feature/new-awesome-feature
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
- [ ] No VS Code error indicators
- [ ] Code follows naming conventions
- [ ] Proper TypeScript types used
- [ ] Meaningful commit message

### **Before Pull Request (Required)**

- [ ] `npm run validate` passes completely
- [ ] All new features have proper types
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

1. **Use `npm start` for daily development**
2. **Use `npm run dev:validate` for quick checks**
3. **Use `npm run pre-commit` before every commit**
4. **Use `npm run validate` before PRs**
5. **Let VS Code handle formatting automatically**
6. **Check `TYPESCRIPT_CONFIG.md` for detailed explanations**

Happy coding! 🚀