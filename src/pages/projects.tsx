import { ProjectList, CreateProjectButton } from "@/components/project"


export function ProjectsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProjectButton />
      </div>
      <ProjectList />
    </div>
  )
}

