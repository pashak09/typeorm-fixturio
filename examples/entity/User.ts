import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  // @ts-expect-error - TS2564: Property `id` as no initializer and is not definitely assigned in the constructor.
  id: number;

  @Column()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
