import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, Priority } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, status?: string, sortBy?: string) {
    const where: any = { userId };
    if (status === 'pending') {
      where.completed = false;
    } else if (status === 'completed') {
      where.completed = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'dueDate') {
      orderBy = { dueDate: 'asc' };
    } else if (sortBy === 'title') {
      orderBy = { title: 'asc' };
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy,
    });

    if (sortBy === 'priority') {
      const priorityWeight: Record<string, number> = {
        High: 3,
        Medium: 2,
        Low: 1,
      };
      return tasks.sort((a, b) => {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA;
      });
    }

    return tasks;
  }

  async create(userId: string, dto: CreateTaskDto) {
    const priority = dto.priority && Object.values(Priority).includes(dto.priority)
      ? (dto.priority as any)
      : 'Medium';

    return this.prisma.task.create({
      data: {
        title: dto.title,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        priority,
        completed: false,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.completed !== undefined) data.completed = dto.completed;

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}