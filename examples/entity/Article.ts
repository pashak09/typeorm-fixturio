import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  // @ts-expect-error - TS2564: Property `id` as no initializer and is not definitely assigned in the constructor.
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { nullable: false, lazy: true })
  @JoinColumn()
  author: User | Promise<User>;

  @Column({ default: 0 })
  likeCount: number;

  constructor(author: User, content: string, createdAt: Date) {
    this.author = author;
    this.content = content;
    this.createdAt = createdAt;
    this.likeCount = 0;
  }
}
