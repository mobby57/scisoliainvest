# Security Scanning Setup Guide

This document describes the security scanning infrastructure implemented for the SCI Solia Invest project.

## Overview

The project uses multiple security scanning tools integrated into the CI/CD pipeline:

1. **Dependabot**: Automated dependency updates and vulnerability alerts
2. **Trivy**: Comprehensive vulnerability scanning for containers, filesystems, and configurations
3. **OWASP ZAP**: Dynamic application security testing (DAST) for web applications

## 1. Dependabot Configuration

### Location
`.github/dependabot.yml`

### What it does
- Monitors npm dependencies in root, backend, and frontend directories
- Monitors Docker base images in Dockerfiles
- Monitors GitHub Actions versions
- Creates automated pull requests for dependency updates

### Schedule
- Runs weekly on Mondays at 09:00 UTC
- Up to 10 PRs for npm dependencies per directory
- Up to 5 PRs for Docker and GitHub Actions

### Configuration
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Customization
Edit `.github/dependabot.yml` to:
- Change update frequency (daily, weekly, monthly)
- Adjust PR limits
- Add/remove directories
- Configure assignees and reviewers

## 2. Trivy Vulnerability Scanning

### Location
`.github/workflows/trivy-scan.yml`

### What it does
Trivy performs four types of scans:

1. **Filesystem Scan**: Scans source code and dependencies for vulnerabilities
2. **Backend Image Scan**: Scans the built backend Docker image
3. **Frontend Image Scan**: Scans the built frontend Docker image
4. **Config Scan**: Scans configuration files for misconfigurations (Dockerfiles, K8s manifests, etc.)

### When it runs
- On push to `main` or `develop` branches
- On pull requests to `main` or `develop` branches
- Daily at 2 AM UTC (scheduled)
- Manually via GitHub Actions UI

### Severity Levels
Scans report on:
- CRITICAL
- HIGH
- MEDIUM

(LOW and INFO vulnerabilities are filtered out)

### Results
- SARIF reports uploaded to GitHub Security tab
- Table format output in GitHub Actions logs
- Does not fail the build (exit-code: 0)

### Viewing Results
1. Go to the repository's Security tab
2. Click "Code scanning alerts"
3. Filter by tool: "Trivy"
4. Review and triage alerts

### Customization

To change severity levels:
```yaml
severity: 'CRITICAL,HIGH,MEDIUM,LOW'
```

To fail the build on vulnerabilities:
```yaml
exit-code: '1'  # Fails on any vulnerability found
```

To scan specific paths:
```yaml
scan-ref: './backend'  # Only scan backend directory
```

## 3. OWASP ZAP Security Scanning

### Location
`.github/workflows/zap-scan.yml`

### What it does
OWASP ZAP performs dynamic application security testing:

1. **Baseline Scan**: Quick passive scan (default, runs nightly)
   - Spiders the application
   - Performs passive scanning
   - Takes ~5-15 minutes

2. **Full Scan**: Comprehensive active scan (manual trigger)
   - Includes baseline scan
   - Performs active attacks
   - Takes significantly longer (hours)

3. **API Scan**: Scans API endpoints using OpenAPI/Swagger specification
   - Requires API spec file in `docs/api/`
   - Only runs if spec file exists

### When it runs
- **Nightly**: Baseline scan at 3 AM UTC
- **Manual**: Can be triggered via GitHub Actions UI with custom parameters

### Configuration

#### Setting the Staging URL
Edit `.github/workflows/zap-scan.yml`:
```yaml
env:
  STAGING_URL: 'https://your-staging-url.example.com'
```

Or provide it when manually triggering the workflow.

#### ZAP Rules Configuration
Edit `.zap/rules.tsv` to customize rule thresholds:
```
RULE_ID	THRESHOLD	NOTES
10020	WARN	X-Frame-Options Header Not Set
10038	FAIL	Content Security Policy (CSP) Header Not Set
```

Thresholds:
- `IGNORE`: Disable the rule
- `INFO`: Informational only
- `WARN`: Warning (doesn't fail scan)
- `FAIL`: Fails the scan

### Results
- HTML, JSON, and Markdown reports generated
- Uploaded as GitHub Actions artifacts
- Retained for 30 days
- Issues optionally created in the repository

### Viewing Results
1. Go to the workflow run in GitHub Actions
2. Download the scan report artifacts
3. Open `report_html.html` in a browser

### Manual Trigger
1. Go to Actions → "OWASP ZAP Security Scan"
2. Click "Run workflow"
3. Select scan type and provide target URL
4. Click "Run workflow"

## 4. Security Workflow Integration

### Recommended Workflow

1. **Development**
   - Dependabot creates PRs for dependency updates
   - Review and merge dependency updates
   
2. **Pull Requests**
   - Trivy scans run automatically
   - Review any new vulnerabilities in Security tab
   - Address critical/high vulnerabilities before merging

3. **Main Branch**
   - Trivy scans run on every push
   - Monitor Security tab for new alerts

4. **Nightly**
   - Trivy runs daily scheduled scans
   - ZAP runs baseline scans against staging
   - Review scan results next morning

5. **Before Release**
   - Run ZAP full scan manually
   - Address all critical findings
   - Review and document accepted risks

## 5. Best Practices

### Triaging Vulnerabilities

1. **Critical/High**: Address immediately
   - Security patches
   - Upgrade dependencies
   - Apply workarounds if patches unavailable

2. **Medium**: Address in next sprint
   - Plan remediation
   - Document timeline

3. **Low/Info**: Review and document
   - Accept risk if appropriate
   - Schedule for future work

### False Positives

If a scan reports a false positive:

1. **Trivy**: Add to `.trivyignore` file
   ```
   # CVE-XXXX-XXXXX: False positive - reason
   CVE-2023-12345
   ```

2. **ZAP**: Update `.zap/rules.tsv` to IGNORE or INFO
   ```
   10020	IGNORE	False positive for our architecture
   ```

### Keeping Scans Up to Date

- **Trivy**: Automatically uses latest scanner version
- **ZAP**: Update action versions in workflow files periodically
- **Dependabot**: Automatically monitors GitHub Actions versions

## 6. Troubleshooting

### Trivy Scan Failures

**Problem**: Docker build fails
- Check Dockerfile syntax
- Ensure all required files exist
- Review Docker build logs

**Problem**: Too many vulnerabilities reported
- Set stricter severity filter
- Update base images to newer versions
- Review and accept known issues

### ZAP Scan Failures

**Problem**: Cannot reach staging URL
- Verify staging environment is running
- Check firewall/network access
- Update `STAGING_URL` in workflow

**Problem**: Too many alerts
- Review and update `.zap/rules.tsv`
- Set appropriate thresholds
- Document accepted risks

### Dependabot Issues

**Problem**: Too many PRs
- Reduce `open-pull-requests-limit`
- Change schedule to monthly
- Group related updates

**Problem**: Incompatible updates
- Review and test updates locally
- Pin specific versions if needed
- Update gradually

## 7. Security Contacts

For security issues:
- Review GitHub Security tab
- Create issues with `security` label
- Follow responsible disclosure practices

## 8. Additional Resources

- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)

## 9. Maintenance

### Weekly
- Review Dependabot PRs
- Check Security tab for new alerts
- Review ZAP scan reports

### Monthly
- Update workflow action versions
- Review and update ZAP rules
- Audit accepted risks

### Quarterly
- Full security review
- Update documentation
- Team security training
