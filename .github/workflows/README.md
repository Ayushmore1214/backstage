# GitHub Workflows - Quick Reference

This directory contains all GitHub Actions workflows for the Backstage repository.

## 🆕 Recently Added Workflows

The following workflows have been added to improve security, automation, and maintenance:

### Security Workflows

- **`dependency-review.yml`** - Automatically reviews dependencies in PRs for vulnerabilities and license compliance
- **`workflow-security-audit.yml`** - Audits all workflow files for security issues (missing permissions, script injection risks, etc.)

### Monitoring & Maintenance

- **`workflow-performance-monitor.yml`** - Tracks workflow execution times and generates performance reports
- **`cleanup-stale-runs.yml`** - Automatically cleans up old workflow runs to save storage
- **`action-version-check.yml`** - Checks for unpinned actions and generates version inventory
- **`dependency-update-check.yml`** - Monthly check for outdated dependencies with tracking issue creation

## 📚 Documentation

For comprehensive documentation about all workflows, security best practices, and maintenance guidelines, see:

**[.github/WORKFLOWS.md](.github/WORKFLOWS.md)**

## 🔒 Security Improvements

All workflows now include:

1. ✅ **Explicit permissions** - Following principle of least privilege
2. ✅ **Timeout constraints** - Prevent runaway workflows
3. ✅ **Concurrency controls** - Prevent duplicate runs and save resources
4. ✅ **Action pinning** - All actions pinned to specific SHA commits
5. ✅ **Harden Runner** - Network egress monitoring on critical workflows

## 🚀 Quick Start

### Running Workflows Manually

Some workflows can be triggered manually via workflow_dispatch:

```bash
# Via GitHub UI: Actions tab → Select workflow → Run workflow

# Or via GitHub CLI:
gh workflow run workflow-security-audit.yml
gh workflow run cleanup-stale-runs.yml
gh workflow run dependency-update-check.yml
```

### Viewing Workflow Results

- **Job Summaries**: Most workflows now include detailed summaries in the Actions tab
- **Security Alerts**: Check the Security tab for CodeQL and dependency alerts
- **Performance**: Weekly performance reports in workflow-performance-monitor.yml runs

## 📊 Workflow Categories

| Category | Count | Examples |
|----------|-------|----------|
| CI/CD | 8 | ci.yml, deploy_packages.yml, deploy_docker-image.yml |
| Security | 5 | verify_codeql.yml, dependency-review.yml, scorecard.yml |
| Testing | 6 | verify_e2e-*.yml, verify_chromatic.yml, verify_accessibility.yml |
| Automation | 8 | sync_*.yml, automate_*.yml |
| Monitoring | 4 | workflow-performance-monitor.yml, cleanup-stale-runs.yml |

## 🛠️ Troubleshooting

### Common Issues

**Workflow fails with permission error:**
- Check that the workflow has the correct permissions declared
- Verify that the action being used requires only the granted permissions

**Timeout errors:**
- Check if the job timeout needs to be increased
- Look for performance bottlenecks in the workflow

**Concurrency conflicts:**
- Adjust `cancel-in-progress` setting if needed
- Check if jobs can safely be cancelled

**Security audit failures:**
- Review the workflow-security-audit.yml output
- Fix any critical or high severity issues before merging

## 🔗 Related Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Security Hardening Guide](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Backstage SECURITY.md](../SECURITY.md)
- [Backstage CONTRIBUTING.md](../CONTRIBUTING.md)

## 💡 Tips

1. **Before adding a new workflow**: Review WORKFLOWS.md for security best practices
2. **After updating workflows**: Run workflow-security-audit.yml to validate changes
3. **Monitor performance**: Check workflow-performance-monitor.yml for slow workflows
4. **Keep actions updated**: Review action-version-check.yml output regularly

## 📝 Contributing

When contributing workflow changes:

1. Follow the security guidelines in WORKFLOWS.md
2. Add explicit permissions declarations
3. Pin all actions to specific SHA commits
4. Add timeout constraints to jobs
5. Test in a draft PR first
6. Run workflow-security-audit.yml to validate

---

For questions or issues, please open a GitHub issue with the `workflows` label.
