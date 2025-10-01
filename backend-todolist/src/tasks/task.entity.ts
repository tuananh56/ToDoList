import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Group } from '../groups/group.entity';
import { User } from '../users/user.entity';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'late';
export type TaskPriority = 'low' | 'medium' | 'high';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed', 'late'],
    default: 'pending',
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: TaskPriority;

  @Column({ type: 'timestamp', nullable: true })
  deadline?: Date | null;

  @ManyToOne(() => Group, (group) => group.tasks, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => User, { nullable: true, eager: true })
  assignee?: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
