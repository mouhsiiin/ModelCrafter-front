import { ProjectList, CreateProjectButton } from "@/components/project"


export function ProjectsPage() {
  return (
    <div className="container p-6 max-w-7xl mx-auto space-y-6 relative py-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <CreateProjectButton />
      </div>
      <ProjectList />
    </div>
  )
}

