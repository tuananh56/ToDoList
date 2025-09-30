import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { Group } from './groups/group.entity';
import { Task } from './tasks/task.entity';
import { GroupsModule } from './groups/groups.module';
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, 
      username: 'postgres',
      password: '0000',
      database: 'ToDoListDB',
      entities: [User, Group, Task], 
      synchronize: true,
      autoLoadEntities: true,
    }),

    UsersModule,
    GroupsModule,
    AuthModule,
    TasksModule,
    //ProjectsModule, // ✅ thêm module Projects
  ],
})
export class AppModule {}
