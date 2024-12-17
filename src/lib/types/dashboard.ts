import { Project } from "./project";

export interface DashboardMetricsProps {
    projectCount: number;
    datasetCount: number;
    modelCount: number;
  }
  
  export interface RecentProjectsProps {
    projects: Project[];
  }