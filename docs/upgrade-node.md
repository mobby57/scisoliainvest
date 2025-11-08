# Dependency upgrades & Node version bump

This PR upgrades the Node engine and refreshes lockfiles.

Checklist for maintainers:
- Verify CI runs with the new Node version.
- Rebuild Docker images if they pin Node base images.
- Run test suite and lint across packages.