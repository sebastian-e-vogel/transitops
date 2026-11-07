import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';
import { EnvValidationError, parseEnv, type Env } from './config/env.js';
import { loadRootEnv } from './config/load-root-env.js';

function loadConfig(): Env {
  loadRootEnv();
  try {
    return parseEnv();
  } catch (error) {
    if (error instanceof EnvValidationError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

async function bootstrap() {
  const env = loadConfig();
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.listen(env.PORT);
}
await bootstrap();
