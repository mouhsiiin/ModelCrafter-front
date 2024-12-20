import api from "./api";
import { Project, ProjectForm } from "@/lib/types/project";

/**
 * Helper function to parse project date fields.
 * Converts `created_at` and other date strings into `Date` objects.
 */
const parseProjectDates = (project: Project): Project => {
  return {
  ...project,
  created_at: new Date(project.created_at),
}
}

/**
 * Fetch all projects and parse their date fields.
 * @returns A promise that resolves to an array of parsed Project objects.
 */
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects");
  return response.data.map(parseProjectDates); // Parse date fields
};

/**
 * Fetch recent projects and parse their date fields.
 * @returns A promise that resolves to an array of recent parsed Project objects.
 */
export const getProjectRecent = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects/recent");
  return response.data.map(parseProjectDates); // Parse date fields
};

/**
 * Fetch a specific project by its ID and parse its date fields.
 * @param projectId - The ID of the project to fetch.
 * @returns A promise that resolves to a parsed Project object.
 */
export const getProject = async (projectId: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${projectId}`);
  return parseProjectDates(response.data); // Parse date fields
};

/**
 * Create a new project.
 * @param project - The project form data to create a new project.
 * @returns A promise that resolves to the created Project object.
 */
export const createProject = async (project: ProjectForm): Promise<Project> => {
  const response = await api.post<Project>("/projects", project);
  return parseProjectDates(response.data); // Parse date fields
};

/**
 * Update an existing project.
 * @param projectId - The ID of the project to update (can be string or number).
 * @param project - The project form data with updated information.
 * @returns A promise that resolves to the updated Project object.
 */
export const updateProject = async (
  projectId: string | number,
  project: ProjectForm
): Promise<Project> => {
  // Ensure projectId is converted to a valid integer if it is a string
  const parsedId =
    typeof projectId === "string" ? parseInt(projectId, 10) : projectId;

  // Validate the parsed ID to ensure it's a number
  if (isNaN(parsedId)) {
    throw new Error("Invalid Project ID: Project ID must be a valid number");
  }

  // Make an API call to update the project
  const response = await api.put<Project>(`/projects/${parsedId}`, project);
  return parseProjectDates(response.data); // Parse date fields
};

/**
 * Delete a project by its ID.
 * @param projectId - The ID of the project to delete (can be string or number).
 * @returns A promise that resolves to void.
 */
export const deleteProject = async (
  projectId: string | number
): Promise<void> => {
  // Ensure projectId is converted to a valid integer if it is a string
  const parsedId =
    typeof projectId === "string" ? parseInt(projectId, 10) : projectId;

  // Validate the parsed ID to ensure it's a number
  if (isNaN(parsedId)) {
    throw new Error("Invalid Project ID: Project ID must be a valid number");
  }

  // Make an API call to delete the project
  await api.delete(`/projects/${parsedId}`);
};
