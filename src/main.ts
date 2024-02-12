import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cors  = {
    origin:['http://localhost:8085'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD'
  }

  app.enableCors(cors)

  await app.listen(process.env.PORT);
}
bootstrap();
