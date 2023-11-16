import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { PrismaChatService } from './prisma/chat/prisma.chat.service';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaUser = new PrismaChatService;//toDelete
  
  prismaUser.createUser();//toDelete
 

  // Define your CORS options here
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Replace with your React app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to handle cookies or authentication
  };
  // Enable CORS using the provided options
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe(
    {whitelist: true,}
  ));

  await app.listen(4000);
}
bootstrap();
