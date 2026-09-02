import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('tasks')
@UseGuards(ClerkAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    const userId = req.user.userId;
    return this.tasksService.findAll(userId, status, sortBy);
  }

  @Post()
  async create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.userId;
    return this.tasksService.create(userId, createTaskDto);
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = req.user.userId;
    return this.tasksService.update(userId, id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.tasksService.remove(userId, id);
  }
}