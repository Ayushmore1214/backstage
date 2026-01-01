> [!NOTE]
> 🏖 From Monday October 27th through November 3rd, maintainers and Spotify employees will be on vacation due to Wellness Week. Expect the project to move a little slower than normal, and support to be limited. Normal service will resume after that! 🏝

[![headline](docs/assets/headline.png)](https://backstage.io/)

# [Backstage](https://backstage.io)

English \| [한국어](README-ko_kr.md) \| [中文版](README-zh_Hans.md) \| [Français](README-fr_FR.md)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![CNCF Status](https://img.shields.io/badge/cncf%20status-incubation-blue.svg)](https://www.cncf.io/projects)
[![Discord](https://img.shields.io/discord/687207715902193673?logo=discord&label=Discord&color=5865F2&logoColor=white)](https://discord.gg/backstage-687207715902193673)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Codecov](https://img.shields.io/codecov/c/github/backstage/backstage)](https://codecov.io/gh/backstage/backstage)
[![](https://img.shields.io/github/v/release/backstage/backstage)](https://github.com/backstage/backstage/releases)
[![OpenSSF Best Practices](https://bestpractices.coreinfrastructure.org/projects/7678/badge)](https://bestpractices.coreinfrastructure.org/projects/7678)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/backstage/backstage/badge)](https://securityscorecards.dev/viewer/?uri=github.com/backstage/backstage)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/backstage/backstage/ci.yml?branch=master&label=CI&logo=github)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%20%7C%2022-green?logo=node.js)](https://nodejs.org/)

## What is Backstage?

[Backstage](https://backstage.io/) is an open source framework for building developer portals. Powered by a centralized software catalog, Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly without compromising autonomy.

Backstage unifies all your infrastructure tooling, services, and documentation to create a streamlined development environment from end to end.

![software-catalog](docs/assets/header.png)

Out of the box, Backstage includes:

- [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) for managing all your software such as microservices, libraries, data pipelines, websites, and ML models
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) for quickly spinning up new projects and standardizing your tooling with your organization’s best practices
- [Backstage TechDocs](https://backstage.io/docs/features/techdocs/) for making it easy to create, maintain, find, and use technical documentation, using a "docs like code" approach
- Plus, a growing ecosystem of [open source plugins](https://github.com/backstage/backstage/tree/master/plugins) that further expand Backstage’s customizability and functionality

Backstage was created by Spotify but is now hosted by the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) as an Incubation level project. For more information, see the [announcement](https://backstage.io/blog/2022/03/16/backstage-turns-two#out-of-the-sandbox-and-into-incubation).

## Key Features

### 🗂️ Software Catalog
Centralize and manage all your software components, services, websites, and libraries in one place with powerful search and discovery.

### 🚀 Software Templates
Standardize your development workflow with customizable templates that help teams create new projects with best practices built-in.

### 📚 TechDocs
Publish and maintain technical documentation using a "docs like code" approach, keeping documentation close to the code it describes.

### 🔌 Plugin Ecosystem
Extend Backstage with a growing ecosystem of [150+ plugins](https://backstage.io/plugins) that integrate with your existing tools and services.

### 🔐 Built-in Security
Enterprise-grade security features including authentication, authorization, and comprehensive audit logging.

### 📊 Developer Analytics
Track and improve developer productivity with built-in metrics and insights about your software ecosystem.

## Project roadmap

For information about the detailed project roadmap including delivered milestones, see [the Roadmap](https://backstage.io/docs/overview/roadmap).

## Getting Started

To start using Backstage, see the [Getting Started documentation](https://backstage.io/docs/getting-started).

📚 **New to Backstage?** Check out our [Quick Start Guide](docs/QUICKSTART.md) for a step-by-step walkthrough!

### Quick Start

```bash
# Install dependencies
npx @backstage/create-app@latest

# Navigate to your app directory
cd my-backstage-app

# Start the app
yarn dev
```

The app will be available at `http://localhost:3000` 🚀

### Prerequisites

- **Node.js**: Version 20 or 22 (LTS recommended)
- **Yarn**: Version 4.8.1 or higher
- **Git**: For version control
- **Docker** (optional): For running backend services

## Troubleshooting

### Common Issues

**Problem**: `yarn install` fails with peer dependency errors
**Solution**: Make sure you're using Node.js version 20 or 22 and Yarn version 4.8.1+

**Problem**: Port 3000 is already in use
**Solution**: Either stop the process using port 3000, or set a custom port:
```bash
PORT=3001 yarn dev
```

**Problem**: Build fails with TypeScript errors
**Solution**: Clear the build cache and rebuild:
```bash
yarn clean
yarn tsc
yarn build
```

For more help, visit our [Discord community](https://discord.gg/backstage-687207715902193673) or check the [FAQ](https://backstage.io/docs/faq).

## Documentation

The documentation of Backstage includes:

- [Main documentation](https://backstage.io/docs)
- [Software Catalog](https://backstage.io/docs/features/software-catalog/)
- [Architecture](https://backstage.io/docs/overview/architecture-overview) ([Decisions](https://backstage.io/docs/architecture-decisions/))
- [Designing for Backstage](https://backstage.io/docs/dls/design)
- [Storybook - UI components](https://backstage.io/storybook)

### Additional Guides

- 📖 [Quick Start Guide](docs/QUICKSTART.md) - Get started in minutes
- 👶 [First Time Contributors Guide](docs/FIRST_TIME_CONTRIBUTORS.md) - Your first contribution
- ⚡ [Performance Best Practices](docs/PERFORMANCE.md) - Optimize your deployment
- ✅ [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md) - Production deployment guide

## Community

To engage with our community, you can use the following resources:

- [Discord chatroom](https://discord.gg/backstage-687207715902193673) - Get support or discuss the project
- [Contributing to Backstage](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) - Start here if you want to contribute
- [RFCs](https://github.com/backstage/backstage/labels/rfc) - Help shape the technical direction
- [FAQ](https://backstage.io/docs/faq) - Frequently Asked Questions
- [Code of Conduct](CODE_OF_CONDUCT.md) - This is how we roll
- [Adopters](ADOPTERS.md) - Companies already using Backstage
- [Blog](https://backstage.io/blog/) - Announcements and updates
- [Newsletter](https://spoti.fi/backstagenewsletter) - Subscribe to our email newsletter
- [Backstage Community Sessions](https://github.com/backstage/community) - Join monthly meetups and explore Backstage community
- Give us a star ⭐️ - If you are using Backstage or think it is an interesting project, we would love a star ❤️

## Contributors

Backstage is made possible by our amazing contributors! 🎉

[![Contributors](https://contrib.rocks/image?repo=backstage/backstage)](https://github.com/backstage/backstage/graphs/contributors)

Want to contribute? Check out our:
- [Contributing Guide](CONTRIBUTING.md)
- [First Time Contributors Guide](docs/FIRST_TIME_CONTRIBUTORS.md)
- [Good First Issues](https://github.com/backstage/backstage/labels/good%20first%20issue)

## Governance

See the [GOVERNANCE.md](https://github.com/backstage/community/blob/main/GOVERNANCE.md) document in the [backstage/community](https://github.com/backstage/community) repository.

## License

Copyright 2020-2025 © The Backstage Authors. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page: https://www.linuxfoundation.org/trademark-usage

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0

## Security

Please report sensitive security issues using Spotify's [bug-bounty program](https://hackerone.com/spotify) rather than GitHub.

For further details, see our complete [security release process](SECURITY.md).
