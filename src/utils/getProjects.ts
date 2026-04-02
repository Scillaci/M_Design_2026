import orderJson from '../data/order/projects-order.json';
import featuredOrderJson from '../data/order/featured-order.json';
import type { Project } from '../utils/types';

const order = orderJson as string[];
const featuredOrder = featuredOrderJson as string[];

export function getProjects(): {
  projects: Project[];
  featuredProjects: Project[];
} {
  const projectModules = import.meta.glob('../data/projects/*.json', { eager: true });

  const allProjects: Project[] = Object.values(projectModules).map((mod) => {
    const project = (mod as { default: Project }).default;
    return project;
  });

  const projects: Project[] = order
    .map((slug: string) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  const featuredProjects: Project[] = featuredOrder
    .map((slug: string) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  return {
    projects,
    featuredProjects
  };
}