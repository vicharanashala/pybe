export interface LessonMeta {
  id: string;
  title: string;
}

export interface Chapter {
  id: string;
  title: string;
  theme: string;
  concept: string;
  lessons: LessonMeta[];
  isLocked: boolean;
}
