# Quick Start Guide

This guide will help you get Backstage up and running in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or 22 (LTS recommended)
  ```bash
  node --version  # Should output v20.x.x or v22.x.x
  ```

- **Yarn**: Modern version (4.8.1+)
  ```bash
  yarn --version  # Should output 4.8.1 or higher
  ```

- **Git**: For version control
  ```bash
  git --version
  ```

- **Docker** (optional but recommended): For running databases and other services
  ```bash
  docker --version
  ```

## Installation Steps

### 1. Create a New Backstage App

Use the Backstage CLI to create a new application:

```bash
npx @backstage/create-app@latest
```

You'll be prompted to enter a name for your app. For example:

```
? Enter a name for the app [required] my-backstage-app
```

### 2. Navigate to Your App Directory

```bash
cd my-backstage-app
```

### 3. Start the Development Server

```bash
yarn dev
```

This command will:
- Start the frontend on http://localhost:3000
- Start the backend on http://localhost:7007
- Open your default browser automatically

## Project Structure

After creation, your project will have the following structure:

```
my-backstage-app/
├── packages/
│   ├── app/           # Frontend application
│   └── backend/       # Backend application
├── plugins/           # Custom plugins (if any)
├── app-config.yaml    # Main configuration file
├── package.json       # Root package configuration
└── README.md         # Project README
```

## Next Steps

### 1. Explore the Interface

- **Software Catalog**: View and manage your software components
- **TechDocs**: Access technical documentation
- **API Explorer**: Discover and interact with APIs
- **Templates**: Create new projects from templates

### 2. Customize Your Installation

Edit `app-config.yaml` to customize your Backstage instance:

```yaml
app:
  title: My Company Developer Portal
  baseUrl: http://localhost:3000

organization:
  name: My Company
```

### 3. Add Your First Component

Create a `catalog-info.yaml` file in your repository:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  description: My first service
spec:
  type: service
  lifecycle: production
  owner: team-a
```

### 4. Set Up Authentication

Configure authentication providers in `app-config.yaml`:

```yaml
auth:
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
```

### 5. Install Plugins

Browse available plugins at https://backstage.io/plugins and install them:

```bash
yarn add --cwd packages/app @backstage/plugin-[plugin-name]
```

## Common Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build

# Type checking
yarn tsc

# Linting
yarn lint --fix

# Format code
yarn prettier --write .
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
PORT=3001 yarn dev
```

### Build Errors

Clear the build cache:

```bash
yarn clean
yarn install
yarn dev
```

### Database Connection Issues

If using PostgreSQL, ensure the database is running:

```bash
docker compose -f docker-compose.deps.yml up -d
```

## Additional Resources

- [Official Documentation](https://backstage.io/docs)
- [Getting Started Guide](https://backstage.io/docs/getting-started)
- [Plugin Directory](https://backstage.io/plugins)
- [Discord Community](https://discord.gg/backstage-687207715902193673)
- [GitHub Discussions](https://github.com/backstage/backstage/discussions)

## Support

- **Discord**: Join our [Discord community](https://discord.gg/backstage-687207715902193673)
- **GitHub Issues**: Report bugs or request features
- **Stack Overflow**: Tag questions with `backstage`

---

**Ready to dive deeper?** Check out the [full documentation](https://backstage.io/docs) to learn about advanced features and customization options.
