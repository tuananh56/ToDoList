import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Group } from '../groups/group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'member' })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  // ✅ 1 user có thể tham gia nhiều group (members)
  @ManyToMany(() => Group, (group) => group.members)
  groups: Group[];

  // ✅ 1 user có thể làm leader của nhiều group
  @OneToMany(() => Group, (group) => group.leader)
  groupsLed: Group[];
}
