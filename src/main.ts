import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });
    // Start RabbitMQ consumer
    const rabbitMQService = app.get(RabbitMQService);
  await rabbitMQService.onModuleInit(); // Ensure initialization
  await rabbitMQService.receiveMessages();
  
  await app.listen(3000);
}
bootstrap();
