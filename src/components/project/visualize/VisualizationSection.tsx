import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select as AntSelect, InputNumber, Switch } from "antd";
import {
  getChartScatter,
  getChartLine,
  getChartBar,
  getChartHistogram,
  getChartBox,
  getChartHeatmap,
} from "@/services/charts";
import { getProjectDatasets } from "@/services/datasets";

import { Column } from "@/lib/types/preprocessing";

interface Base64ImageProps {
  base64String?: string;
  altText?: string;
  className?: string;
}

interface ChartOptions {
  hue?: string;
  bins?: number;
  kde?: boolean;
  aggregation?: string;
  additionalYColumns?: string[];
}

interface VisualizationSectionProps {
  columns?: Column[];
  projectId?: string;
}

const Base64Image: React.FC<Base64ImageProps> = ({
  base64String,
  altText = "Preview image",
  className = "",
}) => {
  console.log(base64String);
  if (!base64String) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-100 rounded-md">
        <p className="text-sm text-slate-500">No image to preview</p>
      </div>
    );
  }

  return (
    <img
      src={`data:image/png;base64,${base64String}`}
      alt={altText}
      className={`max-w-full h-auto ${className}`}
    />
  );
};

export const VisualizationSection: React.FC<VisualizationSectionProps> = ({
  columns = [],
  projectId,
}) => {
  const [chartType, setChartType] = useState<string>("");
  const [base64Data, setBase64Data] = useState<
    { plot: string; message: string } | undefined
  >(undefined);
  const [featureX, setFeatureX] = useState<string>("");
  const [featureY, setFeatureY] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [datasetId, setDatasetId] = useState<string | undefined>(undefined);
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    bins: 10,
    kde: false,
    aggregation: "mean",
    additionalYColumns: [],
  });

  const columnOptions = columns?.map((column) => ({
    value: column.name,
    label: column.name,
  }));

  const fetchProjectDatasets = async () => {
    try {
      const datasets = await getProjectDatasets(projectId);
      setDatasetId(datasets[0]?.id);
    } catch (err) {
      console.error("Error fetching project datasets:", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDatasets();
    }
  }, [projectId]);
  const aggregationOptions = [
    { value: "mean", label: "Mean" },
    { value: "sum", label: "Sum" },
    { value: "count", label: "Count" },
    { value: "median", label: "Median" },
  ];

  const fetchChartData = async () => {
    if (
      !chartType ||
      !featureX ||
      (!featureY && !["histogram", "heatmap"].includes(chartType))
    )
      return;

    setLoading(true);
    setError("");

    try {
      let response: string;
      switch (chartType) {
        case "scatter":
          response = await getChartScatter({
            dataset_id: datasetId,
            x_column: featureX,
            y_column: featureY,
            hue_column: chartOptions.hue,
          });
          break;
        case "line":
            let y_columns = [featureY];
          if (chartOptions.additionalYColumns) {
            y_columns = [...y_columns, ...chartOptions.additionalYColumns];
          }

          response = await getChartLine({
            dataset_id: datasetId ?? "",
            x_column: featureX,
            y_columns: y_columns,
          });
          break;
        case "bar":
          response = await getChartBar({
            dataset_id: datasetId,
            x_column: featureX,
            y_column: featureY,
            aggregation: chartOptions.aggregation,
          });
          break;
        case "histogram":
          response = await getChartHistogram({
            dataset_id: datasetId,
            column: featureX,
            bins: chartOptions.bins,
            kde: chartOptions.kde,
          });
          break;
        case "box":
          response = await getChartBox({
            dataset_id: datasetId,
            y_column: featureY,
            x_column: featureX,
          });
          break;
        case "heatmap":
          response = await getChartHeatmap({
            dataset_id: datasetId,
            columns: [featureX, featureY].filter(Boolean),
          });
          break;
        default:
          throw new Error("Invalid chart type");
      }

      if (typeof response === "object" && response) {
        setBase64Data(response);
      } else {
        setBase64Data(response ? JSON.parse(response) : undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate chart");
    } finally {
      setLoading(false);
    }
  };

  const renderChartSpecificOptions = () => {
    switch (chartType) {
      case "scatter":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Color Group (Optional)
              </label>
              <AntSelect
                showSearch
                style={{ width: "100%" }}
                placeholder="Select grouping feature"
                value={chartOptions.hue}
                onChange={(value) =>
                  setChartOptions((prev) => ({ ...prev, hue: value }))
                }
                options={columnOptions}
                allowClear
              />
            </div>
          </div>
        );

      case "histogram":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Bins
              </label>
              <InputNumber
                min={1}
                max={100}
                value={chartOptions.bins}
                onChange={(value) =>
                  setChartOptions((prev) => ({ ...prev, bins: value ?? 10 }))
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Show Density Estimation
              </label>
              <Switch
                checked={chartOptions.kde}
                onChange={(checked) =>
                  setChartOptions((prev) => ({ ...prev, kde: checked }))
                }
              />
            </div>
          </div>
        );

      case "bar":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Aggregation Method
              </label>
              <AntSelect
                style={{ width: "100%" }}
                value={chartOptions.aggregation}
                onChange={(value) =>
                  setChartOptions((prev) => ({ ...prev, aggregation: value }))
                }
                options={aggregationOptions}
              />
            </div>
          </div>
        );

      case "line":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Y Columns
              </label>
              <AntSelect
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select additional lines to plot"
                value={chartOptions.additionalYColumns}
                onChange={(value) =>
                  setChartOptions((prev) => ({
                    ...prev,
                    additionalYColumns: value,
                  }))
                }
                options={columnOptions.filter((opt) => opt.value !== featureY)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [chartType, featureX, featureY, chartOptions, datasetId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chart Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chart Type
                </label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="histogram">Histogram</SelectItem>
                    <SelectItem value="box">Box Plot</SelectItem>
                    <SelectItem value="heatmap">Heat Map</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {chartType === "histogram" ? "Feature" : "Feature: X"}
                </label>
                <AntSelect
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Search and select feature"
                  value={featureX}
                  onChange={setFeatureX}
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={columnOptions}
                />
              </div>

              {chartType !== "histogram" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Feature: Y
                  </label>
                  <AntSelect
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Search and select feature"
                    value={featureY}
                    onChange={setFeatureY}
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={columnOptions}
                  />
                </div>
              )}

              {renderChartSpecificOptions()}
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground">Loading chart...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : chartType &&
                featureX &&
                (chartType === "histogram" || featureY) ? (
                <Base64Image
                  base64String={base64Data?.plot}
                  altText={`${chartType} chart preview of ${featureX}${
                    featureY ? ` vs ${featureY}` : ""
                  }`}
                  className="rounded-md"
                />
              ) : (
                <p className="text-muted-foreground">
                  Select chart type and features to preview
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationSection;
