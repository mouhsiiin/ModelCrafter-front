export interface Project {
    id: string;
    name: string;
    status: 'active' | 'completed' | 'archived';
    lastModified: string;
  }

export interface ProjectForm {
  name: string;
  description: string;
}