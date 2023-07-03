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
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  author: User;

  @Column({ default: 0 })
  likeCount: number;

  constructor(id: number, author: User, content: string, createdAt: Date) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.createdAt = createdAt;
    this.likeCount = 0;
  }
}
