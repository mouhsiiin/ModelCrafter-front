import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
    DataSplitRatio,
    DimensionalityReduction,
    MissingValuesHandling,
    OutlierDetection,
    PreprocessingOptions,
    SamplingMethod,
    DataPreparationSectionProps,
    ScalingMethod,
    } from "@/lib/types/preprocessing";
import DataPreview from "./DataPreview";


const DEFAULT_PREPROCESSING_OPTIONS: PreprocessingOptions = {
  missing_values_handling: "",
  constant_value: "",
  handling_duplicates: false,
  scaling_method: "",
  dimensionality_reduction: "",
  n_components: 2,
  outlier_detection: "",
  outlier_threshold: 3,
  sampling_method: "",
  sampling_ratio: 1.0,
  data_split: "",
  custom_split_ratio: 80,
  validation_method: "",
  feature_engineering: [],
  time_series_handling: "",
  text_preprocessing: [],
};

export const DataPreparationSection: React.FC<DataPreparationSectionProps> = ({
  fileStats,
  fileSize,
  onPreprocessingChange,
}) => {
  const [preprocessingOptions, setPreprocessingOptions] =
    React.useState<PreprocessingOptions>(DEFAULT_PREPROCESSING_OPTIONS);


  const handlePreprocessingChange = (
    field: keyof PreprocessingOptions,
    value: any
  ) => {
    const newOptions = {
      ...preprocessingOptions,
      [field]: value,
    };
    setPreprocessingOptions(newOptions);
    onPreprocessingChange?.(newOptions);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Data Preparation
          <Badge variant="outline" className="ml-2">
            Advanced Options
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-3 gap-6">
          <Card >
            <CardHeader>
              <CardTitle className="text-lg">Preprocessing Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {/* Basic Preprocessing */}
                <AccordionItem value="basic">
                  <AccordionTrigger>Basic Preprocessing</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {/* Missing Values Handling */}
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Handle Missing Values
                      </Label>
                      <Select
                        value={preprocessingOptions.missing_values_handling}
                        onValueChange={(value: MissingValuesHandling) =>
                          handlePreprocessingChange(
                            "missing_values_handling",
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(MissingValuesHandling).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.charAt(0).toUpperCase() +
                                value.slice(1).replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {preprocessingOptions.missing_values_handling ===
                        MissingValuesHandling.CONSTANT && (
                        <Input
                          className="mt-2"
                          placeholder="Enter constant value"
                          value={preprocessingOptions.constant_value}
                          onChange={(e) =>
                            handlePreprocessingChange(
                              "constant_value",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>

                    {/* Duplicates Handling */}
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Handle Duplicates
                      </Label>
                      <Switch
                        checked={preprocessingOptions.handling_duplicates}
                        onCheckedChange={(checked: boolean) =>
                          handlePreprocessingChange(
                            "handling_duplicates",
                            checked
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Feature Engineering */}
                <AccordionItem value="engineering">
                  <AccordionTrigger>Feature Engineering</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {/* Feature Scaling */}
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Feature Scaling
                      </Label>
                      <Select
                        value={preprocessingOptions.scaling_method}
                        onValueChange={(value: ScalingMethod) =>
                          handlePreprocessingChange("scaling_method", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select scaling" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ScalingMethod).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.charAt(0).toUpperCase() +
                                value.slice(1).replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dimensionality Reduction */}
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Dimensionality Reduction
                      </Label>
                      <Select
                        value={preprocessingOptions.dimensionality_reduction}
                        onValueChange={(value: DimensionalityReduction) =>
                          handlePreprocessingChange(
                            "dimensionality_reduction",
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DimensionalityReduction).map(
                            (value) => (
                              <SelectItem key={value} value={value}>
                                {value.toUpperCase()}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {preprocessingOptions.dimensionality_reduction !==
                        DimensionalityReduction.NONE && (
                        <div className="mt-2">
                          <Label className="text-sm">
                            Number of Components
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            value={preprocessingOptions.n_components}
                            onChange={(e) =>
                              handlePreprocessingChange(
                                "n_components",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Advanced Processing */}
                <AccordionItem value="advanced">
                  <AccordionTrigger>Advanced Processing</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {/* Outlier Detection */}
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Outlier Detection
                      </Label>
                      <Select
                        value={preprocessingOptions.outlier_detection}
                        onValueChange={(value: OutlierDetection) =>
                          handlePreprocessingChange("outlier_detection", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(OutlierDetection).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {preprocessingOptions.outlier_detection !==
                        OutlierDetection.NONE && (
                        <div className="mt-2">
                          <Label className="text-sm">Threshold</Label>
                          <Slider
                            value={[preprocessingOptions.outlier_threshold]}
                            onValueChange={([value]) =>
                              handlePreprocessingChange(
                                "outlier_threshold",
                                value
                              )
                            }
                            min={1}
                            max={5}
                            step={0.1}
                          />
                        </div>
                      )}
                    </div>

                    {/* Sampling Methods */}
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Sampling Method
                      </Label>
                      <Select
                        value={preprocessingOptions.sampling_method}
                        onValueChange={(value: SamplingMethod) =>
                          handlePreprocessingChange("sampling_method", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(SamplingMethod).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Validation Settings */}
                <AccordionItem value="validation">
                  <AccordionTrigger>Validation Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {/* Data Split */}
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Data Split Ratio
                      </Label>
                      <Select
                        value={preprocessingOptions.data_split}
                        onValueChange={(value: DataSplitRatio) =>
                          handlePreprocessingChange("data_split", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select split ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DataSplitRatio).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value === "custom"
                                ? "Custom Split"
                                : `${value.split("-")[0]}% Train - ${
                                    value.split("-")[1]
                                  }% Test`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {preprocessingOptions.data_split ===
                        DataSplitRatio.CUSTOM && (
                        <div className="mt-2">
                          <Label className="text-sm">
                            Training Set Percentage
                          </Label>
                          <Slider
                            value={[preprocessingOptions.custom_split_ratio]}
                            onValueChange={([value]) =>
                              handlePreprocessingChange(
                                "custom_split_ratio",
                                value
                              )
                            }
                            min={50}
                            max={95}
                            step={5}
                          />
                          <div className="text-sm text-muted-foreground mt-1">
                            Train: {preprocessingOptions.custom_split_ratio}% -
                            Test:{" "}
                            {100 - preprocessingOptions.custom_split_ratio}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cross Validation */}
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Validation Method
                      </Label>
                      <Select
                        value={preprocessingOptions.validation_method}
                        onValueChange={(value) =>
                          handlePreprocessingChange("validation_method", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select validation method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            Hold-out Validation
                          </SelectItem>
                          <SelectItem value="kfold">
                            K-Fold Cross Validation
                          </SelectItem>
                          <SelectItem value="stratified">
                            Stratified K-Fold
                          </SelectItem>
                          <SelectItem value="timeseries">
                            Time Series Split
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>


          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">
                Data Preview & Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DataPreview fileStats={fileStats} fileSize={fileSize} />
            </CardContent>
          </Card>


        </div>
      </CardContent>
    </Card>
  );
};
