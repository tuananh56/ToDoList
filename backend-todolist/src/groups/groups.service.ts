import {
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { User } from '../users/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    private usersService: UsersService,
  ) {}

  // ✅ Tạo group với leader
  async createGroup(dto: CreateGroupDto, leaderId: number) {
    const leader = await this.usersService.findById(leaderId);
    if (!leader) throw new NotFoundException('Leader not found');

    const group = this.groupRepo.create({
      ...dto,
      leader,
      members: [leader], // cho leader làm thành viên luôn
    });

    return this.groupRepo.save(group);
  }

  async addMember(groupId: number, keyword: string, leaderId: number) {
    this.logger.log(
      `addMember called with groupId=${groupId}, keyword=${keyword}, leaderId=${leaderId}`,
    );

    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['leader', 'members'],
    });
    if (!group) {
      this.logger.warn(`Group not found: groupId=${groupId}`);
      throw new NotFoundException('Group not found');
    }

    if (group.leader.id !== leaderId) {
      this.logger.warn(`User ${leaderId} is not leader of group ${groupId}`);
      throw new ForbiddenException('Only leader can add members');
    }

    // tìm theo email hoặc username
    const user =
      (await this.usersService.findByEmail(keyword)) ||
      (await this.usersService.findByUsername(keyword));

    if (!user) {
      this.logger.warn(`User not found: keyword=${keyword}`);
      throw new NotFoundException('User not found');
    }

    // Tránh thêm trùng
    if (group.members.find((m) => m.id === user.id)) {
      this.logger.log(`User ${keyword} already member of group ${groupId}`);
      return group;
    }

    group.members.push(user);
    const updatedGroup = await this.groupRepo.save(group);
    this.logger.log(
      `User ${keyword} added to group ${groupId}. Total members: ${updatedGroup.members.length}`,
    );
    return updatedGroup;
  }

  // ✅ Lấy danh sách group của user
  async getGroupsByUser(userId: number) {
    return this.groupRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('group.leader', 'leader')
      .where('member.id = :userId', { userId })
      .orWhere('leader.id = :userId', { userId })
      .getMany();
  }

  // ✅ Kết thúc group
  async endGroup(groupId: number, leaderId: number) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['leader'],
    });

    if (!group) throw new NotFoundException('Group not found');
    if (group.leader.id !== leaderId) {
      throw new ForbiddenException('Only leader can end the project');
    }

    group.isEnded = true;
    return this.groupRepo.save(group);
  }

  // ✅ Xem chi tiết group
  async getGroupDetail(groupId: number) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['leader', 'members', 'tasks', 'tasks.assignee'],
    });

    if (!group) throw new NotFoundException('Group not found');
    return group;
  }
}
