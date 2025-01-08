import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProjectRecent, deleteProject } from '@/services/projects';
import { Project } from '@/lib/types/project';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjectRecent();
      setProjects(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch projects. Please try again later.");
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No projects found</p>
    );
  }

  return (
    <Table className="w-full table-auto border-collapse">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left px-4 py-2">Project Name</TableHead>
          <TableHead className="text-left px-4 py-2">Status</TableHead>
          <TableHead className="text-left px-4 py-2">Created At</TableHead>
          <TableHead className="text-right px-4 py-2">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id} className="border-t">
            <TableCell className="font-medium px-4 py-2">{project.name}</TableCell>
            <TableCell className="px-4 py-2">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs ${
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
            <TableCell className="px-4 py-2">{project.created_at.toLocaleString()}</TableCell>
            <TableCell className="px-4 py-2 text-right">
              <div className="flex space-x-2 justify-end">
                <Link to={`/projects/${project.id}`}>
                  <Button size="sm">
                    Open
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={deletingProjectId === project.id}
                    >
                      {deletingProjectId === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
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
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  
}

export default ProjectList;
