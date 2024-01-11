import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { createConnection } from 'typeorm';
import { UsersModule } from './users/users.module';
import * as config from "config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './conifg/database/typorm.config.mj';

// const dbConfig = config.get("db");
@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig),UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor() {
  //   createConnection({
  //     type: dbConfig.type,
  //     host: process.env.RDS_HOSTNAME || dbConfig.host,
  //     port: process.env.RDS_PORT || dbConfig.post,
  //     username: process.env.RDS_USERNAME || dbConfig.username,
  //     password: process.env.RDS_PASSWORD || dbConfig.password,
  //     database: process.env.RDS_DB_NAME || dbConfig.database,
  //     entities: [__dirname + "/../../**/*.entity.{js, ts}"],
  //     synchronize: true,
  //   })
  //     .then((connection) => {
  //       console.log('연결 되었나!', connection);
  //     })
  //     .catch((error) => console.log(error));
  // }
}
