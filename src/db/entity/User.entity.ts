import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  login!: string;

  @Column()
  password!: string; // Хранится как хеш bcrypt

  @Column({
    type: 'text',
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({ nullable: true })
  studentId?: number; // Связь со студентом, если роль = student

  @Column({ nullable: true })
  teacherId?: number; // Связь с преподавателем, если роль = teacher
}


