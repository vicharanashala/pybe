import type { Module } from '../types';
import { introModule } from './01_intro';
import { variablesModule } from './02_variables';
import { controlFlowModule } from './03_control_flow';

export const modules: Module[] = [
  introModule,
  variablesModule,
  controlFlowModule
];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getLessonById(moduleId: string, lessonId: string) {
  const m = getModuleById(moduleId);
  if (!m) return undefined;
  return m.lessons.find(l => l.id === lessonId);
}
