import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
