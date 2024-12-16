import { DatasetList } from "@/components/dataset/dataset-list"
import { UploadDatasetButton } from "@/components/dataset/upload-dataset-button"

export default function DatasetsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Datasets</h1>
        <UploadDatasetButton />
      </div>
      <DatasetList />
    </div>
  )
}

