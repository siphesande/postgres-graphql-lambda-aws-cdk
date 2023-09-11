import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" }) 
  title: string;

  @Column({ type: "boolean", default: false }) 
  completed: boolean;
}

