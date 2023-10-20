import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  //process.env.TZ = 'Europe/Paris';
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
