import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // ✅ bảo vệ tất cả route, đảm bảo req.user tồn tại
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // ✅ Tạo group: leaderId = userId lấy từ JWT
  @Post()
  createGroup(@Body() dto: CreateGroupDto, @Req() req: any) {
    const leaderId = req.user.sub || req.user.id;
    return this.groupsService.createGroup(dto, leaderId);
  }

  // ✅ Lấy danh sách group của user
  @Get()
  getUserGroups(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.groupsService.getGroupsByUser(userId);
  }

  // ✅ Xem chi tiết group
  @Get(':id')
  getGroupDetail(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getGroupDetail(id);
  }

  // ✅ Thêm thành viên (dùng username hoặc email)
  @Post(':groupId/add-member')
  addMember(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: AddMemberDto,
    @Req() req: any,
  ) {
    const leaderId = req.user.sub || req.user.id;
    return this.groupsService.addMember(groupId, dto.keyword, leaderId);
  }

  // ✅ Kết thúc group
  @Post(':groupId/end')
  endGroup(@Param('groupId', ParseIntPipe) groupId: number, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.groupsService.endGroup(groupId, userId);
  }
}
