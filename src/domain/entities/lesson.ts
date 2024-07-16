import { randomUUID } from 'crypto';
import { BaseEntity } from './base-entity';

interface LessonProps {
  content: string;
}

export class Lesson extends BaseEntity<LessonProps> {
  constructor(props: LessonProps) {
    super(randomUUID(), props);
  }
}
