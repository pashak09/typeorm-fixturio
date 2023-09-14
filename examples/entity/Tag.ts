import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  // @ts-expect-error - TS2564: Property id has no initializer and is not definitely assigned in the constructor.
  id: number;

  @Column()
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}
