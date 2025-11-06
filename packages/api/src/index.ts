import { app } from './server.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${config.nodeEnv}`);
});
