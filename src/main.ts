import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enables CORS for all origins
  await app.listen(process.env.PORT ?? 3000);
  bcrypt.hashSync('password123', 10);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
