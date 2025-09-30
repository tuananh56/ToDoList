// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  assigneeId?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string; // nhận dạng chuỗi ISO từ client
}
