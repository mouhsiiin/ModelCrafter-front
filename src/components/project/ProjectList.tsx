import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const initialProjects = [
  {
    id: 1,
    name: "Customer Churn Prediction",
    description: "Predict customer churn using machine learning",
    status: "In Progress",
    createdAt: "2024-01-15",
    team: "Data Science",
  },
  {
    id: 2,
    name: "E-commerce Recommendation System",
    description: "Build a recommendation system for an e-commerce platform",
    status: "Planning",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Fraud Detection Model",
    description: "Detect fraudulent transactions in real-time",
    status: "Completed",
    createdAt: "2023-12-10",
  }
]

export function ProjectList() {
  const [projects, setProjects] = useState(initialProjects)

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>
              <span className={`
                ${project.status === 'Completed' ? 'text-green-500' : 
                  project.status === 'In Progress' ? 'text-blue-500' : 
                  'text-yellow-500'}
              `}>
                {project.status}
              </span>
            </TableCell>
            <TableCell>{project.createdAt}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button asChild size="sm">
                  <Link to={`/projects/${project.id}`}>
                    Open
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}