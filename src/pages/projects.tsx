import { ProjectList, CreateProjectButton } from "@/components/project"


export function ProjectsPage() {
  return (
    <div className="container mx-auto py-10 relative py-20 px-4 text-center">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <CreateProjectButton />
      </div>
      <ProjectList />
    </div>
  )
}

