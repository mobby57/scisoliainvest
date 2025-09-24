# Docker Client Build Fix TODO

## Completed
- [x] Create packages/client/.dockerignore with exclusions
- [x] Update packages/client/Dockerfile to multi-stage production build with pnpm

## Pending
- [ ] Rebuild Docker image: cd packages/client && docker build -t solia-client:latest .
- [ ] Load image to Kind: kind load docker-image solia-client:latest --name solia
- [ ] Restart deployment: kubectl rollout restart deployment solia-client-deployment -n solia
