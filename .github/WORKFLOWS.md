# GitHub Workflows Documentation

This document provides an overview of the GitHub Actions workflows used in this repository, their purposes, and security best practices.

## Table of Contents

- [Workflow Categories](#workflow-categories)
- [Security Best Practices](#security-best-practices)
- [Workflow Inventory](#workflow-inventory)
- [Maintenance Guidelines](#maintenance-guidelines)

## Workflow Categories

### 1. Continuous Integration (CI)

- **ci.yml**: Main CI workflow that runs on pull requests
  - Installs dependencies, verifies code quality, type checks, builds packages, and runs tests
  - Uses concurrency controls to cancel outdated runs
  - Matrix strategy for Node.js 20.x and 22.x
  - Timeout: 90 minutes per job

### 2. Security & Compliance

- **verify_codeql.yml**: CodeQL security scanning for JavaScript/TypeScript
  - Runs on PRs, pushes to master, and weekly schedule
  - Detects security vulnerabilities and code quality issues

- **scorecard.yml**: OSSF Scorecard supply-chain security analysis
  - Weekly schedule and on pushes to master
  - Publishes results to OpenSSF REST API

- **dependency-review.yml**: Reviews dependencies in pull requests
  - Checks for vulnerabilities and license compliance
  - Fails on moderate+ severity vulnerabilities
  - Denies GPL and LGPL licenses

- **workflow-security-audit.yml**: Audits workflow files for security issues
  - Checks for missing permissions, pull_request_target usage, unpinned actions
  - Detects potential script injection and secret exposure vulnerabilities

- **sync_snyk-monitor.yml**: Syncs Snyk monitoring and policies
  - Runs on master pushes and workflow changes
  - Generates SARIF reports for GitHub Security

### 3. Deployment

- **deploy_packages.yml**: Deploys packages to npm
  - Runs on master and patch/* branches
  - Full test suite before deployment
  - Timeout: 120 minutes for build, 30 minutes for release

- **deploy_docker-image.yml**: Builds and pushes Docker images
  - Triggered by release events or manual dispatch
  - Multi-platform builds (linux/amd64, linux/arm64)
  - Timeout: 60 minutes

- **deploy_microsite.yml**: Deploys documentation microsite

### 4. Automation & Sync

- **sync_version-packages.yml**: Creates version bump PRs via Changesets
  - Runs on master pushes
  - Uses concurrency to prevent conflicts

- **sync_dependabot-changesets.yml**: Auto-generates changesets for Dependabot PRs
- **sync_renovate-changesets.yml**: Auto-generates changesets for Renovate PRs
- **sync_code-formatting.yml**: Auto-formats code with Prettier
- **sync_release-manifest.yml**: Syncs release manifests
- **automate_issue_labels.yml**: Manages issue labels automatically
- **automate_stale.yml**: Marks and closes stale issues/PRs

### 5. Testing & Verification

- **verify_e2e-linux.yml**: End-to-end tests on Linux
  - Timeout: 60 minutes
  - Uses PostgreSQL, MySQL, Redis services

- **verify_e2e-windows.yml**: End-to-end tests on Windows
  - Timeout: 90 minutes
  - Matrix: Node.js 20.x and 22.x

- **verify_chromatic.yml**: Visual regression testing with Chromatic
- **verify_accessibility.yml**: Accessibility testing with Lighthouse CI
- **verify_docs-quality.yml**: Documentation quality checks with Vale

### 6. Monitoring & Maintenance

- **workflow-performance-monitor.yml**: Tracks workflow execution times
  - Weekly summary of performance metrics
  - Helps identify slow workflows

- **cleanup-stale-runs.yml**: Cleans up old workflow runs
  - Daily execution
  - Deletes cancelled/skipped runs older than 90 days
  - Deletes all runs older than 180 days

- **cron.yml**: Scheduled maintenance tasks
  - Runs every 5 minutes

## Security Best Practices

### 1. Principle of Least Privilege

All workflows now have explicit `permissions` declarations that grant only the minimum necessary permissions:

```yaml
permissions:
  contents: read      # Read repository contents
  pull-requests: write # Comment on PRs (if needed)
  packages: write     # Publish packages (deployment only)
```

### 2. Action Pinning

All third-party actions are pinned to specific SHA commits for security:

```yaml
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

This prevents supply chain attacks where action maintainers could inject malicious code.

### 3. Harden Runner

Critical workflows use `step-security/harden-runner` to:
- Monitor network egress traffic
- Detect anomalous behavior
- Provide audit logs

```yaml
- name: Harden Runner
  uses: step-security/harden-runner@f4a75cfd619ee5ce8d5b864b0d183aff3c69b55a # v2.13.0
  with:
    egress-policy: audit
```

### 4. Concurrency Controls

Workflows use concurrency groups to prevent duplicate runs:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Set `cancel-in-progress: false` for deployment workflows to prevent race conditions.

### 5. Timeout Protection

All critical jobs have timeout constraints to prevent runaway workflows:

```yaml
jobs:
  build:
    timeout-minutes: 60
```

### 6. Secret Handling

- Never echo secrets in logs
- Use environment variables instead of inline secrets
- Secrets are masked automatically by GitHub Actions

### 7. Pull Request Target

Workflows using `pull_request_target` are carefully reviewed as they run with write permissions in the context of the base branch. Only use for:
- Trusted automation (Dependabot, Renovate)
- Workflows that don't execute PR code

### 8. Input Validation

When using user input (PR titles, issue bodies, etc.) in `run:` commands:
- Use `actions/github-script` instead of shell commands
- Or store input in environment variables first
- Never directly interpolate user input in shell commands

## Workflow Inventory

| Workflow | Trigger | Purpose | Timeout | Concurrency |
|----------|---------|---------|---------|-------------|
| ci.yml | PR | Main CI pipeline | 90m | ✅ |
| verify_codeql.yml | PR, Push, Schedule | Security scanning | - | - |
| scorecard.yml | Push, Schedule | Supply chain security | - | - |
| dependency-review.yml | PR | Dependency vulnerability check | - | ✅ |
| deploy_packages.yml | Push (master) | NPM package deployment | 120m | ✅ |
| deploy_docker-image.yml | Dispatch, Release | Docker image build | 60m | ✅ |
| verify_e2e-linux.yml | PR, Push | Linux E2E tests | 60m | ✅ |
| verify_e2e-windows.yml | PR, Push | Windows E2E tests | 90m | ✅ |
| workflow-security-audit.yml | PR, Push, Schedule | Workflow security check | - | - |
| workflow-performance-monitor.yml | Workflow completion, Schedule | Performance tracking | - | - |
| cleanup-stale-runs.yml | Daily schedule | Cleanup old runs | - | - |

## Maintenance Guidelines

### Adding a New Workflow

1. **Always declare explicit permissions:**
   ```yaml
   permissions:
     contents: read
   ```

2. **Pin all actions to SHA:**
   ```yaml
   - uses: actions/checkout@<full-sha> # v4.2.2
   ```

3. **Add Harden Runner for sensitive workflows:**
   ```yaml
   - name: Harden Runner
     uses: step-security/harden-runner@<sha> # v2.13.0
     with:
       egress-policy: audit
   ```

4. **Set appropriate timeout:**
   ```yaml
   jobs:
     my-job:
       timeout-minutes: 30
   ```

5. **Use concurrency for PR workflows:**
   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: true
   ```

6. **Run workflow-security-audit.yml** to validate security

### Updating Actions

When updating action versions:
1. Review the changelog for breaking changes
2. Update both the SHA and the comment version
3. Test in a draft PR first
4. Update multiple workflows consistently

### Troubleshooting

- **Timeout issues**: Increase timeout-minutes or optimize job steps
- **Permission errors**: Check permissions declaration matches required access
- **Concurrency conflicts**: Adjust cancel-in-progress setting
- **Security alerts**: Review workflow-security-audit.yml output

## Related Documentation

- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [OSSF Scorecard](https://github.com/ossf/scorecard)
- [Step Security Harden Runner](https://github.com/step-security/harden-runner)

## Questions or Issues?

For questions about workflows, please:
1. Check this documentation first
2. Review the workflow file directly (comments inline)
3. Open a GitHub issue with the `workflows` label
