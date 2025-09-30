// src/tasks/tasks.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  Patch,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GroupsService } from '../groups/groups.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import type { TaskStatus } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly groupsService: GroupsService,
  ) {}

  // ===================== Tạo task cho group =====================
  @Post(':groupId')
  async createTask(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: CreateTaskDto,
    @Req() req: any,
  ) {
    const group = await this.groupsService.getGroupDetail(groupId);
    return this.tasksService.createTask(
      group,
      dto,
      req.user.sub || req.user.id, // lấy userId từ JWT
    );
  }

  // ===================== Lấy danh sách task theo group =====================
  @Get('group/:groupId') // FE gọi /tasks/group/:groupId
  async getTasks(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.tasksService.getTasksByGroup(groupId);
  }

  // ===================== Cập nhật trạng thái task =====================
  @Patch(':taskId/status')
  async updateTaskStatus(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body('status') status: TaskStatus,
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.tasksService.updateTaskStatus(taskId, userId, status);
  }

  // ===================== Sửa task =====================
  @Patch(':taskId')
  async updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.tasksService.updateTask(taskId, userId, dto);
  }

  // ===================== Xóa task =====================
  @Delete(':taskId')
  async deleteTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.tasksService.deleteTask(taskId, userId);
  }
}
