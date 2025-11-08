# Security Scanning Configuration

This directory contains configuration files for security scanning tools used in the CI/CD pipeline.

## OWASP ZAP Configuration

### Rules File (`rules.tsv`)

The `rules.tsv` file configures OWASP ZAP scanning rules and thresholds for the SCI Solia Invest application.

#### File Format
```
RULE_ID	THRESHOLD	[NOTES]
```

- **RULE_ID**: The ZAP rule identifier (e.g., 10020, 10021)
- **THRESHOLD**: One of the following:
  - `IGNORE`: Rule is disabled
  - `INFO`: Alert is informational only
  - `WARN`: Alert is a warning (doesn't fail the scan)
  - `FAIL`: Alert causes the scan to fail
- **NOTES**: Optional notes explaining the configuration

#### Customizing Rules

To customize the scanning rules:

1. Run a ZAP scan and review the results
2. Identify rules that need adjustment
3. Edit `.zap/rules.tsv` and set appropriate thresholds
4. Commit and push the changes

#### Common Rules

See the comments in `rules.tsv` for a comprehensive list of common ZAP rules and their meanings.

### Updating the Staging URL

To update the staging URL for ZAP scans:

1. Edit `.github/workflows/zap-scan.yml`
2. Update the `STAGING_URL` environment variable with your actual staging URL
3. Commit and push the changes

Alternatively, you can manually trigger the workflow and provide a custom URL.

## Additional Resources

- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [ZAP GitHub Actions](https://github.com/zaproxy/action-baseline)
- [ZAP Alert Reference](https://www.zaproxy.org/docs/alerts/)
