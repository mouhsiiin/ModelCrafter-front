export interface Project {
    id: string;
    name: string;
    status: 'active' | 'completed' | 'archived';
    lastModified: string;
    created_at: Date;
  }

export interface ProjectForm {
  name: string;
  description: string;
}