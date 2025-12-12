import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Homework {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  disciplineId!: number;

  @Column('text')
  description!: string;

  @Column({ nullable: true })
  dueDate?: string; // Дата выполнения в формате ISO string

  @Column({ default: '' })
  title?: string;
}


