import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: '' })
  uuid?: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  middleName!: string;

  @Column()
  groupId!: number;
}
