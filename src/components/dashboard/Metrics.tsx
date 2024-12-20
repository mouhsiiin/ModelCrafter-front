import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Database, FolderOpen } from "lucide-react";
import { DashboardMetricsProps } from "@/lib/types/dashboard";
import { Link } from "react-router-dom";

export const DashboardMetrics = ({
  projectCount,
  datasetCount,
  modelCount,
}: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <Link to="/projects">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Projects
                </p>
                <p className="text-2xl font-bold">{projectCount}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Link>
      </Card>

      <Card>
        <Link to="/datasets">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Datasets
                </p>
                <p className="text-2xl font-bold">{datasetCount}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Link>
      </Card>

      <Card>
        <Link to="/models">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Models
                </p>
                <p className="text-2xl font-bold">{modelCount}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};
