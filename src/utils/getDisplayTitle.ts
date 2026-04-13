import type { Project } from './types';

export function getDisplayTitle(project: Project) {
  const lines = project.thumbTitle?.filter((line) => line.trim() !== '') ?? [];
  return lines.length > 0 ? lines : [project.title];
}