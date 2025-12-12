import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  studentId!: number;

  @Column()
  disciplineId!: number;

  @Column()
  grade!: number; // Оценка от 2 до 5

  @Column({ nullable: true })
  date?: string; // Дата выставления оценки в формате ISO string
}


