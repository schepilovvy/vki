import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  teacherId?: number;

  @Column({ nullable: true })
  course?: number;

  @Column({ nullable: true })
  specialty?: string;
}
