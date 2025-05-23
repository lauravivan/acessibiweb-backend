import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonUserModule } from './common-users/common-users.module';
import { DeficiencesModule } from './deficiences/deficiences.module';
import { GuidelinesModule } from './guidelines/guidelines.module';
import { ProjectsModule } from './projects/projects.module';
import { CommonUsersProjectsModule } from './common-users-projects/common-users-projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      synchronize: true, // true = shouldn't be used in production - otherwise you can lose production data
      autoLoadEntities: true,
    }),
    CommonUserModule,
    DeficiencesModule,
    GuidelinesModule,
    ProjectsModule,
    CommonUsersProjectsModule,
  ],
})
export class AppModule {}
