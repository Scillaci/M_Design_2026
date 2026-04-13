
export interface Collaborator {
  title: string;
  name: string;
}

export interface Project {
  slug: string;
  title: string;
  thumbTitle: string[];
  subtitle?: string;
  client?: string;
  year?: string;
  category?: string[];
  headline?: string[];
  list?: string[];
  poster?: string;
  thumbs?: string[];
  videos?: string[];
  overview?: string[];
  role?: string[];
  collaborators?: Collaborator[];
}

