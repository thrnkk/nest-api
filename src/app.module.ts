import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.quvzb.mongodb.net/smartranking?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true}), 
    PlayersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
