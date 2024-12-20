import api from "./api";
import { Project, ProjectForm } from "@/lib/types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects");
  return response.data;
};

export const getProjectRecent = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects/recent");
  return response.data;
};

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${projectId}`);
  return response.data;
};

export const createProject = async (project: ProjectForm): Promise<Project> => {
  const response = await api.post<Project>("/projects", project);
  return response.data;
};

export const updateProject = async (
  projectId: string | number,
  project: ProjectForm
): Promise<Project> => {
  // Ensure projectId is converted to an integer
  const parsedId =
    typeof projectId === "string" ? parseInt(projectId, 10) : projectId;

  // Validate the parsed ID
  if (isNaN(parsedId)) {
    throw new Error("Invalid Project ID: Project ID must be a valid number");
  }
  const response = await api.put<Project>(`/projects/${parsedId}`, project);
  return response.data;
};

export const deleteProject = async (
  projectId: string | number
): Promise<void> => {
  // Ensure projectId is converted to an integer
  const parsedId =
    typeof projectId === "string" ? parseInt(projectId, 10) : projectId;

  // Validate the parsed ID
  if (isNaN(parsedId)) {
    throw new Error("Invalid Project ID: Project ID must be a valid number");
  }

  // Make the API call with the valid integer ID
  await api.delete(`/projects/${parsedId}`);
};
