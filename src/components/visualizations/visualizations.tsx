import { VisualizationList } from "./visualization-list"
import { CreateVisualizationButton } from "./create-visualization-button"


export function VisualizationsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Visualizations</h1>
        <CreateVisualizationButton />
      </div>
      <VisualizationList />
    </div>
  )
}

