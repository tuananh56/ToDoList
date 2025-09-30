// src/groups/dto/add-member.dto.ts
import { IsString } from 'class-validator';

export class AddMemberDto {
  @IsString()
  keyword: string; // username hoặc email
}
