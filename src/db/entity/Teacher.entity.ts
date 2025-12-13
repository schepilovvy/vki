import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  middleName!: string;

  @Column({ nullable: true })
  teacherId?: number;
}
