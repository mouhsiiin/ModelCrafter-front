import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Project, ProjectForm } from '@/lib/types/project';
import { getProjectRecent, deleteProject, createProject } from '@/services/projects';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardMetrics } from './Metrics';
import { getUserStats } from '@/services/api';

export const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [metrics, setMetrics] = useState({ projects: 0, datasets: 0, models: 0 });
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjectRecent();
      setProjects(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch recent projects. Please try again later.");
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const data = await getUserStats();
      setMetrics(data);
    } catch (err) {
      console.error("Error fetching user stats:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMetrics();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    try {
      setDeletingProjectId(projectId);
      await deleteProject(projectId);
      await fetchProjects();
      toast({
        title: 'Project deleted',
        description: 'The project has been deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'An error occurred',
        description: 'Failed to delete project. Please try again later.',
        variant: 'destructive',
      });
      console.error("Error deleting project:", err);
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData: ProjectForm = {
      name: (event.target as any).name.value,
      description: (event.target as any).description.value
    };

    try {
      await createProject(formData);
      await fetchProjects();
      toast({
        title: 'Project created',
        description: 'Your project has been created successfully',
      });
      setCreateDialogOpen(false);
    } catch (err) {
      toast({
        title: 'An error occurred',
        description: 'There was an error creating your project',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative py-20 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your machine learning projects and datasets
          </p>
        </div>
        <div className='space-x-4'>
          {/* Create project button */} 
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Create a new machine learning project. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      className="col-span-3"
                      placeholder="Enter project description"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Project</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {/* Auto Crafter button */}
          <Link to="/auto_crafter">
            <Button>
              Auto MLCrafter
            </Button>
          </Link>
        </div>
      </div>

      <DashboardMetrics
        projectCount={metrics?.projects}
        datasetCount={metrics?.datasets}
        modelCount={metrics?.models}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Projects</h2>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent projects found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell>{project.created_at.toLocaleString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/projects/${project.id}`}>
                      <Button size="sm">
                        Open
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deletingProjectId === project.id}
                          >
                            {deletingProjectId === project.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;