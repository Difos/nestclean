import { PaginationParams } from "@/core/repositories/pagination-params";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaStudentsMapper } from "../mappers/prisma-student-mapper";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { StudentRepository } from "@/domain/forum/application/repositories/students-repository";

@Injectable()
export class PrismaStudentsRepository implements StudentRepository {
  constructor(private prisma: PrismaService) {}
    delete(student: Student): Promise<void> {
        throw new Error("Method not implemented.");
    }
  
  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
        return null
    }

    return PrismaStudentsMapper.toDomain(student)

  }
  
  async create(students: Student): Promise<void> {
    const data = PrismaStudentsMapper.toPersistence(students)
    await this.prisma.user.create({
        data
    })
  }
 
}
