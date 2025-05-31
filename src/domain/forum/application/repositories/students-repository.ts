import { Student } from '../../enterprise/entities/student'

export abstract class StudentRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract delete(student: Student): Promise<void>
  abstract create(student: Student): Promise<void>
}
