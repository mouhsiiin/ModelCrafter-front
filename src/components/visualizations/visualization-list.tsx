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

const initialVisualizations = [
  {
    id: 1,
    name: "Model Accuracy Comparison",
    type: "Bar Chart",
    createdAt: "2023-05-01",
  },
  {
    id: 2,
    name: "Feature Importance",
    type: "Heatmap",
    createdAt: "2023-04-15",
  },
  {
    id: 3,
    name: "Training Loss Over Time",
    type: "Line Chart",
    createdAt: "2023-05-10",
  },
]

export function VisualizationList() {
  const [visualizations, setVisualizations] = useState(initialVisualizations)

  const deleteVisualization = (id: number) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visualizations.map((viz) => (
          <TableRow key={viz.id}>
            <TableCell className="font-medium">{viz.name}</TableCell>
            <TableCell>{viz.type}</TableCell>
            <TableCell>{viz.createdAt}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button asChild size="sm">
                  <Link to={`/visualizations/${viz.id}`}>
                    View
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteVisualization(viz.id)}>
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

