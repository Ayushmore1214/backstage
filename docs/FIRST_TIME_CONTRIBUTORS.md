# First Time Contributors Guide

Welcome! 👋 We're excited to have you contribute to Backstage. This guide will help you make your first contribution.

## Table of Contents

- [Before You Start](#before-you-start)
- [Finding Your First Issue](#finding-your-first-issue)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Making Your First Contribution](#making-your-first-contribution)
- [Getting Help](#getting-help)

## Before You Start

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js**: Version 20 or 22
- **Yarn**: Version 4.8.1 or higher
- **Git**: For version control
- **A code editor**: VS Code, IntelliJ IDEA, or your preferred editor

### Understanding the Project

1. **Read the README**: Start with the [main README](../README.md) to understand what Backstage is
2. **Explore the docs**: Check out the [documentation](https://backstage.io/docs)
3. **Join Discord**: Join our [Discord community](https://discord.gg/backstage-687207715902193673) to ask questions

## Finding Your First Issue

### Good First Issues

Look for issues labeled `good first issue`:
- [Good First Issues](https://github.com/backstage/backstage/labels/good%20first%20issue)
- [Help Wanted](https://github.com/backstage/backstage/labels/help%20wanted)

### Types of Contributions

You can contribute in many ways:

1. **Documentation**: Fix typos, improve clarity, add examples
2. **Bug Fixes**: Fix existing bugs
3. **Features**: Add new features (discuss in an issue first)
4. **Tests**: Add or improve test coverage
5. **Code Review**: Review pull requests

### Claiming an Issue

1. Find an issue you'd like to work on
2. Comment on the issue saying you'd like to work on it
3. Wait for a maintainer to assign it to you
4. Start working on it!

## Setting Up Your Development Environment

### 1. Fork the Repository

1. Go to https://github.com/backstage/backstage
2. Click the "Fork" button in the top right
3. This creates a copy in your GitHub account

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/backstage.git
cd backstage
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/backstage/backstage.git
git remote -v  # Verify the remotes
```

### 4. Install Dependencies

```bash
yarn install
```

This might take a while (5-10 minutes) depending on your internet connection.

### 5. Verify the Setup

```bash
# Run type checking
yarn tsc

# Start the development server
yarn start
```

If everything works, you should see Backstage running at http://localhost:3000 🎉

## Making Your First Contribution

### Step 1: Create a Branch

Always create a new branch for your work:

```bash
# Make sure you're on master
git checkout master

# Update your master branch
git pull upstream master

# Create a new branch
git checkout -b fix/my-first-contribution
```

Branch naming conventions:
- `fix/` - for bug fixes
- `feature/` - for new features
- `docs/` - for documentation changes

### Step 2: Make Your Changes

1. Open the relevant files in your editor
2. Make your changes
3. Follow the coding guidelines (see [STYLE.md](../STYLE.md))

### Step 3: Test Your Changes

```bash
# Run tests for the package you modified
yarn test --no-watch packages/core-components

# Run type checking
yarn tsc

# Run linting
yarn lint --fix
```

### Step 4: Commit Your Changes

We use [Developer Certificate of Origin (DCO)](../CONTRIBUTING.md#developer-certificate-of-origin), so sign your commits:

```bash
git add .
git commit -s -m "fix: description of your fix"
```

Commit message format:
- `fix:` - Bug fixes
- `feat:` - New features
- `docs:` - Documentation changes
- `test:` - Test changes
- `chore:` - Maintenance tasks

### Step 5: Create a Changeset (if needed)

If your change affects a published package:

```bash
yarn changeset
```

Follow the prompts:
1. Select the packages affected by your change
2. Choose the version bump type (patch/minor/major)
3. Write a summary of your change

### Step 6: Push Your Changes

```bash
git push origin fix/my-first-contribution
```

### Step 7: Open a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template:
   - **Description**: What did you change and why?
   - **Motivation**: What problem does this solve?
   - **Testing**: How did you test this?
4. Submit the PR!

### Step 8: Respond to Feedback

- Maintainers will review your PR
- They might request changes
- Make the requested changes and push them
- Your PR will be merged once approved! 🎉

## Getting Help

### Where to Ask Questions

1. **Discord**: [#support channel](https://discord.gg/backstage-687207715902193673)
2. **GitHub Discussions**: [Ask a question](https://github.com/backstage/backstage/discussions)
3. **Stack Overflow**: Tag questions with `backstage`

### Common Beginner Questions

**Q: I'm getting build errors. What should I do?**
A: Try `yarn clean && yarn install && yarn tsc`

**Q: My PR has merge conflicts. How do I fix them?**
A: 
```bash
git checkout master
git pull upstream master
git checkout your-branch
git merge master
# Resolve conflicts
git commit
git push
```

**Q: How long does it take to review my PR?**
A: It varies, but usually within a few days. Be patient!

**Q: Can I work on multiple issues at once?**
A: It's better to focus on one at a time, especially for your first contributions.

## Tips for Success

1. ✅ **Start small**: Begin with documentation or simple bug fixes
2. ✅ **Read existing code**: Look at similar code to understand the patterns
3. ✅ **Ask questions**: Don't hesitate to ask if you're stuck
4. ✅ **Be patient**: Reviews can take time
5. ✅ **Follow up**: Respond to review comments promptly
6. ✅ **Test thoroughly**: Make sure your changes work
7. ✅ **Stay updated**: Keep your fork synchronized with upstream

## What Happens After Your First Contribution?

After your first PR is merged:

1. 🎉 You're now a Backstage contributor!
2. 🌟 You can add this to your GitHub profile
3. 📈 Consider taking on more complex issues
4. 🤝 Help other first-time contributors
5. 💬 Share your experience in the community

## Recognition

All contributors are recognized in our:
- [ADOPTERS.md](../ADOPTERS.md) - If you're using Backstage
- Release notes - For your contributions
- Community updates - For significant contributions

## Resources

- [Main Contributing Guide](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Style Guide](../STYLE.md)
- [Review Guide](../REVIEWING.md)
- [Security Policy](../SECURITY.md)

---

**Thank you for contributing to Backstage!** Your contributions help make developer experience better for everyone. 💙

If you have questions or need help, we're here for you. Welcome to the community! 🚀
