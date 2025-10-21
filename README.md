# Nuxeo Satori Workspace

A modern Angular workspace using the Satori design system with enterprise Nuxeo integration for content management operations.

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/naveen-maddipati/POC.git
cd POC/Nuxeo-Satori-Workspace
npm install

# Start development
npm start
```

## 📋 Essential Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start development server (Nuxeo-Satori-UI) |
| `npm run dev:validate` | Quick validation (lint + type-check) |
| `npm run pre-commit` | Validate before committing |
| `npm run validate` | Full validation pipeline |

## 🏗️ Project Overview

### **Technology Stack**
- **Framework**: Angular 19 with standalone components
- **Build System**: Nx workspace for monorepo management
- **Language**: TypeScript with strict configuration
- **Design System**: Satori by Hyland Software
- **Styling**: SCSS with design tokens
- **Authentication**: OIDC client integration
- **Internationalization**: NGX-Translate

### **Key Features**
- ✅ **Strict TypeScript**: Enhanced type safety and error prevention
- ✅ **Satori Integration**: Enterprise design system components
- ✅ **Type-Safe Navigation**: Custom type guards for Satori components
- ✅ **Optimized Development**: Fast builds with Nx caching
- ✅ **Code Quality**: Automated linting and formatting
- ✅ **Modern Tooling**: Bundler-style module resolution

## 📚 Documentation


### **Getting Started**
- **[Development Workflow](./docs/DEVELOPMENT_WORKFLOW.md)** - Daily commands and workflows
- **[TypeScript Configuration](./docs/TYPESCRIPT_CONFIG.md)** - Detailed technical setup
- **[Nuxeo Constants Integration](./docs/features/constants-integration.md)** - Guide to auto-generated and manual Nuxeo constants

### **Team Resources**
- **Package Scripts**: See `package.json` for all available commands
- **VS Code Settings**: Automatic formatting and error detection
- **Satori Components**: Type-safe design system usage

## 🎯 Project Goals

This project demonstrates:

1. **Enterprise-Grade TypeScript Setup**
   - Strict compilation options
   - Comprehensive linting rules
   - Type-safe Satori integration

2. **Developer Experience**
   - Fast development workflows
   - Intelligent IDE support
   - Automated code quality checks

3. **Design System Integration**
   - Proper Satori component usage
   - Theme management
   - Navigation patterns

## 🛠️ Development

### **Prerequisites**
- Node.js 18+ 
- npm 9+
- VS Code (recommended)

### **First Time Setup**
```bash
npm install              # Install dependencies
npm run dev:validate     # Verify setup
```

### **Daily Development**
```bash
npm start                # Start development server
# Code with real-time validation in VS Code
npm run pre-commit       # Before committing
```

## 🏛️ Architecture

### **Workspace Structure**
```
POC-WS/
├── apps/POC-WS/         # Main Angular application
├── libs/                # Shared libraries (future)
├── docs/                # Documentation
├── .vscode/             # VS Code configuration
└── node_modules/        # Dependencies including Satori packages
```

### **Satori Packages**
- `@hylandsoftware/satori-devkit` - Core development tools
- `@hylandsoftware/satori-layout` - Layout components
- `@hylandsoftware/satori-workspace` - Workspace utilities
- `@hylandsoftware/satori-tokens` - Design tokens

## 🔧 Configuration Highlights

### **TypeScript**
- Target: ES2022 with bundler module resolution
- Strict mode: All strict options enabled
- Path mapping: Clean imports with `@core/*`, `@satori/*`

### **ESLint**
- TypeScript-specific rules
- Naming convention enforcement
- Nx module boundary checks

### **VS Code**
- Automatic lint fixing on save
- Real-time type checking
- Import organization
- Path intellisense

## 🚨 Important Notes

> **⚠️ Satori Design System Compatibility**
> 
> Our TypeScript configuration **enhances** the Satori design system usage rather than deviating from it. All configurations maintain full compatibility with Satori packages while providing additional type safety and better developer experience.

## 🤝 Contributing

1. **Read Documentation**: Check `docs/DEVELOPMENT_WORKFLOW.md`
2. **Follow Standards**: Use provided TypeScript and ESLint configurations
3. **Validate Code**: Run `npm run pre-commit` before committing
4. **Create PR**: Ensure `npm run validate` passes

## 🆘 Getting Help

### **Quick Troubleshooting**
```bash
npm run clean            # Clear cache
npm install              # Reinstall dependencies
npm run dev:validate     # Check for issues
```

### **Documentation**
- **[Development Workflow](./docs/DEVELOPMENT_WORKFLOW.md)** - Daily commands and scenarios
- **[TypeScript Config](./docs/TYPESCRIPT_CONFIG.md)** - Technical details and troubleshooting

### **Common Issues**
- Build failures → Check `npm run type-check`
- Lint errors → Run `npm run lint:fix`
- VS Code issues → Restart TypeScript server

## 📊 Project Status

- ✅ **Build**: Passing
- ✅ **Lint**: Passing  
- ✅ **Type Check**: Passing
- ✅ **Satori Integration**: Compatible
- ✅ **Documentation**: Complete

## 📝 License

MIT License - See LICENSE file for details.

---

**Happy coding!** 🚀

For detailed workflows and daily commands, see **[Development Workflow Guide](./docs/DEVELOPMENT_WORKFLOW.md)**.
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
