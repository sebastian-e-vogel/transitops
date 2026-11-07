import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { installLifecycle } from './lifecycle.js';
import { WorkerModule } from './worker.module.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  installLifecycle(app);
  new Logger('Worker').log(`Worker started (pid ${process.pid})`);
}

await bootstrap();
