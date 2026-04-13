import orderJson from '../data/order/projects-order.json';
import type { Project } from '../utils/types';

type ProjectOrderGroup = {
  label: string;
  projects: string[];
};

const orderGroups = orderJson as ProjectOrderGroup[];

const thumbsOrder =
  orderGroups.find((group) => group.label === 'thumbs')?.projects ?? [];

const featuredOrder =
  orderGroups.find((group) => group.label === 'featured')?.projects ?? [];

const alwaysFeaturedOrder =
  orderGroups.find((group) => group.label === 'alwaysFeatured')?.projects ?? [];

export function getProjects(): {
  projects: Project[];
  featuredProjects: Project[];
  alwaysFeaturedProjects: Project[];
} {
  const projectModules = import.meta.glob('../data/projects/*.json', { eager: true });

  const allProjects: Project[] = Object.values(projectModules).map((mod) => {
    const project = (mod as { default: Project }).default;
    return project;
  });

  const projects: Project[] = thumbsOrder
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  const featuredProjects: Project[] = featuredOrder
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  const alwaysFeaturedProjects: Project[] = alwaysFeaturedOrder
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  return {
    projects,
    featuredProjects,
    alwaysFeaturedProjects
  };
}