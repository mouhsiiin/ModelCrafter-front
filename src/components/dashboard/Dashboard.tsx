import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { DashboardMetrics } from './Metrics';
import { RecentProjects } from './RecentProjects';
import { Project } from '@/lib/types/project';

export const Dashboard = () => {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Customer Segmentation',
      status: 'active',
      lastModified: '2024-12-10'
    },
    {
      id: '2',
      name: 'Sales Prediction',
      status: 'completed',
      lastModified: '2024-12-09'
    }
  ]);

  const handleCreateProject = () => {
    // Implement project creation logic
    console.log('Creating new project');
  };

  const handleOpenProject = (id: string) => {
    // Implement project opening logic
    console.log('Opening project:', id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your machine learning projects and datasets
          </p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <DashboardMetrics
        projectCount={projects.length}
        datasetCount={5}
        modelCount={3}
      />

      <RecentProjects
        projects={projects}
        onOpenProject={handleOpenProject}
      />
    </div>
  );
};