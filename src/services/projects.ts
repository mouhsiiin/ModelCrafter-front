import api from "./api"
import { Project, ProjectForm } from "@/lib/types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};



export const getProject = async (projectId: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${projectId}`);
  return response.data;
};



export const createProject = async (project: ProjectForm): Promise<Project> => {
    const response = await api.post<Project>('/projects', project);
    return response.data;
    }


