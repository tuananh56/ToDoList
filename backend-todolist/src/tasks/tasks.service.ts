// src/tasks/tasks.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { Group } from '../groups/group.entity';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';


@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  // ===================== Tạo task cho group =====================
  async createTask(
    group: Group,
    dto: CreateTaskDto,
    creatorId: number,
  ): Promise<Task> {
    this.logger.log(
      `createTask called for groupId=${group.id} by userId=${creatorId}`,
    );

    // Kiểm tra quyền: chỉ leader hoặc member mới tạo task
    const isMember = group.members.some((m) => m.id === creatorId);
    if (!isMember && group.leader.id !== creatorId) {
      this.logger.warn(`User ${creatorId} không thuộc group ${group.id}`);
      throw new ForbiddenException('Bạn không thuộc group này');
    }

    // Tìm assignee nếu có
    let assignee: User | null = null;
    if (dto.assigneeId) {
      assignee = await this.usersService.findById(dto.assigneeId);
      if (!assignee) {
        this.logger.warn(`Assignee not found: id=${dto.assigneeId}`);
        throw new NotFoundException('Assignee not found');
      }
    }

    // Tạo task mới
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      group,
      assignee: assignee || null,
      status: 'pending', // mặc định
      deadline: dto.deadline ? new Date(dto.deadline) : null, // chuyển chuỗi sang Date
    });

    const savedTask = await this.taskRepo.save(task);

    // Lấy lại task vừa tạo kèm relations
    const taskWithRelations = await this.taskRepo.findOne({
      where: { id: savedTask.id },
      relations: ['assignee', 'group'],
    });

    if (!taskWithRelations) {
      //this.logger.error(`Task vừa tạo không tìm thấy: id=${savedTask.id}`);
      throw new NotFoundException('Task vừa tạo không tìm thấy');
    }

    //this.logger.log(`Task ${savedTask.id} created for group ${group.id}`);
    return taskWithRelations;
  }

  // ===================== Lấy danh sách task theo group =====================
  async getTasksByGroup(groupId: number): Promise<Task[]> {
    this.logger.log(`getTasksByGroup called for groupId=${groupId}`);

    return this.taskRepo.find({
      where: { group: { id: groupId } },
      relations: ['assignee', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  // ===================== Cập nhật trạng thái task =====================
  async updateTaskStatus(
    taskId: number,
    userId: number,
    status: TaskStatus,
  ): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['assignee', 'group', 'group.leader', 'group.members'],
    });

    if (!task) throw new NotFoundException('Task không tồn tại');

    const isAssignee = task.assignee?.id === userId;
    const isLeader = task.group.leader.id === userId;

    if (!isAssignee && !isLeader) {
      throw new ForbiddenException('Bạn không có quyền cập nhật task này');
    }

    task.status = status; // cập nhật trạng thái
    return this.taskRepo.save(task);
  }

  async updateTask(
    taskId: number,
    userId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['assignee', 'group', 'group.leader', 'group.members'],
    });
    if (!task) throw new NotFoundException('Task không tồn tại');

    const isLeader = task.group.leader.id === userId;
    const isAssignee = task.assignee?.id === userId;

    // Chỉ leader mới được sửa tất cả, assignee chỉ được đổi status
    if (!isLeader && !isAssignee) {
      throw new ForbiddenException('Bạn không có quyền sửa task này');
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;

    if (dto.assigneeId !== undefined) {
      const newAssignee = await this.usersService.findById(dto.assigneeId);
      if (!newAssignee) throw new NotFoundException('Assignee không tồn tại');
      task.assignee = newAssignee;
    }

    if (dto.deadline !== undefined) {
      task.deadline = dto.deadline ? new Date(dto.deadline) : null;
    }

    if (dto.status !== undefined) {
      // Assignee chỉ được cập nhật status
      if (!isLeader && dto.status) {
        task.status = dto.status as any;
      } else if (isLeader) {
        task.status = dto.status as any;
      }
    }

    return this.taskRepo.save(task);
  }
  async deleteTask(
    taskId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['group', 'group.leader'],
    });
    if (!task) throw new NotFoundException('Task không tồn tại');

    const isLeader = task.group.leader.id === userId;
    if (!isLeader) {
      throw new ForbiddenException('Chỉ leader mới được xóa task');
    }

    await this.taskRepo.delete(taskId);
    return { message: 'Xóa task thành công' };
  }
}
