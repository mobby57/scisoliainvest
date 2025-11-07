# Security Scanning Quick Reference

## 🔍 Available Security Scans

### 1. Dependabot
- **Purpose**: Automated dependency updates
- **Schedule**: Weekly (Mondays, 09:00 UTC)
- **Coverage**: npm (root, backend, frontend), Docker, GitHub Actions
- **Action Required**: Review and merge PRs in the repository

### 2. Trivy Security Scanning
- **Purpose**: Vulnerability scanning for containers and filesystems
- **Schedule**: 
  - On push to main/develop
  - On PRs to main/develop
  - Daily at 2 AM UTC
- **Scans**:
  - Filesystem vulnerabilities
  - Backend Docker image
  - Frontend Docker image
  - Configuration files
- **View Results**: GitHub Security tab → Code scanning alerts

### 3. OWASP ZAP
- **Purpose**: Dynamic application security testing
- **Schedule**: Nightly at 3 AM UTC (baseline scan)
- **Manual Trigger**: Actions → "OWASP ZAP Security Scan" → Run workflow
- **Scan Types**:
  - Baseline: Quick passive scan (~5-15 min)
  - Full: Comprehensive active scan (hours)
  - API: OpenAPI/Swagger spec scanning
- **View Results**: Download artifacts from workflow runs

## 🚀 Quick Actions

### Run Manual ZAP Scan
1. Go to Actions → "OWASP ZAP Security Scan"
2. Click "Run workflow"
3. Select scan type (baseline/full)
4. Enter staging URL (optional)
5. Click "Run workflow"

### View Security Alerts
1. Go to Security tab
2. Click "Code scanning alerts"
3. Filter by tool (Trivy, CodeQL, etc.)

### Update ZAP Staging URL
Edit `.github/workflows/zap-scan.yml`:
```yaml
env:
  STAGING_URL: 'https://your-staging-url.example.com'
```

### Configure ZAP Rules
Edit `.zap/rules.tsv`:
```
RULE_ID	THRESHOLD	NOTES
10020	WARN	X-Frame-Options Header Not Set
```

## 📊 Severity Levels

### Trivy
- CRITICAL: Immediate action required
- HIGH: Address within 1 week
- MEDIUM: Address within 1 month
- LOW/INFO: Review and document

### ZAP
- FAIL: Blocks deployment
- WARN: Requires review
- INFO: Informational only
- IGNORE: Rule disabled

## 📝 Common Tasks

### False Positive in Trivy
Create `.trivyignore`:
```
# CVE-2023-12345: False positive - explanation
CVE-2023-12345
```

### False Positive in ZAP
Update `.zap/rules.tsv`:
```
10020	IGNORE	False positive - explanation
```

### Too Many Dependabot PRs
Edit `.github/dependabot.yml`:
```yaml
open-pull-requests-limit: 5  # Reduce from 10
```

## 🔗 Resources

- [Full Documentation](docs/SECURITY_SCANNING_GUIDE.md)
- [Trivy Docs](https://aquasecurity.github.io/trivy/)
- [OWASP ZAP Docs](https://www.zaproxy.org/docs/)
- [Dependabot Docs](https://docs.github.com/en/code-security/dependabot)

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `.github/dependabot.yml` | Dependabot configuration |
| `.github/workflows/trivy-scan.yml` | Trivy scanning workflow |
| `.github/workflows/zap-scan.yml` | OWASP ZAP scanning workflow |
| `.zap/rules.tsv` | ZAP scanning rules |
| `.trivyignore` | Trivy false positives (create if needed) |

## 🛡️ Best Practices

1. **Review security alerts weekly**
2. **Address CRITICAL/HIGH vulnerabilities immediately**
3. **Run full ZAP scan before releases**
4. **Keep dependencies up to date via Dependabot**
5. **Document accepted risks**
6. **Update staging URL in ZAP config**
7. **Customize ZAP rules for your environment**
8. **Monitor scheduled scan results**
