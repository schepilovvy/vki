import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('discipline')
export class Discipline {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  groupId!: number;

  @Column()
  teacherId!: number;
}
