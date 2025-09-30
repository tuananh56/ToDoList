// src/groups/group.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { eager: true })
  leader: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  members: User[];

  @OneToMany(() => Task, (task) => task.group, { eager: true })
  tasks: Task[];

  @Column({ default: false })
  isEnded: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
